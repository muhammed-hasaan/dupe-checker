// api/check.js
const connectToDatabase = require('../mongodb');

module.exports = async (req, res) => {
  try {
    // Handle both /api/check?number=123 and /api/check/123
    const number = req.query.number || req.query[0];

    if (!number) {
      return res.status(400).json({
        success: false,
        error: "Phone number is required (e.g., /api/check?number=1234567890)"
      });
    }

    const { db } = await connectToDatabase();
    const exists = await db.collection('numbers').findOne({ number: number });

    res.status(200).json({
      success: true,
      exists: !!exists,
      number: exists?.number,
      message: exists
        ? "This number already exists in our database"
        : "This number is available"
    });

  } catch (error) {
    console.error("Check API Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to check number",
      details: error.message
    });
  }
};
