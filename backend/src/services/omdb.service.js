
const axios = require("axios");

const omdbClient = axios.create({
  baseURL: "https://www.omdbapi.com",
  timeout: 10000,
});

async function searchMovies(query, page = 1) {
  const response = await omdbClient.get("/", {
    params: {
      apikey: process.env.OMDB_API_KEY,
      s: query,
      type: "movie",
      page,
    },
  });

  if (response.data.Response === "False") {
    throw new Error(response.data.Error);
  }

  return response.data;
}

async function getMovieDetails(imdbId) {
  const response = await omdbClient.get("/", {
    params: {
      apikey: process.env.OMDB_API_KEY,
      i: imdbId,
      plot: "full",
    },
  });

  if (response.data.Response === "False") {
    throw new Error(response.data.Error);
  }

  return response.data;
}

module.exports = {
  searchMovies,
  getMovieDetails,
};