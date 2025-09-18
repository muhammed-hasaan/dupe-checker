const express = require('express');
const clientPromise = require('../../lib/mongodb');

const app = express();

// GET /api/check?number=1234567890
app.get('/', async (req, res) => {
  try {
    const { number } = req.query;
    if (!number) {
      return res.status(400).json({ success: false, error: "Number is required" });
    }

    const client = await clientPromise;
    const db = client.db("dupechecker");
    const collection = db.collection("numbers");

    const exists = await collection.findOne({ number });
    res.status(200).json({
      success: true,
      exists: !!exists, // Returns true/false
      number: exists?.number // Optional: Return the matched number if exists
    });
  } catch (error) {
    console.error("Error checking number:", error);
    res.status(500).json({ success: false, error: "Failed to check number" });
  }
});

module.exports = app;
