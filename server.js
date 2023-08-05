import 'dotenv/config';
import app from './src/app.js';

const port = process.env.PORT || 3000;

// Start the server
app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server is running on port ${port}`);
});
