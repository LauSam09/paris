# Proof of concept microservices distribution

## Architecture
Initially the project will consist of four microservices:
1. units
2. materials
3. thicknesses
4. raw-materials

Each service will have a dedicated database suitable for typical use-cases. Where appropriate, data will be replicated between services through an event-driven system, likely using a pub/sub model from RabbitMQ.

## Limitations
* No authentication or user management
* No concurrency checks
