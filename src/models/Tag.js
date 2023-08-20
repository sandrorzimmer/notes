import mongoose from 'mongoose';

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

const Tag = mongoose.model('tag', tagSchema);

export default Tag;
