const mongoose = require("mongoose")

// Product
//  ├── productCode (String, unique)
//  └── images (Array of objects)
//        ├── data (String)
//        ├── mimeType (String)
//        └── uploadedAt (Date)


const ImageSchema = new mongoose.Schema({
    data: {
        type: String,
        required: true,
    },
    mimeType: {
        type: String,
        required: true,
    },
    uploadedAt: {
        type: Date,
        default: Date.now,
    },
});

const ProductSchema = new mongoose.Schema({
    productCode: {
        type: String,
        required: true,
        unique: true,
    },
    images: {
        type: [ImageSchema],
        default: [],
    },
})

module.exports = mongoose.model("Product", ProductSchema)