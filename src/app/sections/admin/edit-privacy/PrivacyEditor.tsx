// File: src/app/sections/admin/edit-privacy/PrivacyEditor.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Form, Button, Spinner } from "react-bootstrap";

interface PrivacyEditorProps {
  initialContent: string;
  onSubmit: (content: string) => void | Promise<void>;
  isLoading?: boolean;
  buttonText?: string;
}

const PrivacyEditor: React.FC<PrivacyEditorProps> = ({
  initialContent,
  onSubmit,
  isLoading = false,
  buttonText = "Simpan Kebijakan Privasi",
}) => {
  const [content, setContent] = useState(initialContent || "");

  // Update content when initialContent changes
  useEffect(() => {
    setContent(initialContent || "");
  }, [initialContent]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit && typeof onSubmit === "function") {
      await onSubmit(content);
    } else {
      console.error("onSubmit is not a function:", onSubmit);
    }
  };

  const handleReset = () => {
    setContent(initialContent);
  };

  return (
    <div className="bg-white rounded-4 shadow-sm p-4">
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-4">
          <Form.Label className="fw-semibold">
            Konten Kebijakan Privasi
          </Form.Label>
          <Form.Control
            as="textarea"
            rows={15}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Masukkan konten kebijakan privasi di sini..."
            className="font-monospace"
            style={{
              fontSize: "0.9rem",
              lineHeight: "1.6",
            }}
            disabled={isLoading}
            required
          />
          <Form.Text className="text-muted">
            Format teks akan dipertahankan seperti yang Anda ketik.
          </Form.Text>
        </Form.Group>

        <div className="d-flex gap-2">
          <Button
            variant="primary"
            type="submit"
            disabled={isLoading || !content || !content.trim()}
            className="px-4">
            {isLoading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Menyimpan...
              </>
            ) : (
              buttonText
            )}
          </Button>

          <Button
            variant="outline-secondary"
            type="button"
            onClick={handleReset}
            disabled={isLoading || content === initialContent}>
            Reset
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default PrivacyEditor;
