import test from 'ava';
import retry from '../lib';
import fetch from 'node-fetch';
import sleep from 'then-sleep';

test('return value', async (t) => {
  const val = await retry(async (bail, num) => {
    if (num < 2) throw new Error('woot');
    await sleep(50);
    return 'woot ' + num;
  });
  t.same('woot 2', val);
});

test('return value no await', async (t) => {
  const val = await retry(async (bail, num) => num);
  t.same(1, val);
});

test('chained promise', async (t) => {
  const res = await retry(async (bail, num) => {
    if (num < 2) throw new Error('retry');
    return fetch('https://www.wikipedia.org');
  });
  t.same(200, res.status);
});

test('bail', async (t) => {
  try {
    await retry(async (bail, num) => {
      if (num === 2) {
        bail(new Error('Wont retry'));
      }

      throw new Error('Test ' + num);
    }, { retries: 10 });
  } catch (err) {
    t.same('Wont retry', err.message);
  }
});

test('with non-async functions', async (t) => {
  try {
    await retry((bail, num) => {
      throw new Error('Test ' + num);
    }, { retries: 2 });
  } catch (err) {
    t.same('Test 3', err.message);
  }
});

test('return non-async', async (t) => {
  const val = await retry(() => 5);
  t.same(5, val);
});
