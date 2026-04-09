const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connection successful');
    } catch (error) {
        console.error('MongoDB connection failed:');
        console.error(error.message);
        console.error('Since you do not have MongoDB running locally, the server will continue without DB but requests relying on DB will fail.');
        // We will not exit the process, to allow the server to run without DB for now.
    }
};

module.exports = connectDB;
