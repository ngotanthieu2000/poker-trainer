function createInMemoryHandHistoryStore() {
  const hands = new Map();

  function startHand(payload = {}) {
    const { handId, sessionId = 'session-local', context = {}, startedAt = new Date().toISOString() } = payload;

    if (!handId) {
      throw new Error('handId is required');
    }

    const hand = {
      handId,
      sessionId,
      context,
      startedAt,
      timeline: [],
      coachLogs: [],
    };

    hands.set(handId, hand);
    return hand;
  }

  function requireHand(handId) {
    const hand = hands.get(handId);
    if (!hand) {
      throw new Error('hand not found');
    }
    return hand;
  }

  function appendTimelineEvent(handId, event = {}) {
    const hand = requireHand(handId);
    const timelineEvent = {
      ...event,
      index: hand.timeline.length,
      at: event.at || new Date().toISOString(),
    };
    hand.timeline.push(timelineEvent);
    return timelineEvent;
  }

  function appendCoachLog(handId, log = {}) {
    const hand = requireHand(handId);
    const coachLog = {
      ...log,
      at: log.at || new Date().toISOString(),
    };
    hand.coachLogs.push(coachLog);
    return coachLog;
  }

  function getHand(handId) {
    const hand = requireHand(handId);
    return JSON.parse(JSON.stringify(hand));
  }

  return {
    startHand,
    appendTimelineEvent,
    appendCoachLog,
    getHand,
  };
}

module.exports = {
  createInMemoryHandHistoryStore,
};
