import BadRequest from '../errors/BadRequest.js';
import NotFound from '../errors/NotFound.js';
import Tag from '../models/Tag.js';
import User from '../models/User.js';

class TagController {
    static showAll = async (req, res, next) => {
        try {
            const { user } = req;
            const searchAll = Tag.find({
                owner: user.userId,
            });

            req.result = searchAll;

            return next();
        } catch (error) {
            return next(error);
        }
    };

    static showOneById = async (req, res, next) => {
        try {
            const { id } = req.params;
            const result = await Tag.findById(id);

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
            const { name } = req.body;
            const { user } = req;

            const existingName = await Tag.findOne({
                name,
                owner: user.userId,

            });

            if (existingName) {
                return next(new BadRequest('Tag already exists.'));
            }

            req.body.owner = req.user.userId;
            const newOne = new Tag(req.body);
            const result = await newOne.save();

            return res.status(201).json(result);
        } catch (error) {
            return next(error);
        }
    };

    static updateOne = async (req, res, next) => {
        try {
            const { name } = req.body;
            const { id } = req.params;
            const { user } = req;

            if (name) {
                if (name.trim().length <= 0) {
                    return next(new BadRequest('Tag name is required.'));
                }
            }

            const existingName = await Tag.find({
                name,
                _id: { $ne: id },
                owner: user.userId,
            });
            if (existingName.length > 0) {
                return next(new BadRequest('Tag already exists.'));
            }

            const updatedOne = req.body;

            const tag = await Tag.findById(id);

            if (!tag) {
                return next(new NotFound('ID not found.'));
            }

            // Update the tag fields with the new values
            tag.name = updatedOne.name;
            // Set the updatedAt field to the current date
            tag.updatedAt = new Date();

            const result = await tag.save();

            // const result = await Tag.findByIdAndUpdate(id, updatedOne, { new: true });

            // if (!result) {
            //     return next(new NotFound('ID not found.'));
            // }

            return res.status(200).json(result);
        } catch (error) {
            return next(error);
        }
    };

    static deleteOne = async (req, res, next) => {
        try {
            const { id } = req.params;

            const result = await Tag.findByIdAndDelete(id);

            if (!result) {
                return next(new NotFound('ID not found.'));
            }

            return res.status(200).json({ message: `ID ${id} deleted successfuly.` });
        } catch (error) {
            return next(error);
        }
    };
}

export default TagController;
