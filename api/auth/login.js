const connectToDatabase = require('../../mongodb');

module.exports = async (req, res) => {
  try {
    // 🔹 CORS headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    // 🔹 Preflight request
    if (req.method === "OPTIONS") return res.status(200).end();

    if (req.method === "POST") {
      const { id, password } = req.body;
      
      if (!id || !password) {
        return res.status(400).json({ 
          success: false, 
          matches: false,
          error: "ID and password are required" 
        });
      }

      const { db } = await connectToDatabase();
      const adminCollection = db.collection("adminpass");

      // Find admin credentials
      const admin = await adminCollection.findOne({ id });
      
      if (admin && admin.password === password) {
        return res.status(200).json({ 
          success: true, 
          matches: true,
          message: "Credentials matched successfully" 
        });
      } else {
        return res.status(500).json({ 
          success: false, 
          matches: false,
          error: "Invalid credentials" 
        });
      }
    }

    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ 
      success: false, 
      matches: false,
      error: "Server error", 
      details: err.message 
    });
  }
};