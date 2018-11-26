const express = require("express");
const router = express.Router();

const ArtistController = require("../controllers/artistsController");

router.post("/tracks/top", ArtistController.getArtistTopTracks);
router.post(
  "/tracks/recommended",
  ArtistController.getSuggestedTracksBasedOnArtists
);
router.post("/user/top", ArtistController.getUserTopArtists);

module.exports = router;
