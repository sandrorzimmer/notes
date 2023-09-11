import mongoose from 'mongoose';
import autopopulte from 'mongoose-autopopulate';

const tagSchema = new mongoose.Schema(
    {
        id: { type: String },
        name: {
            type: String,
            required: [true, 'Tag name is required.'],
            unique: true,
            trim: true,
            validate: {
                validator(name) {
                    return name.trim().length > 0;
                },
                message: 'Tag name cannot be blank.',
            },
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Owner user is required.'],
            autopopulate: { select: 'id username' },
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

tagSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

tagSchema.plugin(autopopulte);

const Tag = mongoose.model('Tag', tagSchema);

export default Tag;
