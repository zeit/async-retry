// Packages
var retrier = require('retry');

function retry(fn, opts) {
  function run(resolve, reject) {
    var options = opts || {};
    var op;
    var delay = options.retryDelay;

    // Default `randomize` to true
    if (!('randomize' in options)) {
      options.randomize = true;
    }

    op = retrier.operation(options);

    // We allow the user to abort retrying
    // this makes sense in the cases where
    // knowledge is obtained that retrying
    // would be futile (e.g.: auth errors)

    function bail(err) {
      reject(err || new Error('Aborted'));
    }

    function onError(err, num) {
      if (err && err.bail) {
        bail(err);
        return;
      }

      if (!op.retry(err)) {
        reject(op.mainError());
      } else if (options.onRetry) {
        options.onRetry(err, num);
      }
    }

    function runAttempt(num) {
      var val;

      try {
        val = fn(bail, num);
      } catch (err) {
        onError(err, num);
        return;
      }

      Promise.resolve(val)
        .then(resolve)
        .catch(function catchIt(err) {
          onError(err, num);
        });
    }

    op.attempt(num => {
      if (delay && num > 1) {
        setTimeout(() => {
          runAttempt(num);
        }, delay);
      } else {
        runAttempt(num);
      }
    });
  }

  return new Promise(run);
}

module.exports = retry;
