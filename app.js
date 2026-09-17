require("dotenv").config();
const express = require("express")
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDb = require("./utils/DB")
const userRoter = require("./routers/user.router.cjs")
const reviewRoter = require("./routers/review.router.cjs")
const productRoter = require("./routers/product.router.cjs")



const app = express()
app.use(cors());
app.use(bodyParser.json())         
const port = process.env.PORT || 3000

connectDb()

app.get("/", (req, res) => {
    res.send("halo, world")
})


app.use("/", userRoter)
app.use("/", reviewRoter)
app.use("/", productRoter)






app.use((err, req, res, next) => {
  console.log("Error details:", err);
  res.status(500).json({ 
    message: "Server Error", 
    error: err.message || err 
  });
});

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });
// أضف هذا السطر في نهاية app.js
module.exports = app;