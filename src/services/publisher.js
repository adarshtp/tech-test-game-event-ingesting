// publisher.js - RabbitMQ Event Publisher

const amqp = require('amqplib');

const RABBITMQ_URL = 'amqp://localhost';
const QUEUE_NAME = 'game_events';

async function publishEvent(event) {
    try {
        const connection = await amqp.connect(RABBITMQ_URL);
        const channel = await connection.createChannel();
        await channel.assertQueue(QUEUE_NAME);
        channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(event)));
        console.log('Event queued:', event);
        await channel.close();
        await connection.close();
    } catch (error) {
        console.error('Error queuing event:', error);
        throw error;
    }
}

module.exports = {
    publishEvent
};
