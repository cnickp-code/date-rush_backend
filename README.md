# DownStream

https://date-rush-v2.vercel.app

The app is called Date Rush, where users can input their location, among other preferences, in a four-step process that culminates in the generation of a date! Whether you want to spice up the spontaneity in a relationship or are simply indecisive, Date Rush is the answer! Once you are happy with the date you have constructed, you can save your date and view it any time in the profile section.

Best viewed on mobile, but desktop works perfectly fine!

## Motivation

I wanted to make an app that combined multiple APIs into a single seamless experience. It was also motivated by the fact that I like to be completely spontaneous when it comes to having fun! My goal was to create an experience for the user who is either running short on time or just wants to have a fun time with their significant other, doing things that would not be in the normal flow of daily life. That is the kind of approach I take to programming as well. I jump at the chance to push myself in order to learn and grow. Life is too short not to live like that!

## Screenshots
![screen0](https://user-images.githubusercontent.com/61900464/92645494-c8bd7900-f299-11ea-90bf-6bad99791ef4.jpg)
![screen1](https://user-images.githubusercontent.com/61900464/92645502-cb1fd300-f299-11ea-862b-c9908f3afb4d.jpg)
![screen2](https://user-images.githubusercontent.com/61900464/92645509-cce99680-f299-11ea-8b69-4493cdbe130e.jpg)
![screen3](https://user-images.githubusercontent.com/61900464/92645513-cf4bf080-f299-11ea-964f-9267e22a307f.jpg)
![screen4](https://user-images.githubusercontent.com/61900464/92645516-d115b400-f299-11ea-9f2e-3deaf4332b04.jpg)

## Tech used

React, NodeJS, PostgreSQL, Google Maps/Places/Geocoding API, CocktailDB, MovieDB, MealDB, Zomato API

## Version

Build 0.000000001

----

# Backend Endpoints

Backend serving DownStream, an event management web app for online music streaming festivals!

**User**
----
  Posts user credentials to DB and returns json data about a single user.

* **URL**

  /api/users

* **Method:**

  `POST`
  
*  **URL Params**

   <!-- **Required:** -->
    None

* **Data Params**

   `user_name: string` <br />
   `password: string` <br />
   `email: string` <br />
   `date_create: date`

* **Success Response:**

  * **Code:** 201 <br />
    **Content:** `{ id : 12, name : "Michael Bloom", email: "fake@fake.com", date_created: "2029-01-22T16:28:32.615Z" }`
 
* **Error Response:**

  * **Code:** 400 BAD REQUEST <br />
    **Content:** `{ error : "User already taken" }`

**Login**
----
  Posts login attempt and returns JSON web token

* **URL**

  /api/auth/login

* **Method:**

  `POST`
  
*  **URL Params**

   <!-- **Required:** -->
    None

* **Data Params**

   `user_name: string`
   `password: string`

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{ "authToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyLCJpYXQiOjE1OTQ3OTM0NTYsInN1YiI6IlppeGl0aCJ9.lNvljUQa_HIKvBNRT4TkCqEFSUP6hu_S1uY2t0Q6p_g" }`

 
* **Error Response:**

  * **Code:** 400 BAD REQUEST <br />
    **Content:** `{ error : "Incorrect username or password" }`

**Event**
----
  Get all dates from database, and post new dates individually.

* **URL**

  /api/dates

* **Method(s):**

  `GET`
  `POST`
  
*  **URL Params**

   GET: None <br />
   POST: None

* **Data Params**

    GET: None <br />
    POST: <br />
    `name: string` <br />
    `location: string`<br />
    `user_id: int` <br />
    `place_id: string` <br />
    `meal_id: string` <br />
    `meal_type : string` <br />
    `drink_id: string` <br />
    `drink_type: date` <br />
    `show_id: date` <br />
    `show_type: string` <br />

* **Success Response:**
  * **GET:**
    **Code:** 200 <br />
    **Content:** <br />
    ```    
    {
        "id": 1,
        "name": "Random Date",
        "location":"Lucerne Valley,
        "user_id": 1,
        "place_id": ddf3138D,
        "meal_id": 55,
        "meal_type": 'Out',
        "drink_id": yg_21234,
        "drink_type": 'Alc',
        "show_id": 212345,
        "show_type": 'Movie'
    },
    ```

  * **POST:**
    **Code:** 201 <br />
    **Content:** <br />
    ```    
    {
        "id": 1,
        "name": "Random Date",
        "location":"Lucerne Valley,
        "user_id": 1,
        "place_id": ddf3138D,
        "meal_id": 55,
        "meal_type": 'Out',
        "drink_id": yg_21234,
        "drink_type": 'Alc',
        "show_id": 212345,
        "show_type": 'Movie'
    },
    ```

 
* **Error Response:**

  * **GET:** <br />
    None

  * **POST:** <br />
    **Code:** 404 <br />
    **Content:** `{ error : "Missing key in request body" }`
