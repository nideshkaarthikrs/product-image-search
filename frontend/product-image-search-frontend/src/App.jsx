import { useState, useEffect } from "react";
import "./App.css";
import ProductSearch from "./components/ProductSearch";
import ProductResult from "./components/ProductResult";

function App() {
  const [productCode, setProductCode] = useState("");
  const [product, setProduct] = useState(null);
  const [errMsg, setErrMsg] = useState(null);
  const [images, setImages] = useState([]);

  async function fetchProduct() {
    try {
      setProduct(null);
      setErrMsg(null);
      let response = await fetch(
        `http://localhost:3001/api/products/${productCode}`
      );
      if (!response.ok) {
        let error = `HTTP error! status: ${response.status} (${response.statusText})`;
        setErrMsg(error);
        return;
      }

      let data = await response.json();
      setProduct(data);
    } catch (err) {
      setErrMsg(err.message);
      console.log(err.message);
    }
  }

  async function fetchImages() {
    try {
      setErrMsg(null);
      setImages([]);
      let response = await fetch(
        `http://localhost:3001/api/images/${productCode}`
      );

      if (!response.ok) {
        const data = await response.json();
        setErrMsg(data.error);
        return;
      }

      const data = await response.json();
      setImages(data.images);

    } catch (err) {
    setErrMsg("Failed to load images");
    }
  }

  const onProductCodeChange = (value) => {
    setProductCode(value);
  };

  return (
    <div>
      <ProductSearch
        productCode={productCode}
        onProductCodeChange={onProductCodeChange}
        onFetch={fetchImages}
      />
      <ProductResult images={images} error={errMsg} />
    </div>
  );
}

export default App;
