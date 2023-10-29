import mongoose from 'mongoose';
import autopopulate from 'mongoose-autopopulate';
// import Tag from './Tag.js';

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
            autopopulate: { select: 'id name' },
        }],
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Owner user is required.'],
            autopopulate: { select: 'id name' },
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

noteSchema.plugin(autopopulate);

const Note = mongoose.model('Note', noteSchema);

export default Note;
