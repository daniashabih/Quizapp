export const ACTIVE_VISITOR_KEY = 'active-visitor-id';
export const ACTIVITY_HEARTBEAT_INTERVAL_MS = 25000;

export const getVisitorId = () => {
    const savedVisitorId = localStorage.getItem(ACTIVE_VISITOR_KEY);

    if (savedVisitorId) {
        return savedVisitorId;
    }

    const visitorId = window.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(ACTIVE_VISITOR_KEY, visitorId);
    return visitorId;
};
