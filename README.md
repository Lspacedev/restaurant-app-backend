# React Native + MongoDb + Express App

Restaurnat booking/management app.

## Installation

npm install

```bash
Run project:
node --watch index
```

## Frontend:

```python
App is built using React Native Expo
```

## Backend:

```python
Api is built using a Node Express server, with MongoDb as a database.
Api uses JWT tokens to authenticate user.

Api allows users to:
    Admin:
    1. Add new restaurant.
    2. Update restaurant information.

    Client
    1. View restaurant.
    2. Make reservation.

Api Endpoints:
    Admin:
    1. POST /restaurant.
    2. GET /restaurants/:restaurantId.
    3. PUT /restaurants/:restaurantId.

    Client
    Index Route:

    1. POST /api/register
        Inputs: name, surname, email, password, role (USER | ADMIN).

    2. POST /api/login
            Inputs: email, password

    3. GET /api/profile
    4. PUT /api/profile
            Inputs: name, surname, email, password

    5. GET /api/bookings

    6. GET /api/reviews
    7. GET /api/reviews/:reviewId
        Params: reviewId

    8. PUT /api/review/:reviewId
            Params: reviewId
            Inputs:  rating, text

    9. DELETE /api/review/:reviewId

    Restaurants Route:

    1. GET /api/restaurants.
    2. GET /api/restaurants/:restaurantId.

    3. POST /api/restaurants/:restaurantId/bookings
            Params: restaurantId
            Inputs:   day, hour, guest

    4. POST /api/restaurants/:restaurantId/reviews
            Params: restaurantId
            Inputs: rating, text

    5. POST /api/restaurants/:restaurantId/pay
            Params: restaurantId
            Inputs: amount,




```

## Credits:

```python

```

## Flows:

```python

```
