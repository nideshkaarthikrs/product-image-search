
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
    <div className="product-search-card">
      {/* Top Section: Input and Search */}
      <div className="input-group">
        <input
          className="product-input"
          id="product-code-input"
          type="text"
          placeholder="Enter product code"
          value={productCode}
          onChange={(e) => onProductCodeChange(e.target.value)}
        />
        <button className="fetch-btn" onClick={onFetch}>
          Fetch
        </button>
      </div>

      {/* Middle Section: Paste Zone */}
      <div
        className="paste-area"
        tabIndex="0" 
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
          e.stopPropagation();

          const el = e.currentTarget;
          el.focus(); 

          const isHighlighted = el.dataset.highlighted === "true";

          if (isHighlighted) {
            el.style.border = "2px dashed #555";
            el.style.backgroundColor = "#252525";
            el.dataset.highlighted = "false";
          } else {
            el.style.border = "2px solid #646cff";
            el.style.backgroundColor = "rgba(100, 108, 255, 0.1)"; 
            el.dataset.highlighted = "true";
          }

          document.onclick = () => {
            el.style.border = "2px dashed #555";
            el.style.backgroundColor = "#252525";
            el.dataset.highlighted = "false";
            document.onclick = null;
          };
        }}
      >
        Paste image here (Click then Ctrl/Cmd + V)
      </div>

      {/* Bottom Section: Preview */}
      {previewUrl && (
        <div className="preview-container">
          <span className="preview-label">Preview</span>
          <img key={previewUrl} src={previewUrl} alt="preview" className="preview-image" />
        </div>
      )}
      
      <button className="upload-btn" onClick={uploadImage}>
        Upload Image
      </button>
    </div>
  );
};

export default ProductSearch;