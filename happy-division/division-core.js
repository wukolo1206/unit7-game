(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  }
  root.DivisionCore = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function createVisualProblem(options) {
    var type = options.type === 'grouping' ? 'grouping' : 'sharing';
    var total = Math.max(1, Number(options.total) || 1);
    var groups = Math.max(1, Number(options.groups) || 1);
    var perGroup = Math.max(1, Number(options.perGroup) || 1);

    return {
      type: type,
      total: total,
      groups: groups,
      perGroup: perGroup,
      itemEmoji: options.itemEmoji || 'circle'
    };
  }

  function getBatchSize(problem) {
    return problem.type === 'sharing' ? problem.groups : problem.perGroup;
  }

  function getGroupCounts(problem, distributed) {
    var count = clamp(Number(distributed) || 0, 0, problem.total);
    var counts = [];
    var i;

    if (problem.type === 'sharing') {
      var each = Math.floor(count / problem.groups);
      for (i = 0; i < problem.groups; i += 1) {
        counts.push(each);
      }
      return counts;
    }

    var fullGroups = Math.floor(count / problem.perGroup);
    for (i = 0; i < problem.groups; i += 1) {
      counts.push(i < fullGroups ? problem.perGroup : 0);
    }
    return counts;
  }

  function summarizeVisual(problem, distributed) {
    var count = clamp(Number(distributed) || 0, 0, problem.total);
    return {
      distributed: count,
      remaining: problem.total - count,
      batchSize: getBatchSize(problem),
      groupCounts: getGroupCounts(problem, count),
      isComplete: count >= problem.total
    };
  }

  function moveVisualBatch(problem, distributed) {
    var summary = summarizeVisual(problem, distributed);
    var next = clamp(summary.distributed + summary.batchSize, 0, problem.total);
    return summarizeVisual(problem, next);
  }

  function createSpecialProblem(kind, number, visualType, itemEmoji) {
    var value = Math.max(2, Number(number) || 2);
    var type = visualType === 'grouping' ? 'grouping' : 'sharing';

    if (kind === 'one') {
      if (type === 'sharing') {
        return createVisualProblem({
          type: 'sharing',
          total: value,
          groups: 1,
          perGroup: value,
          itemEmoji: itemEmoji
        });
      }
      return createVisualProblem({
        type: 'grouping',
        total: value,
        groups: value,
        perGroup: 1,
        itemEmoji: itemEmoji
      });
    }

    if (type === 'sharing') {
      return createVisualProblem({
        type: 'sharing',
        total: value,
        groups: value,
        perGroup: 1,
        itemEmoji: itemEmoji
      });
    }
    return createVisualProblem({
      type: 'grouping',
      total: value,
      groups: 1,
      perGroup: value,
      itemEmoji: itemEmoji
    });
  }

  function getExpression(problem) {
    if (problem.type === 'sharing') {
      return {
        dividend: problem.total,
        divisor: problem.groups,
        quotient: problem.perGroup
      };
    }
    return {
      dividend: problem.total,
      divisor: problem.perGroup,
      quotient: problem.groups
    };
  }

  function getRemainderStatus(problem) {
    var used = (Number(problem.currentQuotient) || 0) * problem.divisor;
    var remainder = Math.max(0, problem.total - used);
    var canMakeBatch = remainder >= problem.divisor;
    return {
      remainder: remainder,
      canMakeBatch: canMakeBatch,
      isComplete: !canMakeBatch,
      comparison: canMakeBatch ? 'too-big' : 'small-enough'
    };
  }

  function checkPracticeAnswer(problem, answer) {
    if (answer === '' || answer === null || typeof answer === 'undefined') {
      return false;
    }
    return Number(answer) === problem.quotient;
  }

  return {
    createVisualProblem: createVisualProblem,
    createSpecialProblem: createSpecialProblem,
    getBatchSize: getBatchSize,
    getGroupCounts: getGroupCounts,
    summarizeVisual: summarizeVisual,
    moveVisualBatch: moveVisualBatch,
    getExpression: getExpression,
    getRemainderStatus: getRemainderStatus,
    checkPracticeAnswer: checkPracticeAnswer
  };
});
