import BaseError from '../errors/BaseError.js';
import ac from '../permissions/accessControl.js';

const checkPermissions = (action, resource) => (req, res, next) => {
    const { user } = req; // Assuming you have user information in the request object

    if (!user) {
        return next(new BaseError('Unauthorized.', 403));
    }

    const permission = ac.can(user.role)[action](resource);

    if (!permission.granted) {
        return next(new BaseError('Unauthorized.', 403));
    }

    return next();
};

export default checkPermissions;
