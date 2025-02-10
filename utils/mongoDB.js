const mongoose = require("mongoose");

const connectDB = {
    open: async () => {
        try {
            await mongoose.connect(process.env.MONGO_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            console.log('MongoDB Connected');
        } catch (err) {
            console.error('MongoDB Connection Error:', err);
            process.exit(1);
        }
    },
    close: async () => {
        try {
            await mongoose.connection.close();
            console.log('MongoDB Connection Closed');
        } catch (err) {
            console.error('Error closing MongoDB connection:', err);
        }
    }
};

module.exports = connectDB;