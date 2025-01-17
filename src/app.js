// app.js - Main Entry Point for API
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { publishEvent } = require('./services/publisher');
const { connectToDatabase } = require('./db/db_config');

const app = express();
const PORT = process.env.APP_PORT;

// Middleware
app.use(bodyParser.json());

// API Endpoint to Ingest Events
app.post('/events', async (req, res) => {
    const { eventId, type, playerId, timestamp, metadata } = req.body;

    // Validate input
    if (!eventId || !type || !playerId || !timestamp) {
        return res.status(400).json({ error: 'Invalid input' });
    }

    try {
        const event = { eventId, type, playerId, timestamp, metadata, retries: 0 };
        await publishEvent(event);
        res.status(202).json({ message: 'Event queued for processing' });
    } catch (error) {
        console.error('Error publishing event:', error);
        res.status(500).json({ error: 'Failed to queue event' });
    }
});

// Start the API Server
(async () => {
    await connectToDatabase();
    app.listen(PORT, () => {
        console.log(`API Server running on http://localhost:${PORT}`);
    });
})();
