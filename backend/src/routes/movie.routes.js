
const express = require("express");
const {
  searchMovies,
  getMovieDetails,
} = require("../services/omdb.service");

const router = express.Router();

router.get("/search", async (req, res) => {
  try {
    const query = req.query.q?.trim();

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const page = Math.max(1, Number(req.query.page) || 1);
    const data = await searchMovies(query, page);

    res.json({
      success: true,
      page,
      totalResults: Number(data.totalResults),
      movies: data.Search || [],
    });
  } catch (error) {
    console.error("OMDb error:", error.message);

    res.status(502).json({
      success: false,
      message: "Unable to fetch movies right now",
    });
  }
});

router.get("/:imdbId", async (req, res) => {
  try {
    const imdbId = req.params.imdbId;

    if (!/^tt\d+$/.test(imdbId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid IMDb ID",
      });
    }

    const movie = await getMovieDetails(imdbId);

    res.json({
      success: true,
      movie,
    });
  } catch (error) {
    console.error("OMDb details error:", error.message);

    res.status(502).json({
      success: false,
      message: "Unable to fetch movie details",
    });
  }
});

module.exports = router;