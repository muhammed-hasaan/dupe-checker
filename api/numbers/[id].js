// // const express = require('express');
// // const { MongoClient, ObjectId } = require('mongodb');
// // const clientPromise = require('../../mongodb');

// // const app = express();
// // app.use(express.json());

// // app.get('/', async (req, res) => {
// //   try {
// //     const { id } = req.query;
// //     if (!ObjectId.isValid(id)) {
// //       return res.status(400).json({ success: false, error: "Invalid ID format" });
// //     }

// //     const client = await clientPromise;
// //     const db = client.db("dupechecker");
// //     const collection = db.collection("numbers");

// //     const number = await collection.findOne({ _id: new ObjectId(id) });
// //     if (!number) {
// //       return res.status(404).json({ success: false, error: "Number not found" });
// //     }

// //     res.status(200).json({ success: true, data: number });
// //   } catch (error) {
// //     console.error("Error fetching number:", error);
// //     res.status(500).json({ success: false, error: "Failed to fetch number" });
// //   }
// // });

// // app.put('/', async (req, res) => {
// //   try {
// //     const { id } = req.query;
// //     const { number } = req.body;

// //     if (!ObjectId.isValid(id)) {
// //       return res.status(400).json({ success: false, error: "Invalid ID format" });
// //     }
// //     if (!number) {
// //       return res.status(400).json({ success: false, error: "Number is required" });
// //     }

// //     const phoneRegex = /^\+?[\d\s\-]+$/;
// //     if (!phoneRegex.test(number)) {
// //       return res.status(400).json({ success: false, error: "Invalid phone number format" });
// //     }

// //     const client = await clientPromise;
// //     const db = client.db("dupechecker");
// //     const collection = db.collection("numbers");

// //     const existingNumber = await collection.findOne({
// //       number,
// //       _id: { $ne: new ObjectId(id) },
// //     });
// //     if (existingNumber) {
// //       return res.status(409).json({ success: false, error: "This number already exists" });
// //     }

// //     const result = await collection.updateOne(
// //       { _id: new ObjectId(id) },
// //       { $set: { number, updatedAt: new Date() } }
// //     );

// //     if (result.matchedCount === 0) {
// //       return res.status(404).json({ success: false, error: "Number not found" });
// //     }

// //     res.status(200).json({ success: true, message: "Number updated successfully" });
// //   } catch (error) {
// //     console.error("Error updating number:", error);
// //     res.status(500).json({ success: false, error: "Failed to update number" });
// //   }
// // });

// // app.delete('/', async (req, res) => {
// //   try {
// //     const { id } = req.query;
// //     if (!ObjectId.isValid(id)) {
// //       return res.status(400).json({ success: false, error: "Invalid ID format" });
// //     }

// //     const client = await clientPromise;
// //     const db = client.db("dupechecker");
// //     const collection = db.collection("numbers");

// //     const result = await collection.deleteOne({ _id: new ObjectId(id) });
// //     if (result.deletedCount === 0) {
// //       return res.status(404).json({ success: false, error: "Number not found" });
// //     }

// //     res.status(200).json({ success: true, message: "Number deleted successfully" });
// //   } catch (error) {
// //     console.error("Error deleting number:", error);
// //     res.status(500).json({ success: false, error: "Failed to delete number" });
// //   }
// // });

// // module.exports = app;

// // api/numbers/[id].js
// const { ObjectId } = require('mongodb');
// const connectToDatabase = require('../../mongodb');

// module.exports = async (req, res) => {
//   try {
//     const { id } = req.query;

//     if (!ObjectId.isValid(id)) {
//       return res.status(400).json({ success: false, error: "Invalid ID format" });
//     }

//     const { db } = await connectToDatabase();
//     const collection = db.collection("numbers");

//     if (req.method === "GET") {
//       const number = await collection.findOne({ _id: new ObjectId(id) });
//       if (!number) {
//         return res.status(404).json({ success: false, error: "Number not found" });
//       }
//       return res.status(200).json({ success: true, data: number });
//     }

//     if (req.method === "PUT") {
//       const { number } = req.body;

//       if (!number) {
//         return res.status(400).json({ success: false, error: "Number is required" });
//       }

//       const phoneRegex = /^\+?[\d\s\-]+$/;
//       if (!phoneRegex.test(number)) {
//         return res.status(400).json({ success: false, error: "Invalid phone number format" });
//       }

//       const existingNumber = await collection.findOne({
//         number,
//         _id: { $ne: new ObjectId(id) },
//       });
//       if (existingNumber) {
//         return res.status(409).json({ success: false, error: "This number already exists" });
//       }

//       const result = await collection.updateOne(
//         { _id: new ObjectId(id) },
//         { $set: { number, updatedAt: new Date() } }
//       );

//       if (result.matchedCount === 0) {
//         return res.status(404).json({ success: false, error: "Number not found" });
//       }

//       return res.status(200).json({ success: true, message: "Number updated successfully" });
//     }

//     if (req.method === "DELETE") {
//       const result = await collection.deleteOne({ _id: new ObjectId(id) });
//       if (result.deletedCount === 0) {
//         return res.status(404).json({ success: false, error: "Number not found" });
//       }
//       return res.status(200).json({ success: true, message: "Number deleted successfully" });
//     }

//     // Unsupported methods
//     res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
//     res.status(405).end(`Method ${req.method} Not Allowed`);
//   } catch (error) {
//     console.error("Error in /api/numbers/[id]:", error);
//     res.status(500).json({ success: false, error: "Server error", details: error.message });
//   }
// };

const { ObjectId } = require('mongodb');
const connectToDatabase = require('../../mongodb');

module.exports = async (req, res) => {
  try {
    // 🔹 CORS headers
    res.setHeader("Access-Control-Allow-Origin", "*"); // production me apne domain set karo
    res.setHeader("Access-Control-Allow-Methods", "GET,PUT,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");

    // 🔹 Preflight request
    if (req.method === "OPTIONS") return res.status(200).end();

    const { id } = req.query;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, error: "Invalid ID format" });
    }

    const { db } = await connectToDatabase();
    const collection = db.collection("numbers");

    if (req.method === "GET") {
      const number = await collection.findOne({ _id: new ObjectId(id) });
      if (!number) {
        return res.status(404).json({ success: false, error: "Number not found" });
      }
      return res.status(200).json({ success: true, data: number });
    }

    if (req.method === "PUT") {
      const { number } = req.body;
      if (!number) return res.status(400).json({ success: false, error: "Number is required" });

      const phoneRegex = /^\+?[\d\s\-]+$/;
      if (!phoneRegex.test(number)) return res.status(400).json({ success: false, error: "Invalid phone number format" });

      const existingNumber = await collection.findOne({ number, _id: { $ne: new ObjectId(id) } });
      if (existingNumber) return res.status(409).json({ success: false, error: "This number already exists" });

      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { number, updatedAt: new Date() } }
      );

      if (result.matchedCount === 0) return res.status(404).json({ success: false, error: "Number not found" });

      return res.status(200).json({ success: true, message: "Number updated successfully" });
    }

    if (req.method === "DELETE") {
      const result = await collection.deleteOne({ _id: new ObjectId(id) });
      if (result.deletedCount === 0) return res.status(404).json({ success: false, error: "Number not found" });

      return res.status(200).json({ success: true, message: "Number deleted successfully" });
    }

    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    
  } catch (error) {
    console.error("Error in /api/numbers/[id]:", error);
    res.status(500).json({ success: false, error: "Server error", details: error.message });
  }
};
