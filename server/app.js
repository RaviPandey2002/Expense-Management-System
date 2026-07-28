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

// # ROUTES

const authMiddleware = require("./middleware/authMiddleware");

app.use("/api/v1/users", require("./routes/userRoute"));
app.use("/api/v1/transactions", authMiddleware, require("./routes/transactionRoutes"));


//static files for - serving React - frontend project [!!! we can do this too !!!]
// app.use(express.static(path.join(__dirname, "./client/build")));

// app.get("*", function (req, res) {
//   res.sendFile(path.join(__dirname, "./client/build/index.html"));
// });

module.exports = app