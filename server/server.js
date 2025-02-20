const app = require("./app");
const dotenv = require("dotenv");
const connectDB = require("./config/connectDb");
dotenv.config();


const PORT = process.env.PORT || 6000;

connectDB();

//listen server

app.listen(PORT, () =>
  console.log(`Server is running successfully on PORT ${PORT}`)
);
