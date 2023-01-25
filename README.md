# Tickitz-Be
![](https://img.shields.io/github/stars/Fiqri-R-J/Tickitz-Be) ![](https://img.shields.io/github/forks/Fiqri-R-J/Tickitz-Be) ![](https://img.shields.io/github/tag/Fiqri-R-J/Tickitz-Be) ![](https://img.shields.io/github/release/Fiqri-R-J/Tickitz-Be) ![](https://img.shields.io/github/issues/Fiqri-R-J/Tickitz-Be)

Tickitz-Be is an Tickitz API. It's built on the Node Js, uses Postgresql & Express.

## Installation

Just clone this repo to your local repo

```bash
git clone https://github.com/Fiqri-R-J/Tickitz-Be.git
```

## Usage
Setting your dotenv file

```env
PORT=
DB_HOST=
DB_PORT=
DB_NAME=
DB_USERNAME=
DB_PASSWORD=


REDIS_HOST=
REDIS_PORT=
REDIS_PASSWORD=

ACCESS_TOKEN_SECRET=
REFRESH_TOKEN_SECRET=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

```
run the server
```js
nodemon
```
## HTTP Response
* 200 ```OK``` - the request was successful.
* 201 ```Create Success``` - the request was successful.
* 400 ```Bad Request``` - You've made an invalid request or to an invalid endpoint.
* 401 ```Unauthorized``` - The request has not been applied because it lacks valid authentication credentials for the target resource.
* 403 ```Forbidden``` - No Token provide.
* 422 ```Unprocessable Entity``` - Unable to process the contained instructions
* 500 ``` Server Error``` - Server error

## JSON Response
This is a typical response
```json
{
    "message": "Success get all data users",
    "code": 200,
    "total": 15,
    "data": []
}
```

* ```message```- Appropriate message from the REST API
* ```code``` - Status response returned
* ```total``` - Total data
* ```data``` - Return data from database

# Routes


## Auth Routes

- **POST** Login Endpoint Path:```/login/```

## Users Routes

- **GET** Users Endpoint Path: ```/users/{email}```
- **POST** Users Endpoint Path:```/users/register```
- **PATCH** Users Endpoint Path: ```/users/edit/{id}```
- **DELETE** Users Endpoint Path: ```/users/delete/{id}```

## Movies Routes

- **GET** Movies JOIN WITH SCHEDULES (sort by created_at) Endpoint Path: ```/movies/search-join/?page=1&limit=4&sort=DESC```
- **GET** Movies (search all or by movies_name) & SORT by created_at Endpoint Path: ```/movies/search/?page=1&limit=1&sort=DESC```
- **GET** Movies (search all or by movies_name) & SORT by release_date Endpoint Path: ```/movies/search-2?page=1&limit=1&sort=DESC```
- **POST** Movies Endpoint Path:```/movies/add-movies/```
- **PATCH** Movies Endpoint Path: ```/movies/edit/{id}```
- **DELETE** Movies Endpoint Path: ```/movies/delete/{id}```

## SCHEDULES Routes

- **GET** SCHEDULES(search all or by location) & SORT by time Endpoint Path: ```/schedules/search/```
- **GET** SCHEDULES(search all or by cinema) & SORT by created_at Endpoint Path: ```/schedules/search-2/```
- **POST** SCHEDULES Endpoint Path:```/schedules/add-schedules```
- **PATCH** SCHEDULES Endpoint Path: ```/schedules/edit/{id}```
- **DELETE** SCHEDULES Endpoint Path: ```/schedules/delete/{id}```

## PAYMENTS Routes

- **GET** PAYMENTS - JOIN ALL TABLES Endpoint Path: ```/payments/search-join?page=1&limit=5```
- **GET** PAYMENTS (search all or by payments_id) SORT by created_at Endpoint Path: ```/payments/search/```
- **POST** PAYMENTS Endpoint Path:```/payments/add-payments```
- **PATCH** PAYMENTS Endpoint Path: ```/payments/edit/{id}```

## License
[MIT](https://choosealicense.com/licenses/mit/)
