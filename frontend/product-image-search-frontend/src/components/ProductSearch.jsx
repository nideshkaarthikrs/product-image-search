import { useState } from "react";
const ProductSearch = ({ productCode, onProductCodeChange, onFetch }) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [pastedFile, setPastedFile] = useState(null);

  async function uploadImage() {
    if (!productCode) {
      alert("Enter product code first");
      return;
    }

    if (!pastedFile) {
      alert("Paste an image first");
      return;
    }

    const formData = new FormData();
    formData.append("productCode", productCode);
    formData.append("image", pastedFile);

    try {
      const response = await fetch("http://localhost:3001/api/images/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Upload failed");
        return;
      }

      alert("Image uploaded successfully");

      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      setPreviewUrl(null);
      setPastedFile(null);
    } catch (error) {
      alert("Server error during upload");
    }
  }

  return (
    <div>
      <input
        id="product-code-input"
        type="text"
        placeholder="Enter product code"
        value={productCode}
        onChange={(e) => onProductCodeChange(e.target.value)}
      />
      <br />
      <br />
      <button onClick={onFetch}>Fetch Product(s)</button>
      <div
        style={{
          border: "2px dashed gray",
          padding: "20px",
          marginTop: "20px",
        }}
        onPaste={(e) => {
          const items = e.clipboardData.items;
          for (let item of items) {
            if (item.type.startsWith("image/")) {
              const imageFile = item.getAsFile();

              if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
              }
              const prevUrl = URL.createObjectURL(imageFile);
              setPreviewUrl(prevUrl);
              setPastedFile(imageFile);
            }
          }
        }}
        onClick={(e) => {
          e.stopPropagation(); // prevent immediate removal

          const el = e.currentTarget;
          const isHighlighted = el.dataset.highlighted === "true";

          if (isHighlighted) {
            el.style.border = "2px dashed gray";
            el.style.backgroundColor = "transparent";
            el.dataset.highlighted = "false";
          } else {
            el.style.border = "2px solid #007bff";
            el.style.backgroundColor = "#eaf3ff";
            el.dataset.highlighted = "true";
          }

          // remove highlight when clicking elsewhere
          document.onclick = () => {
            el.style.border = "2px dashed gray";
            el.style.backgroundColor = "transparent";
            el.dataset.highlighted = "false";
            document.onclick = null;
          };
        }}
      >
        Paste image here (Ctrl/Cmd + V)
      </div>
      {previewUrl && (
        <div style={{ marginTop: "20px" }}>
          <p>Preview:</p>
          <img
            src={previewUrl}
            alt="preview"
            style={{ width: "200px", border: "1px solid #ccc" }}
          />
        </div>
      )}
      <button onClick={uploadImage} style={{ marginTop: "10px" }}>
        Upload Image
      </button>
    </div>
  );
};

export default ProductSearch;
