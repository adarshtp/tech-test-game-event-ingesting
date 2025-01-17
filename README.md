# tech-test-game-event-ingesting
Technical Test: Game Event Ingesting

The following implementation covers all the specified requirements:

## API
Provides a REST-compliant endpoint to ingest game events.

## Queue
Uses RabbitMQ to manage event queuing and decoupling between ingestion and processing.

## Worker
Processes queued events, stores them in MongoDB, and retries failed jobs.

## Database
MongoDB's schema flexibility is well-suited for dynamic event metadata.

## Retry Mechanism
Added retry logic in the worker to handle failed jobs. A retries field in the event tracks retry attempts, with a configurable limit (RETRY_LIMIT). Messages exceeding the retry limit are logged and dropped.

## Performance Optimization
Introduced batch processing in the worker using BATCH_SIZE to process multiple messages at once, improving throughput.

## Unit Test Example
A sample unit test validates event saving and retrieval in MongoDB. More edge case tests can be added similarly.

## Docker
bundled it together for easy deployment

# Start the system
```
docker-compose up --build
```

# Run Tests
```
npm test
```

## How to Publish an Event to the App
Start the Services: Run the following command in the project directory to start all services:

```
docker-compose up --build
```

Publish an Event: Use a tool like curl, Postman, or any REST client to send a POST request to the /events endpoint. Here's an example using postman or curl:

```
curl -X POST http://localhost:3000/events \
-H "Content-Type: application/json" \
-d '{
    "eventId": "event123",
    "type": "score",
    "playerId": "player456",
    "timestamp": "2025-01-01T12:00:00Z",
    "metadata": { "score": 1500 }
}'
```

Replace the eventId, type, playerId, and other fields with your desired values.

Verify the Event:

Check the logs of the API container to confirm the event was queued successfully:
```
docker logs game_event_api
```
Check the logs of the worker container to confirm the event was processed and stored:
```
docker logs game_event_worker
```

# Stop the system
```
docker-compose down
```
