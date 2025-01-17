// worker.js - RabbitMQ Worker for Event Processing

const amqp = require('amqplib');
const { connectToDatabase, GameEvent } = require('../db/db_config');

const RABBITMQ_URL = `amqp://${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`;
const QUEUE_NAME = process.env.RABBITMQ_QUEUE;
const BATCH_SIZE = process.env.BATCH_SIZE;
const RETRY_LIMIT = process.env.RETRY_LIMIT;

async function startWorker() {
    try {
        await connectToDatabase();
        const connection = await amqp.connect(RABBITMQ_URL);
        const channel = await connection.createChannel();
        await channel.assertQueue(QUEUE_NAME);
        console.log('Worker is listening for messages...');

        let messages = [];

        channel.consume(QUEUE_NAME, (message) => {
            if (message !== null) {
                const event = JSON.parse(message.content.toString());
                messages.push({ event, message });

                if (messages.length >= BATCH_SIZE) {
                    processBatch(messages, channel);
                    messages = [];
                }
            }
        });

        process.on('SIGINT', async () => {
            if (messages.length > 0) {
                await processBatch(messages, channel);
            }
            process.exit(0);
        });
    } catch (error) {
        console.error('Worker error:', error);
    }
}

async function processBatch(messages, channel) {
    console.log('Processing batch of messages:', messages.length);
    const failedMessages = [];

    for (const { event, message } of messages) {
        try {
            const gameEvent = new GameEvent(event);
            await gameEvent.save();
            console.log('Event saved to database:', event);
            channel.ack(message);
        } catch (error) {
            console.error('Failed to save event:', error);
            event.retries += 1;
            if (event.retries > RETRY_LIMIT) {
                console.error('Exceeded retry limit, dropping message:', event);
                channel.ack(message);
            } else {
                failedMessages.push(event);
                channel.nack(message, false, false);
            }
        }
    }

    if (failedMessages.length > 0) {
        try {
            const connection = await amqp.connect(RABBITMQ_URL);
            const channel = await connection.createChannel();
            await channel.assertQueue(QUEUE_NAME);
            for (const event of failedMessages) {
                channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(event)));
            }
            console.log('Requeued failed messages:', failedMessages.length);
            await channel.close();
            await connection.close();
        } catch (error) {
            console.error('Failed to requeue messages:', error);
        }
    }
}

module.exports = {
    startWorker
};

if (require.main === module) {
    startWorker();
}