// db_config.js - MongoDB Configuration and Schema Definitions

const mongoose = require('mongoose');
const { Schema } = mongoose;

// MongoDB Connection
async function connectToDatabase() {
    await mongoose.connect('mongodb://localhost:27017/game_events', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');
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

const GameEvent = mongoose.model('GameEvent', gameEventSchema);

module.exports = {
    connectToDatabase,
    GameEvent
};
