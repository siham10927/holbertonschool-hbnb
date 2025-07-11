
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
