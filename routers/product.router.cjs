const express = require("express")
const router = express.Router()
const productController = require("../controllers/Product.controller.cjs")
const upload = require("../middlewares/upload.middleware.cjs")

// Get All Products
router.get("/api/products", productController.getAllProduct)

// Create new product
router.post("/api/products",upload.array("images", 5), productController.createProduct)


// Get porduct By Id
router.get("/api/products:id", productController.getProductById)

// update product
router.put("/api/products/:id",upload.array("images", 5), productController.updateProduct)

// Deleted Product
router.delete("/api/products/:id", productController.deleteProduct)

module.exports = router