
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/db");
const movieRoutes = require("./src/routes/movie.routes");
const wishlistRoutes = require("./src/routes/wishlist.routes");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Movie Discovery API is running",
  });
});

app.use("/api/movies", movieRoutes);
app.use("/api/wishlist", wishlistRoutes);
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});