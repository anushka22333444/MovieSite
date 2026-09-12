# Movie Discovery App

A full-stack movie discovery application built with React, Node.js, Express, MongoDB, and the OMDb API.

The application allows users to search and browse movies, sort results, view detailed movie information, and maintain a persistent wishlist.

## Features

* Search movies by title.
* Browse movies using quick discovery categories.
* Sort results by:

  * Title
  * Newest release year
  * Oldest release year
* Pagination for large result sets.
* View detailed movie information.
* Add movies to a persistent wishlist.
* Prevent duplicate wishlist entries.
* Remove movies from the wishlist.
* Maintain wishlist data after closing and reopening the application.
* Responsive design for desktop, tablet, and mobile screens.
* Loading, error, and empty-result states.
* Poster fallback when movie posters are unavailable.
* Backend abstraction layer between the frontend and the external movie API.

## Tech Stack

### Frontend

* React
* React Router
* Axios
* Vite
* CSS

### Backend

* Node.js
* Express.js
* Axios
* dotenv
* CORS

### Database

* MongoDB
* Mongoose

### External API

* OMDb API

## Application Architecture

The frontend communicates only with the Node.js backend.

```text
React Frontend
      |
      | HTTP requests using Axios
      v
Node.js + Express Backend
      |
      | Movie search and details
      v
OMDb API

Node.js + Express Backend
      |
      | Wishlist CRUD operations
      v
MongoDB
```

The backend acts as an abstraction layer so that the external API key is not exposed in the frontend.

## Project Structure

```text
movie-discovery-app/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── models/
│   │   │   └── wishlist.model.js
│   │   └── routes/
│   │       ├── movie.routes.js
│   │       └── wishlist.routes.js
│   │
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── MovieDetails.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

## Requirements

Install the following before running the project:

* Node.js 18 or later
* npm
* MongoDB or MongoDB Atlas
* OMDb API key

## Getting the OMDb API Key

Create an API key from the OMDb API website:

https://www.omdbapi.com/apikey.aspx

## Backend Setup

Open a terminal and move into the backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the `backend` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
OMDB_API_KEY=your_omdb_api_key
```

Start the backend:

```bash
node server.js
```

The backend will run on:

```text
http://localhost:5000
```

## Frontend Setup

Open another terminal and move into the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the frontend:

```bash
npm run dev
```

The frontend will normally run on:

```text
http://localhost:5173
```

Open the frontend URL in a browser.

## API Endpoints

### Movie Search

```http
GET /api/movies/search?query=batman&page=1
```

Returns a paginated list of movies matching the search query.

### Movie Details

```http
GET /api/movies/:imdbId
```

Returns detailed information about a specific movie.

Example:

```http
GET /api/movies/tt0372784
```

### Get Wishlist

```http
GET /api/wishlist
```

Returns all movies saved in the wishlist.

### Add to Wishlist

```http
POST /api/wishlist
```

Request body:

```json
{
  "imdbId": "tt0372784",
  "title": "Batman Begins",
  "year": "2005",
  "poster": "https://example.com/poster.jpg"
}
```

### Delete from Wishlist

```http
DELETE /api/wishlist/:imdbId
```

Example:

```http
DELETE /api/wishlist/tt0372784
```

## Database Schema

The wishlist collection stores the following fields:

```text
userId
imdbId
title
year
poster
createdAt
updatedAt
```

The application currently uses a demo user identifier:

```text
demo-user
```

A compound unique index on `userId` and `imdbId` prevents the same movie from being added more than once for the same user.

## Important Technical Decisions

### Backend API Abstraction

The frontend does not call the OMDb API directly. All movie requests go through the Express backend. This keeps the API key private and gives the application control over response formatting and error handling.

### MongoDB for Wishlist Persistence

Wishlist information is stored in MongoDB instead of browser local storage. This allows wishlist data to remain available after the browser is closed or the application is restarted.

### Pagination

The backend accepts a page number when searching movies. Pagination reduces the amount of data returned in a single request and makes the interface easier to use with large result sets.

### Client-Side Sorting

The search results are sorted on the frontend after receiving the data from the backend. This avoids making another API request for every sorting action.

### Duplicate Wishlist Protection

Before creating a wishlist entry, the backend checks whether the movie already exists for the current user. If it exists, the backend returns HTTP status `409`.

### Fallback Poster

Some movies do not have a valid poster. The frontend displays a fallback image when the external API returns `N/A` or an unavailable poster value.

## Assumptions

* The application currently uses a demo user instead of a complete authentication system.
* OMDb is used as the external movie data provider.
* Movie information is retrieved from OMDb when needed.
* Only wishlist information is stored in the application database.
* A movie is uniquely identified using its IMDb ID.
* The OMDb API key is stored in the backend environment variables.

## Error Handling

The application handles the following situations:

* Loading movie data.
* Invalid movie IDs.
* Empty search results.
* Missing movie posters.
* Backend request failures.
* External API failures.
* Missing required wishlist fields.
* Duplicate wishlist entries.
* Removing a movie that does not exist in the wishlist.

## Known Limitations

* The application currently uses a demo user ID.
* User registration and authentication are not implemented.
* Search requests are not yet cancelled when users type quickly.
* There is no advanced backend caching layer.
* The application depends on the availability and request limits of the OMDb API.
* Automated tests have not been added yet.
* Deployment configuration may need to be adjusted for a production environment.

## Future Improvements

With additional time, I would improve the application by adding:

* User authentication and individual wishlists.
* Backend caching for repeated movie searches.
* Request cancellation using Axios cancellation or AbortController.
* API rate-limit handling.
* Retry functionality for temporary failures.
* More filters such as genre, rating, and release year.
* Infinite scrolling as an alternative to pagination.
* Automated frontend and backend tests.
* Movie recommendations based on wishlist items.
* Production deployment using services such as Render, Vercel, or MongoDB Atlas.
* Better accessibility support.
* Skeleton loaders for movie cards.
* Debounced search input.

## AI Usage

AI tools were used as supporting tools during development to understand the third-party movie API, generate initial boilerplate, troubleshoot errors, improve request handling, and review code structure.

The application architecture, database structure, API flow, feature decisions, and final implementation were reviewed and adapted based on the requirements of the assignment.

## Running the Application

Start the backend first:

```bash
cd backend
node server.js
```

Then start the frontend in a separate terminal:

```bash
cd frontend
npm run dev
```

Open the frontend URL shown by Vite in the terminal.

## License

This project was created for educational and internship assignment purposes.
