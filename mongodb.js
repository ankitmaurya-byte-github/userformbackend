const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://user:123qwer@cluster0.9os4y.mongodb.net/");
const userSchema1 = mongoose.Schema({
  name: String,
  Email: String,
  password: String,
});

const userSchema2 = mongoose.Schema({
  department: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
});

module.exports = {
  users: mongoose.model("users", userSchema1),
  products: mongoose.model("products", userSchema2),
};
