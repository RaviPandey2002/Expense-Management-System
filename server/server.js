const app = require("./app");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/connectDb");

dotenv.config({
  path: path.join(__dirname, ".env")
});

const PORT = process.env.PORT || 8001;
connectDB();

//listen server

app.listen(PORT, () =>
  console.log(`Server is running successfully on PORT http://localhost:${PORT}`)
);
