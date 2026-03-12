const express = require("express");
const router = express.Router();
const { handleChat, handleStats } = require("../controllers/mentorController");

router.post("/mentor", handleChat);
router.get("/mentor/stats", handleStats);

module.exports = router;
