const express = require("express");
const router = express.Router();

const AlbumController = require("../controllers/albumsController");

// routes
router.post(
  "/tracks",
  AlbumController.getAlbumTracks,
  AlbumController.suggestTracksBasedOnAlbumTracks
);
router.get("/newreleases", AlbumController.getNewReleases);

module.exports = router;
