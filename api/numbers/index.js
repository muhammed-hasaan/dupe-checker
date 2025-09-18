const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const clientPromise = require('../../../lib/mongodb');

const app = express();
app.use(express.json());

// GET /api/numbers - List all numbers with optional search
app.get('/', async (req, res) => {
  try {
    const { q: query } = req.query;
    const client = await clientPromise;
    const db = client.db("dupechecker");
    const collection = db.collection("numbers");

    let filter = {};
    if (query) {
      filter = { number: { $regex: query, $options: "i" } };
    }

    const numbers = await collection
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();

    res.status(200).json({ success: true, data: numbers });
  } catch (error) {
    console.error("Error fetching numbers:", error);
    res.status(500).json({ success: false, error: "Failed to fetch numbers" });
  }
});

// POST /api/numbers - Add a new number
app.post('/', async (req, res) => {
  try {
    const { number } = req.body;
    if (!number) {
      return res.status(400).json({ success: false, error: "Number is required" });
    }

    const phoneRegex = /^\+?[\d\s\-]+$/;
    if (!phoneRegex.test(number)) {
      return res.status(400).json({ success: false, error: "Invalid phone number format" });
    }

    const client = await clientPromise;
    const db = client.db("dupechecker");
    const collection = db.collection("numbers");

    const existingNumber = await collection.findOne({ number });
    if (existingNumber) {
      return res.status(409).json({ success: false, error: "This number already exists" });
    }

    const result = await collection.insertOne({
      number,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    res.status(201).json({
      success: true,
      data: { _id: result.insertedId, number, createdAt: new Date() }
    });
  } catch (error) {
    console.error("Error adding number:", error);
    res.status(500).json({ success: false, error: "Failed to add number" });
  }
});

module.exports = app;
