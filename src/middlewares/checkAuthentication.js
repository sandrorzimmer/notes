import jwt from 'jsonwebtoken';
import BaseError from '../errors/BaseError.js';

const checkAuthentication = (req, res, next) => {
    // Get the token from the request headers
    const authHeader = req.headers.authorization;

    // Check if the token exists
    if (!authHeader) {
        return next(new BaseError('No token provided.', 401));
    }

    try {
        // Extract the token from the "Bearer" prefix
        const token = authHeader.split(' ')[1];

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Set the authenticated user on the request object
        req.user = decoded;

        // Proceed to the next middleware or route handler
        return next();
    } catch (error) {
        return next(new BaseError('Invalid token.', 401));
    }
};

export default checkAuthentication;
