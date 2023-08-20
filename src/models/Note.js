import mongoose from 'mongoose';
import Tag from './Tag.js';

const noteSchema = new mongoose.Schema(
    {
        id: { type: String },
        title: {
            type: String,
            required: [true, 'Title is required.'],
            trim: true,
            validate: {
                validator(title) {
                    return title.trim().length > 0;
                },
                message: 'Title cannot be blank.',
            },
        },
        description: { type: String },
        tags: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tag',
        }],
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Owner user is required.'],
        },
        createdAt: {
            type: Date,
            default: new Date(),
        },
        updatedAt: {
            type: Date,
            default: null,
        },
    },
);

noteSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

const Note = mongoose.model('note', noteSchema);

export default Note;
