import mongoose from "mongoose";

async function connectDB() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/docgen');
        console.log('db connected..')
    } catch (error) {
        console.log('db connection failed', error)
    }
}

export default connectDB