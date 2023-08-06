import mongoose from 'mongoose';

async function connectDB() {
    try {
        await mongoose.connect(process.env.DB_CONNECTION_STRING);
        // eslint-disable-next-line no-console
        console.log('Database connected successfuly.');
    } catch (error) {
        // console.error('Failed to connect to the database.');
        throw new Error('Failed to connect to the database.');
    }
}

export default connectDB;
