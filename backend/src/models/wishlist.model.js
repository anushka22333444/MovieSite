// backend/src/models/wishlist.model.js

const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      default: "demo-user",
    },
    imdbId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    year: {
      type: String,
    },
    poster: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

wishlistSchema.index(
  {
    userId: 1,
    imdbId: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model("Wishlist", wishlistSchema);