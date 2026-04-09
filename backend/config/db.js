const mongoose = require('mongoose');

const connectDB = async () => {
	    const rawUri = process.env.MONGODB_URI || '';
	    const uri = String(rawUri).trim().replace(/^['"]|['"]$/g, '');
	    if (!uri) {
	        console.error('MONGODB_URI is not set');
	        return false;
	    }

	    // Avoid hanging requests when DB is down/misconfigured.
	    mongoose.set('bufferCommands', false);

	    try {
	        await mongoose.connect(uri, {
	            serverSelectionTimeoutMS: 10000,
	            connectTimeoutMS: 10000,
	        });
	        console.log('MongoDB connection successful');
	        return true;
	    } catch (error) {
	        const hint = 'MongoDB connection failed. Check MongoDB Atlas IP Access List (allow your current IP or 0.0.0.0/0 for testing) and verify MONGODB_URI.';
	        console.error(hint);
	        console.error(error?.message || error);
	        return false;
	    }
};

module.exports = connectDB;
