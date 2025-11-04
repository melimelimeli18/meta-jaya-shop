import React, { useRef } from "react";

interface ImageUploadProps {
  onImageSelect: (file: File | null) => void;
  preview?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelect, preview }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onImageSelect(file);
  };

  return (
    <div
      onClick={() => fileInputRef.current?.click()}
      style={{
        border: "2px dashed #468386",
        borderRadius: "8px",
        padding: "12px",
        textAlign: "center",
        cursor: "pointer",
        width: "120px",
        height: "120px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {preview ? (
        <img src={preview} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      ) : (
        <span style={{ color: "#468386", fontSize: "32px" }}>📷</span>
      )}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleImageChange}
        style={{ display: "none" }}
      />
    </div>
  );
};

export default ImageUpload;
