function createDecisionLogEntry({
  sessionId,
  handId,
  round,
  actor,
  action,
  reason,
  timestamp = new Date().toISOString(),
}) {
  if (!sessionId || !handId || !round || !actor || !action) {
    throw new Error('Missing required decision log fields');
  }

  return {
    sessionId,
    handId,
    round,
    actor,
    action,
    reason: reason || 'n/a',
    timestamp,
  };
}

function createDecisionLogger(sink = []) {
  return {
    sink,
    logDecision(payload) {
      const entry = createDecisionLogEntry(payload);
      sink.push(entry);
      return entry;
    },
  };
}

module.exports = {
  createDecisionLogEntry,
  createDecisionLogger,
};
