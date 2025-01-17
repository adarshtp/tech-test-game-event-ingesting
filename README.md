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