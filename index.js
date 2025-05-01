// Import required modules
const express = require("express");
const app = express();
const logger = require("./logger"); // Custom logger for logging info/errors

// Import MongoDB client
const { MongoClient } = require("mongodb");

// 🔐 Get MongoDB connection string from environment variable
const uri = process.env.MONGODB_URI;

// 📦 Print the MongoDB URI to confirm it's being passed correctly
console.log("📦 MONGODB_URI =", uri);

// Create MongoDB client
const client = new MongoClient(uri);

// 🌐 Connect to MongoDB when the server starts
async function connectToMongo() {
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
  }
}

connectToMongo(); // Call the connection function

// Define basic calculator operations
const add = (n1, n2) => n1 + n2;
const sub = (n1, n2) => n1 - n2;
const multi = (n1, n2) => n1 * n2;
const div = (n1, n2) => n1 / n2;

// Main logic to process calculator operations
const calculate = (operation, req, res) => {
  try {
    const n1 = parseFloat(req.query.n1); // Read n1 from query
    const n2 = parseFloat(req.query.n2); // Read n2 from query

    // Log the incoming request
    logger.info(`Received ${operation.name} request with n1=${n1}, n2=${n2}`);

    // Validate input
    if (isNaN(n1)) throw new Error("n1 is not a number");
    if (isNaN(n2)) throw new Error("n2 is not a number");

    // Perform the calculation
    const result = operation(n1, n2);
    logger.info(`Result of ${operation.name}: ${result}`);

    // Return success response
    res.status(200).json({ statusCode: 200, data: result });
  } catch (error) {
    // Log and return error
    logger.error(`Error in ${operation.name}: ${error.message}`);
    res.status(500).json({ statusCode: 500, msg: error.toString() });
  }
};

// Define calculator routes (GET requests with n1 and n2 as query parameters)
app.get("/add", (req, res) => calculate(add, req, res));
app.get("/sub", (req, res) => calculate(sub, req, res));
app.get("/multi", (req, res) => calculate(multi, req, res));
app.get("/div", (req, res) => calculate(div, req, res));

// Start the server
const port = 3040;
app.listen(port, () => {
  console.log(`🚀 Server is listening on port ${port}`);
});
