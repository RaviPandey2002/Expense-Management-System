const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const colors = require("colors");
const cookieParser = require("cookie-parser");
const path = require("path");

const app = express();

app.use(morgan("dev"));
app.use(express.json());

const allowedCors = process.env.CLIENT_URLS
  ? process.env.CLIENT_URLS.split(",").map(url => url.trim())
  : ["http://localhost:3000"];

app.use(
  cors({
    origin: allowedCors,
    credentials: true,
  })
);

app.use(cookieParser());

// # HEALTH CHECK
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Backend is online" });
});

// # ROUTES

const authMiddleware = require("./middleware/authMiddleware");

app.use("/api/v1/users", require("./routes/userRoute"));
app.use("/api/v1/transactions", authMiddleware, require("./routes/transactionRoutes"));

module.exports = app;