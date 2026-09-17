const mongoose = require("mongoose");
const schema = mongoose.Schema;

const productSchema = new schema(
  {
    title: { type: String, required: true, trim: true },
    distinct: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    description: { type: String, trim: true },
//     category: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Category", 
//     required: true
//   },
    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }, 
);

module.exports = mongoose.model("Product", productSchema);