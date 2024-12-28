const mongoose = require("mongoose");

//schema design
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require,
    },
    email: {
      type: String,
      require,
      unique: true,
    },
    password: {
      type: String,
      require,
    },
  },
  { timestamps: true }
);

//export
const users = mongoose.model("users", userSchema);
module.exports = users;
