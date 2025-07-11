# HBnB Business Logic Class Diagram

```mermaid
classDiagram

%% ENTITY CLASSES

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

%% INHERITANCE
User --|> BaseModel
Place --|> BaseModel
Review --|> BaseModel
Amenity --|> BaseModel

%% RELATIONSHIPS
User "1" --> "0..*" Place : owns >
User "1" --> "0..*" Review : writes >
Place "1" --> "0..*" Review : receives >
Place "1" --> "0..*" Amenity : has >
Review "1" --> "1" User : written by >
Review "1" --> "1" Place : about >
Amenity "*" --> "*" Place : available in >
