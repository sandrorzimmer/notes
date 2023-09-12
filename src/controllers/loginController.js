import jwt from 'jsonwebtoken';
import BaseError from '../errors/BaseError.js';
import User from '../models/User.js';

class LoginController {
    static authenticate = async (req, res, next) => {
        try {
            const { username, password } = req.body;

            // Find the user by username
            const user = await User.findOne({ username });

            if (!user) {
                return next(new BaseError('Invalid username or password.', 401));
            }

            // Compare the provided password with the stored hashed password
            const isPasswordValid = await user.comparePassword(password);
            if (!isPasswordValid) {
                return next(new BaseError('Invalid username or password.', 401));
            }

            // Generate a JWT token
            const userId = user._id.toString();
            const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRATION,
            });

            return res.json({ token });
        } catch (error) {
            return next(error);
        }
    };
}

export default LoginController;
