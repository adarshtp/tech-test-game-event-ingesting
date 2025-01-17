// Import required modules
const mongoose = require('mongoose');
const assert = require('assert');
const { Schema } = mongoose;

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/game_events_test', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('Connected to MongoDB for testing'));

// Define a Mongoose Schema for game events
const gameEventSchema = new Schema({
    eventId: { type: String, required: true },
    type: { type: String, required: true },
    playerId: { type: String, required: true },
    timestamp: { type: Date, required: true },
    metadata: { type: Object, default: {} },
    retries: { type: Number, default: 0 }
});

const GameEvent = mongoose.model('GameEvent', gameEventSchema);

// Unit Test
async function runTests() {
    console.log('Starting tests...');

    // Clear test database
    await GameEvent.deleteMany({});

    // Test data
    const testEvent = {
        eventId: 'test1',
        type: 'score',
        playerId: 'player123',
        timestamp: new Date(),
        metadata: { score: 100 },
        retries: 0
    };

    // Insert event
    const gameEvent = new GameEvent(testEvent);
    await gameEvent.save();
    console.log('Event saved to database:', testEvent);

    // Retrieve event
    const retrievedEvent = await GameEvent.findOne({ eventId: 'test1' });
    assert.strictEqual(retrievedEvent.eventId, testEvent.eventId);
    assert.strictEqual(retrievedEvent.type, testEvent.type);
    assert.strictEqual(retrievedEvent.playerId, testEvent.playerId);
    assert.deepStrictEqual(retrievedEvent.metadata, testEvent.metadata);
    console.log('Event retrieved and verified successfully');

    // Cleanup
    await GameEvent.deleteMany({});
    console.log('Cleaned up test database');

    // Close database connection
    mongoose.connection.close();
    console.log('All tests passed');
}

// Run the tests
runTests().catch(err => {
    console.error('Test failed:', err);
    mongoose.connection.close();
});
