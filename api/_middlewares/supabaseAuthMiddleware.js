const { verifyCredentials, createContextClient } = require('@supabase/server/core');

// Verifies a Supabase-issued JWT (Authorization: Bearer <token>) against the
// project's JWKS. On success attaches:
//   req.supabaseUser — verified user claims ({ id, email, role, ... })
//   req.supabase     — RLS-scoped client acting as that user
const supabaseAuthMiddleware = async (req, res, next) => {
    const authHeader = req.header('Authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
    const apikey = req.header('apikey') || null;

    const { data: auth, error } = await verifyCredentials({ token, apikey }, { auth: 'user' });

    if (error) {
        return res.status(error.status || 401).json({ message: error.message });
    }

    req.supabaseUser = auth.userClaims;
    req.supabase = createContextClient({
        auth: { token: auth.token, keyName: auth.keyName },
    });
    next();
};

module.exports = supabaseAuthMiddleware;
