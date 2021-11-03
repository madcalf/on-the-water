const sum = require('./sum');

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});

it('tests the thing below', () => {
  expect([1, 3, 5, 7]).toContain(3);
});
