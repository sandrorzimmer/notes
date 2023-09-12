import BadRequest from '../errors/BadRequest.js';
import NotFound from '../errors/NotFound.js';
import Tag from '../models/Tag.js';
import User from '../models/User.js';

class TagController {
    static showAll = async (req, res, next) => {
        try {
            const searchAll = Tag.find();

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

            const existingName = await Tag.findOne({ name });
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

            if (name) {
                if (name.trim().length <= 0) {
                    return next(new BadRequest('Tag name is required.'));
                }
            }

            const existingName = await Tag.find({ name, _id: { $ne: id } });
            if (existingName.length > 0) {
                return next(new BadRequest('Tag already exists.'));
            }

            req.body.owner = req.user.userId;
            const updatedOne = req.body;

            const result = await Tag.findByIdAndUpdate(id, updatedOne, { new: true });

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
