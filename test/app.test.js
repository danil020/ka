const test = require('node:test');
const assert = require('node:assert/strict');

test('validasi runtime Node.js tersedia', () => {
  assert.equal(2 + 2, 4);
  assert.ok(process.version.startsWith('v'));
});
