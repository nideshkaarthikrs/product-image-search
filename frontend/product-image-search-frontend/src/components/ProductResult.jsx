const ProductResult = ({ images, error }) => {
  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div>
      {images.map((image, index) => (
          <img
          key={index}
          src={`data:${image.mimeType};base64,${image.data}`}
          alt={`product-${index}`}
          style={{ width: "200px", margin: "10px" }}
        />
      ))}
    </div>
  );
};

export default ProductResult;
