// db_config.js - MongoDB Configuration and Schema Definitions
require('dotenv').config();
const mongoose = require('mongoose');
const { Schema } = mongoose;

// MongoDB Connection
async function connectToDatabase() {
    const mongoUri = `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}`;
    try {
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1); // Exit if the database connection fails
    }
}

// Define Mongoose Schema for game events
const gameEventSchema = new Schema({
    eventId: { type: String, required: true },
    type: { type: String, required: true },
    playerId: { type: String, required: true },
    timestamp: { type: Date, required: true },
    metadata: { type: Object, default: {} },
    retries: { type: Number, default: 0 } // Track retry attempts
});

const GameEvent = mongoose.model('GameEvent', gameEventSchema)

module.exports = {
    connectToDatabase,
    GameEvent
};
