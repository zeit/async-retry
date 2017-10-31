// Packages
const retrier = require('retry')

module.exports = (fn, opts) => {
  opts = opts || {}

  return new Promise((resolve, reject) => {
    const op = retrier.operation(opts)

    // We allow the user to abort retrying
    // this makes sense in the cases where
    // knowledge is obtained that retrying
    // would be futile (e.g.: auth errors)
    const bail = err => reject(err || new Error('Aborted'))

    const onError = err => {
      if (err.bail) {
        return bail(err)
      }
      if (!op.retry(err)) {
        reject(op.mainError())
      } else if (opts.onRetry) {
        opts.onRetry(err)
      }
    }

    op.attempt(num => {
      let val

      try {
        val = fn(bail, num)
      } catch (err) {
        return onError(err)
      }

      Promise.resolve(val).then(resolve, onError)
    })
  })
}
