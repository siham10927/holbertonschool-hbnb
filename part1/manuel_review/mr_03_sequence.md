# HBnB API Sequence Diagrams

This document illustrates the sequence of operations between the Presentation Layer, Business Logic Layer, and Persistence Layer for four core API calls.

---

## 1. User Registration

```mermaid
sequenceDiagram
participant Client
participant API
participant Facade
participant UserModel
participant UserRepository
participant Database

Client->>API: POST /users (email, password, ...)
API->>Facade: register_user(data)
Facade->>UserModel: validate_and_create(data)
UserModel->>UserRepository: save(user)
UserRepository->>Database: INSERT user
Database-->>UserRepository: OK
UserRepository-->>UserModel: User Saved
UserModel-->>Facade: Return user
Facade-->>API: Return created user
API-->>Client: 201 Created + user info
