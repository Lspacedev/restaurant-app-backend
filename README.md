# Restaurant App | Backend

Restaurnat booking/management app.

### Restaurant App | Frontend

[https://github.com/Lspacedev/restaurant-app-admin](https://github.com/Lspacedev/restaurant-app-admin)

### Restaurant App | API

[LIVE](https://restaurant-app-backend-sandy.vercel.app/)

## Prerequisites

- Nodejs
- A Cloudinary account, follow the link [here](https://cloudinary.com/)

## Installation

1. Clone the repository

```bash
git@github.com:Lspacedev/restaurant-app-backend.git
```

2. Navigate to the project folder

```bash
cd restaurant-app-backend
```

3.  Install all dependencies

```bash
npm install
```

4. Create an env file and add the following:

```bash
STRIPE_SECRET_KEY="Stripe secret key"
PORT="Specify your port here"
MONGO_URI_PROD="MongoDb database uri"
JWT_SECRET="Jwt secret"
CLOUDINARY_CLOUD_NAME="Cloudinary cloud name"
CLOUDINARY_API_KEY="Cloudinary api key"
CLOUDINARY_SECRET_KEY="Cloudinary secret key"


```

5. Run the project

```bash
node index
```

## Usage

1. The server should run on PORT 8000, unless a port is specified.
2. Use http://localhost:8000, to test the API on Postman or any other tool.

## Routes:

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

## Tech Stack

- NodeJs
- Express
- MongoDb
