import Note from '../models/Note.js';
import User from '../models/User.js';
import Tag from '../models/Tag.js';
import NotFound from '../errors/NotFound.js';
import BadRequest from '../errors/BadRequest.js';

async function noteSearchHandling(params) {
    const {
        title,
        description,
    } = params;

    let search = {};

    if (title) search.title = { $regex: title, $options: 'i' };
    if (description) search.description = { $regex: description, $options: 'i' };

    return search;
}

class NoteController {
    static showAll = async (req, res, next) => {
        try {
            const { user } = req;
            console.log(user);
            const searchAll = Note.find({
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
            const { user } = req;
            const result = await Note.find({
                owner: user.userId,
                _id: id,
            });

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
            const { tags } = req.body;

            if (tags) {
                const tagCount = await Tag.countDocuments({
                    _id: { $in: tags },
                    owner: req.user.userId,
                });

                if (tagCount !== tags.length) {
                    return next(new BadRequest('One or more tags are invalid.'));
                }
            }

            req.body.owner = req.user.userId;
            const newOne = new Note(req.body);
            const result = await newOne.save();
            return res.status(201).json(result);
        } catch (error) {
            return next(error);
        }
    };

    static updateOne = async (req, res, next) => {
        try {
            const { tags } = req.body;

            if (tags) {
                const tagCount = await Tag.countDocuments({
                    _id: { $in: tags },
                    owner: req.user.userId,
                });

                if (tagCount !== tags.length) {
                    return next(new BadRequest('One or more tags are invalid.'));
                }
            }

            const { id } = req.params;
            const updatedOne = req.body;

            const result = await Note.findByIdAndUpdate(id, updatedOne, { new: true });

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

            const result = await Note.findByIdAndDelete(id);

            if (!result) {
                return next(new NotFound('ID not found.'));
            }

            return res.status(200).json({ message: `ID ${id} deleted successfuly.` });
        } catch (error) {
            return next(error);
        }
    };

    static showByFilter = async (req, res, next) => {
        try {
            const search = await noteSearchHandling(req.query);

            if (search !== null) {
                const result = Note.find(search);

                req.result = result;

                return next();
            }
            return res.status(200).json([]);
        } catch (error) {
            return next(error);
        }
    };
}

export default NoteController;
