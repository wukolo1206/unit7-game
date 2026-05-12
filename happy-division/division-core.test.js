const assert = require('assert');
const core = require('./division-core.js');

function test(name, fn) {
  try {
    fn();
    console.log('PASS ' + name);
  } catch (error) {
    console.error('FAIL ' + name);
    console.error(error.message);
    process.exitCode = 1;
  }
}

test('sharing mode distributes one item to each group per move', () => {
  const problem = core.createVisualProblem({
    type: 'sharing',
    total: 12,
    groups: 3,
    perGroup: 4,
    itemEmoji: 'cookie'
  });

  let state = core.moveVisualBatch(problem, 0);
  state = core.moveVisualBatch(problem, state.distributed);
  state = core.moveVisualBatch(problem, state.distributed);
  state = core.moveVisualBatch(problem, state.distributed);

  assert.deepStrictEqual(state.groupCounts, [4, 4, 4]);
  assert.strictEqual(state.distributed, 12);
  assert.strictEqual(state.remaining, 0);
  assert.strictEqual(state.isComplete, true);
});

test('grouping mode creates bags using the per-group amount per move', () => {
  const problem = core.createVisualProblem({
    type: 'grouping',
    total: 12,
    groups: 3,
    perGroup: 4,
    itemEmoji: 'apple'
  });

  let state = core.moveVisualBatch(problem, 0);
  state = core.moveVisualBatch(problem, state.distributed);
  state = core.moveVisualBatch(problem, state.distributed);

  assert.deepStrictEqual(state.groupCounts, [4, 4, 4]);
  assert.strictEqual(state.distributed, 12);
  assert.strictEqual(state.isComplete, true);
});

test('special self division always has quotient one', () => {
  const sharing = core.createSpecialProblem('self', 6, 'sharing', 'star');
  const grouping = core.createSpecialProblem('self', 6, 'grouping', 'star');

  assert.strictEqual(core.getExpression(sharing).quotient, 1);
  assert.strictEqual(core.getExpression(grouping).quotient, 1);
});

test('special divide by one keeps the original number as quotient', () => {
  const sharing = core.createSpecialProblem('one', 6, 'sharing', 'star');
  const grouping = core.createSpecialProblem('one', 6, 'grouping', 'star');

  assert.strictEqual(core.getExpression(sharing).quotient, 6);
  assert.strictEqual(core.getExpression(grouping).quotient, 6);
});

test('remainder mode finishes only when the remainder is smaller than the divisor', () => {
  const active = core.getRemainderStatus({ total: 17, divisor: 5, currentQuotient: 2 });
  const finished = core.getRemainderStatus({ total: 17, divisor: 5, currentQuotient: 3 });

  assert.deepStrictEqual(active, {
    remainder: 7,
    canMakeBatch: true,
    isComplete: false,
    comparison: 'too-big'
  });
  assert.deepStrictEqual(finished, {
    remainder: 2,
    canMakeBatch: false,
    isComplete: true,
    comparison: 'small-enough'
  });
});

test('practice answer accepts only the quotient', () => {
  assert.strictEqual(core.checkPracticeAnswer({ quotient: 7 }, '7'), true);
  assert.strictEqual(core.checkPracticeAnswer({ quotient: 7 }, '6'), false);
  assert.strictEqual(core.checkPracticeAnswer({ quotient: 7 }, ''), false);
});
