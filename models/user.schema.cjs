const mongoose = require("mongoose");
const schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const userSchema = new schema({
  age: {
    type: Number,
  },
  username: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: [6, "Too short password"]
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
},
{ timestamps: true}
);

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(String(password), this.password);
};

module.exports = mongoose.model("User", userSchema);
