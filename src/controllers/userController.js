import bcrypt from 'bcryptjs';
import BadRequest from '../errors/BadRequest.js';
import NotFound from '../errors/NotFound.js';
import User from '../models/User.js';
import validatePassword from '../utils/validatePassword.js';

class UserController {
    static showAll = async (req, res, next) => {
        try {
            const searchAll = User.find();

            req.result = searchAll;

            return next();
        } catch (error) {
            return next(error);
        }
    };

    static showOneById = async (req, res, next) => {
        try {
            const { id } = req.params;
            const result = await User.findById(id);

            if (!result) {
                return next(new NotFound('ID not found.'));
            }

            return res.status(200).json(result);
        } catch (error) {
            return next(error);
        }
    };

    static addOne = async (req, res, next) => {
        try {
            const { username } = req.body;

            const existingUser = await User.findOne({ username });

            if (existingUser !== null) {
                return next(new BadRequest('This username is already used.'));
            }

            const newUser = new User(req.body);
            const result = await newUser.save();

            return res.status(201).json(result);
        } catch (error) {
            return next(error);
        }
    };

    static updateOne = async (req, res, next) => {
        try {
            const { id } = req.params;
            const updatedOne = req.body;
            const { username } = updatedOne;

            // Ensure that the username is unique, except for the current user being updated
            if (username) {
                if (username.trim().length <= 0) {
                    return next(new BadRequest('Username is required.'));
                }
                const existingUser = await User.find({
                    username,
                    _id: { $ne: id },
                });
                if (existingUser.length > 0) {
                    return next(new BadRequest('This username is already used.'));
                }
            }

            // Hash the new password before updating
            if (updatedOne.password || updatedOne.password === '') {
                if (!validatePassword(updatedOne.password)) {
                    return next(new BadRequest('Password is not valid.'));
                }
                const salt = await bcrypt.genSalt(10);
                updatedOne.password = await bcrypt.hash(updatedOne.password, salt);
            }

            const result = await User.findByIdAndUpdate(
                id,
                updatedOne,
                {
                    new: true,
                    runValidators: true,
                },
            );

            if (!result) {
                return next(new NotFound('ID not found.'));
            }

            return res.status(200).json(result);
        } catch (error) {
            return next(error);
        }
    };

    static deleteOne = async (req, res, next) => {
        try {
            const { id } = req.params;

            const result = await User.findByIdAndDelete(id);

            if (!result) {
                return next(new NotFound('ID not found.'));
            }

            return res.status(200).json({ message: `ID ${id} deleted successfully.` });
        } catch (error) {
            return next(error);
        }
    };
}

export default UserController;
