const { ACTIVE_WINDOW_MS, getActiveNow, registerHeartbeat } = require('../utils/activityTracker');

const activityController = {
    heartbeat: (req, res) => {
        const visitorId = req.body?.visitorId?.trim();

        if (!visitorId) {
            return res.status(400).json({ message: 'visitorId is required.' });
        }

        const activeNow = registerHeartbeat(visitorId);

        return res.status(200).json({
            activeNow,
            windowMs: ACTIVE_WINDOW_MS
        });
    },

    getActiveNow: (req, res) => {
        return res.status(200).json({
            activeNow: getActiveNow(),
            windowMs: ACTIVE_WINDOW_MS
        });
    }
};

module.exports = activityController;
