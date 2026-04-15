const ACTIVE_WINDOW_MS = 75 * 1000;

const activeVisitors = new Map();

const pruneExpiredVisitors = () => {
    const cutoff = Date.now() - ACTIVE_WINDOW_MS;

    for (const [visitorId, lastSeenAt] of activeVisitors.entries()) {
        if (lastSeenAt < cutoff) {
            activeVisitors.delete(visitorId);
        }
    }
};

const registerHeartbeat = (visitorId) => {
    pruneExpiredVisitors();
    activeVisitors.set(visitorId, Date.now());
    return activeVisitors.size;
};

const getActiveNow = () => {
    pruneExpiredVisitors();
    return activeVisitors.size;
};

module.exports = {
    ACTIVE_WINDOW_MS,
    getActiveNow,
    registerHeartbeat
};
