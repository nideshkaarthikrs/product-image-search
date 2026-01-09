const mongoose = require("mongoose");

async function connectDB() {
    try {
        await mongoose.connect(
            "mongodb+srv://app_user:mZenMqQC2Z7izqbf@product-image-search.56uzyme.mongodb.net/?appName=product-image-search"
        )
        console.log("MongoDB connection established!")
    }
    catch(error) {
        console.error("MongoDB connection failed: " + error.message)
        process.exit(1)
    }
}

module.exports = connectDB;