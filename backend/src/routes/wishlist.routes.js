// backend/src/routes/wishlist.routes.js

const express = require("express");
const Wishlist = require("../models/wishlist.model");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const movies = await Wishlist.find({
      userId: "demo-user",
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      movies,
    });
  } catch (error) {
    console.error("Wishlist fetch error:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to fetch wishlist",
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const { imdbId, title, year, poster } = req.body;

    if (!imdbId || !title) {
      return res.status(400).json({
        success: false,
        message: "IMDb ID and title are required",
      });
    }

    const existingMovie = await Wishlist.findOne({
      userId: "demo-user",
      imdbId,
    });

    if (existingMovie) {
      return res.status(409).json({
        success: false,
        message: "Movie is already in your wishlist",
      });
    }

    const movie = await Wishlist.create({
      userId: "demo-user",
      imdbId,
      title,
      year,
      poster,
    });

    res.status(201).json({
      success: true,
      message: "Movie added to wishlist",
      movie,
    });
  } catch (error) {
    console.error("Wishlist add error:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to add movie to wishlist",
    });
  }
});

router.delete("/:imdbId", async (req, res) => {
  try {
    const deletedMovie = await Wishlist.findOneAndDelete({
      userId: "demo-user",
      imdbId: req.params.imdbId,
    });

    if (!deletedMovie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found in wishlist",
      });
    }

    res.json({
      success: true,
      message: "Movie removed from wishlist",
    });
  } catch (error) {
    console.error("Wishlist delete error:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to remove movie from wishlist",
    });
  }
});

module.exports = router;