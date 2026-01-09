const express = require("express");
const multer = require("multer");
const Product = require('../models/Product')

const router = express.Router()

// store file in memory (buffer)
const upload = multer({
    storage: multer.memoryStorage(),
})



// IMAGE UPLOAD LOGIC
router.post("/upload", upload.single("image"), async (req, res) => {

    try {
        const { productCode } = req.body;

        if (!productCode) {
            return res.status(400).json({error: "Product Code is required1"})
        }

        if (!req.file) {
            return res.status(400).json({error: "No image uploaded"})
        }

        const base64Image = req.file.buffer.toString("base64");
        
        // If a product with the given product code already exists, then we append images to that product code or else we create a document(row/record) for that product code and its respective images.

        let product = await Product.findOne({ productCode }) 

        if (!product) {
            // creates a new mongoDB document in memory (not saved yet)
            // images array is initially empty (schema default)
            product = new Product({ productCode })
        }

        product.images.push({
            data: base64Image,
            mimeType: req.file.mimetype,
        })
        
        // Saving changes in the database 
        await product.save();

        res.json({
            message: "Image saved successfully",
            totalImages: product.images.length,
        })

    }
    catch(error) {
        console.log(error.message)
        res.status(500).json({error: "Failed to save image"})
    }
 
})


// IMAGE RETRIEVAL LOGIC
router.get("/:productCode", async (req, res) => {

    try {
        const { productCode } = req.params;

        if (!productCode) {
            return res.status(400).json({error: "Product code required!"})    
        }

        const product = await Product.findOne({ productCode });

        if (!product) {
            return res.status(404).json({error: "Product not found!"})
        }

        return res.json({
            productCode: product.productCode,
            images: product.images,
        })
    }
    catch(error) {
        console.log(error.message)
        return res.status(500).json({error: "Failed to fetch images"});
    }

})

module.exports = router