const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
console.log("Loading routes...");

app.get("/test", (req, res) => {
  res.send("Server and routes are working!");
});

app.use("/api/requests", require("./routes/requests"));
app.use("/api/equipment", require("./routes/equipment")); // MUST be here

// Start server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
