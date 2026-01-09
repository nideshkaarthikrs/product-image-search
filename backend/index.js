const express = require("express")
const cors = require("cors")
const connectDB = require('./db')
const imageRoutes = require("./routes/imageRoutes")

const app = express()


const products = {
  PDT001: {
    productCode: "PDT001",
    name: "Wireless Mouse",
    category: "Electronics",
    price: 999
  },
  PDT002: {
    productCode: "PDT002",
    name: "Mechanical Keyboard",
    category: "Electronics",
    price: 3499
  }
};


app.use(cors());
app.use(express.json());
app.use("/api/images", imageRoutes)

app.get('/api/products/:productCode', (req, res) => {

const product = products[req.params.productCode];

    if (product) {
        return res.json(product)
    }else {
        return res.status(404).json({
            error: "Product not found"
        })
    }
})


const PORT = 3001;

connectDB();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})


