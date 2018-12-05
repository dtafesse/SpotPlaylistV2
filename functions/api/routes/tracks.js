const express = require("express");
const router = express.Router();

const TrackController = require("../controllers/trackController");

// routes
router.get("/related/:id", TrackController.getRelatedTracks);
router.post("/reorder", TrackController.reorderTrack);
router.post("/remove", TrackController.removeTrackByPostion);
router.post("/selectedids", TrackController.getTracks);

module.exports = router;
