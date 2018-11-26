const express = require("express");
const router = express.Router();

const ArtistController = require("../controllers/artistsController");

// routes
router.post("/tracks", ArtistController.getArtistTopTracks);
router.post("/user/top", ArtistController.getUserTopTracks);

module.exports = router;
