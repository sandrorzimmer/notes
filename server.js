import 'dotenv/config';
import app from './src/app.js';
import connectDB from './src/config/dbConnect.js';

const port = process.env.PORT || 3000;

connectDB()
    .then(() => {
        // Start the server once the database connection is established
        app.listen(port, () => {
            // eslint-disable-next-line no-console
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error.message);
        process.exit(1);
    });
