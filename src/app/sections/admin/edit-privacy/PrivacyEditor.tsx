'use client';

import React, { useState } from 'react';

interface PrivacyEditorProps {
  initialContent?: string;
  onSubmit: (content: string) => void;
}

const PrivacyEditor: React.FC<PrivacyEditorProps> = ({ initialContent = '', onSubmit }) => {
  const [content, setContent] = useState(initialContent);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(content);
  };

  return (
    <div className="bg-white rounded-4 shadow-sm p-4">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="form-label fw-semibold">Kebijakan Privasi</label>
          <textarea
            name="privacy"
            className="form-control"
            placeholder="Deskripsi Produk"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={15}
            required
            style={{ 
              borderColor: "#468386", 
              borderRadius: "20px",
              resize: "vertical"
            }}
          />
        </div>

        <button
          type="submit"
          className="btn"
          style={{
            backgroundColor: "#468386",
            color: "white",
            borderRadius: "20px",
            padding: "10px 30px",
          }}
        >
          Simpan
        </button>
      </form>
    </div>
  );
};

export default PrivacyEditor;