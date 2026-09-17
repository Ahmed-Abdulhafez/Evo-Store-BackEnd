const productModel = require("../models/product.schema.cjs");
const cloudinary = require("cloudinary").v2;

// Get All Products
exports.getAllProduct = async (req, res) => {
  try {
    // 1. تحديد الصفحة الحالية والعدد المطلوب (مع وضع قيم افتراضية)
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    // 2. حساب عدد المنتجات التي يجب تخطيها
    const skip = (page - 1) * limit;

    // 3. حساب إجمالي المنتجات والصفحات
    const totalProducts = await productModel.countDocuments();
    const totalPages = Math.ceil(totalProducts / limit);

    // 4. جلب المنتجات المطلوبة فقط
    const products = await productModel.find().skip(skip).limit(limit);

    // 5. إرسال الاستجابة المنظمة للفرونت إند
    return res.status(200).json({
      message: "Products fetched successfully",
      pagination: {
        totalProducts, // إجمالي عدد المنتجات في قاعدة البيانات
        totalPages, // إجمالي عدد الصفحات
        currentPage: page, // الصفحة الحالية
        limit: limit, // عدد المنتجات في كل صفحة
      },
      results: products.length, // عدد المنتجات في هذه الصفحة تحديداً
      data: products,
    });
  } catch (error) {
    console.log("Error getting all products:", error);

    return res.status(500).json({ message: "Server Error" });
  }
};

// Get porduct By Id
exports.getProductById = async (req, res) => {
  try {
    const product = await productModel
      .findById(req.params.id)
      .populate("category", "name");
    if (!product) {
      return res.status(404).json({ message: "Product Not found!" });
    }
    return res
      .status(200)
      .json({ message: "Product retrieved successfully", data: product });
  } catch (error) {
    console.log("Error getting Product by ID:", error);

    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid Product ID format" });
    }

    return res.status(500).json({ message: "Server Error" });
  }
};

// Create new product
exports.createProduct = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ message: "Please upload at least one image!" });
    }

    const uploadedImages = req.files.map((file) => {
      return {
        url: file.path,
        public_id: file.filename,
      };
    });

    const productData = {
      title: req.body.title,
      distinct: req.body.distinct,
      price: req.body.price,
      description: req.body.description,
      // category: req.body.category,
      images: uploadedImages,
    };

    const newProduct = new productModel(productData);
    const savedProduct = await newProduct.save();
    // await savedProduct.populate("category", "name");
    return res.status(201).json({
      message: "Product created successfully with images",
      data: savedProduct,
    });
  } catch (error) {
    if (req.files && req.files.length > 0) {
      for (let file of req.files) {
        await cloudinary.uploader.destroy(file.filename);
      }
      console.log(
        "Images removed from Cloudinary due to database save failure.",
      );
    }
    console.log("Error creating book:", error);

    return res.status(500).json({
      message: "Failed to save book",
      error: error.message,
    });
  }
};

// update product
exports.updateProduct = async (req, res) => {
  try {
    let { title, price, distinct, description } = req.body;
    let updateData = { title, price, distinct, description };
    updateData = Object.fromEntries(
      Object.entries(updateData).filter(([key, value]) => value !== undefined),
    );
    if (req.files && req.files.length > 0) {
      const product = await productModel.findById(req.params.id);

      if (!product) {
        return res.status(404).json({ message: "Product not found!" });
      }

      if (product.images && product.images.length > 0) {
        console.log("Starting to delete old images...");

        for (let image of product.images) {
          const result = await cloudinary.uploader.destroy(image.public_id);

          console.log(`Deletion result for image ${image.public_id}:`, result);
        }
      }

      updateData.images = req.files.map((file) => {
        return {
          url: file.path,
          public_id: file.filename,
        };
      });
    }

    const updateProduct = await productModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { returnDocument: "after" },
    );
    if (!updateProduct) {
      return res.status(404).json({ message: "Product not found!" });
    }

    return res.status(200).json({
      message: "Product updated successfully",
      data: updateProduct,
    });
  } catch (error) {
    console.log("Error updating Product:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// Deleted Product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found!" });
    }
    if (product.images && product.images.length > 0) {
      for (let image of product.images) {
        await cloudinary.uploader.destroy(image.public_id);
      }
    }
    await productModel.findByIdAndDelete(req.params.id);
    return res
      .status(200)
      .json({ message: "Product and all its images deleted successfully" });
  } catch (error) {
    console.log("Error deleting product:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};
