HBnB Technical Documentation
Table of Contents
Introduction

High-Level Architecture

Business Logic Layer

API Interaction Flow

Conclusion

Introduction
The Holberton Bed and Breakfast (HBnB) application is designed with a clear, modular architecture to facilitate maintainability, scalability, and clarity. This document compiles the essential design diagrams and explanations to provide a comprehensive blueprint for the HBnB project implementation.

This technical document includes:

A high-level package diagram illustrating the three-layer architecture and communication via the facade pattern.

A detailed class diagram describing core entities within the Business Logic layer.

Sequence diagrams representing key API call interactions across the layers.

These artifacts guide the development process and serve as a point of reference throughout the project lifecycle.

High-Level Architecture
Overview
The HBnB application follows a three-layer architecture pattern to separate concerns and promote organized development:

Presentation Layer: Handles user interaction through API endpoints and services.

Business Logic Layer: Contains the core models and logic managing the entities (User, Place, Review, Amenity).

Persistence Layer: Responsible for data storage and database communication.

Communication between layers is simplified using the Facade design pattern, which provides a unified interface to interact with the business logic from the presentation layer.

Diagram
mermaid
Copier
Modifier
classDiagram

%% Presentation Layer
class APIService
class UserController
class PlaceController
class ReviewController
class AmenityController

%% Business Logic Layer
class Facade {
    +get_user()
    +create_place()
    +add_review()
    +list_amenities()
}
class User
class Place
class Review
class Amenity

%% Persistence Layer
class UserRepository
class PlaceRepository
class ReviewRepository
class AmenityRepository
class Database

%% Relationships
APIService --> Facade : calls
UserController --> Facade : uses
PlaceController --> Facade : uses
ReviewController --> Facade : uses
AmenityController --> Facade : uses

Facade --> User : uses
Facade --> Place : uses
Facade --> Review : uses
Facade --> Amenity : uses

User --> UserRepository : accesses
Place --> PlaceRepository : accesses
Review --> ReviewRepository : accesses
Amenity --> AmenityRepository : accesses

UserRepository --> Database : CRUD
PlaceRepository --> Database : CRUD
ReviewRepository --> Database : CRUD
AmenityRepository --> Database : CRUD
Notes
The Presentation Layer components manage user requests and delegate business operations to the Facade.

The Facade acts as a single entry point to the Business Logic Layer, encapsulating the complexity of interacting with multiple entities.

The Persistence Layer abstracts database operations via repositories to isolate data handling from business rules.

Business Logic Layer
Overview
This layer models the core entities and their relationships, encapsulating the business rules of HBnB.

Core Entities
User: Represents system users with personal details and linked places and reviews.

Place: Represents accommodation listings, including descriptions, capacity, pricing, and associated reviews and amenities.

Review: Represents user-submitted feedback for places.

Amenity: Represents features or services available at places.

Diagram
mermaid
Copier
Modifier
classDiagram

class BaseModel {
    +UUID id
    +datetime created_at
    +datetime updated_at
    +save()
    +to_dict()
}

class User {
    +string email
    +string password
    +string first_name
    +string last_name
    +list<Place> places
    +list<Review> reviews
    +get_full_name()
}

class Place {
    +string name
    +string description
    +int number_rooms
    +int number_bathrooms
    +int max_guests
    +float price_by_night
    +string city_id
    +string user_id
    +list<Review> reviews
    +list<Amenity> amenities
    +get_amenities()
}

class Review {
    +string text
    +string user_id
    +string place_id
    +get_summary()
}

class Amenity {
    +string name
}

User --|> BaseModel
Place --|> BaseModel
Review --|> BaseModel
Amenity --|> BaseModel

User "1" --> "0..*" Place : owns >
User "1" --> "0..*" Review : writes >
Place "1" --> "0..*" Review : receives >
Place "1" --> "0..*" Amenity : has >
Review "1" --> "1" User : written by >
Review "1" --> "1" Place : about >
Amenity "*" --> "*" Place : available in >
Notes
All entities inherit from BaseModel to maintain consistent ID and timestamp attributes.

Associations are modeled clearly, showing multiplicities and ownership.

Methods like get_full_name() and get_amenities() encapsulate commonly used business logic.

API Interaction Flow
Overview
This section presents the flow of interactions across layers for four key API calls. Each sequence diagram visualizes the processing steps from the client request to database operations and the response generation.

1. User Registration
mermaid
Copier
Modifier
sequenceDiagram
participant User
participant APIService
participant Facade
participant UserRepository
participant Database

User->>APIService: Submit registration data
APIService->>Facade: Validate and create user
Facade->>UserRepository: Save new user
UserRepository->>Database: Insert user record
Database-->>UserRepository: Confirm save
UserRepository-->>Facade: User saved
Facade-->>APIService: Return success response
APIService-->>User: Registration successful
Notes:
User data is validated at the facade, persisted via the repository, and confirmation flows back to the user.

2. Place Creation
mermaid
Copier
Modifier
sequenceDiagram
participant User
participant APIService
participant Facade
participant PlaceRepository
participant Database

User->>APIService: Submit new place details
APIService->>Facade: Validate and create place
Facade->>PlaceRepository: Save place data
PlaceRepository->>Database: Insert place record
Database-->>PlaceRepository: Confirm save
PlaceRepository-->>Facade: Place saved
Facade-->>APIService: Return success response
APIService-->>User: Place created
3. Review Submission
mermaid
Copier
Modifier
sequenceDiagram
participant User
participant APIService
participant Facade
participant ReviewRepository
participant Database

User->>APIService: Submit review data
APIService->>Facade: Validate and create review
Facade->>ReviewRepository: Save review
ReviewRepository->>Database: Insert review record
Database-->>ReviewRepository: Confirm save
ReviewRepository-->>Facade: Review saved
Facade-->>APIService: Return success response
APIService-->>User: Review submitted
4. Fetching a List of Places
mermaid
Copier
Modifier
sequenceDiagram
participant User
participant APIService
participant Facade
participant PlaceRepository
participant Database

User->>APIService: Request list of places
APIService->>Facade: Retrieve places list
Facade->>PlaceRepository: Query places with filters
PlaceRepository->>Database: Fetch places data
Database-->>PlaceRepository: Return results
PlaceRepository-->>Facade: Places list
Facade-->>APIService: Send places list
APIService-->>User: Return places list
Conclusion
This document provides a detailed architectural and design overview of the HBnB application, from its high-level layered structure down to the specifics of core entities and API interaction flows.

The presented diagrams and explanations offer a solid foundation to understand the system, support implementation, and guide future maintenance or enhancement.

How to Use This Document
Refer to the High-Level Architecture section for system organization and design principles.

Use the Business Logic Layer diagrams to understand entity models and relationships.

Consult API Interaction Flow diagrams when implementing or debugging API endpoints.
