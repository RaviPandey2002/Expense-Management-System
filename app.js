const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const colors = require("colors");
const path = require("path");

const app = express();

app.use(morgan("dev"));
app.use(express.json());

app.use(cors());

app.use("/api/v1/users", require("./routes/userRoute"));

app.use("/api/v1/transections", require("./routes/transectionRoutes"));

//static files
app.use(express.static(path.join(__dirname, "./client/build")));

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

module.exports = app