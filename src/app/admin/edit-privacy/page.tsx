// File: src/app/admin/edit-privacy/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";
import Modal from "react-bootstrap/Modal";
import PrivacyEditor from "@/src/app/sections/admin/edit-privacy/PrivacyEditor";

interface PrivacyPolicy {
  id: number;
  content: string;
  updated_at: string;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  data?: PrivacyPolicy;
}

export default function EditPrivacyPage() {
  const [privacyContent, setPrivacyContent] = useState("");
  const [privacyId, setPrivacyId] = useState<number | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [privacyExists, setPrivacyExists] = useState(false);

  const API_URL =
    process.env.NEXT_PUBLIC_PRIVACY_POLICY_API || "/api/privacy-policy";

  // Fetch privacy policy on mount
  useEffect(() => {
    fetchPrivacyPolicy();
  }, []);

  const fetchPrivacyPolicy = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(API_URL);
      const result: ApiResponse = await response.json();

      if (result.success && result.data) {
        setPrivacyContent(result.data.content);
        setPrivacyId(result.data.id);
        setUpdatedAt(result.data.updated_at);
        setPrivacyExists(true);
      } else {
        // Privacy policy doesn't exist
        setPrivacyContent("");
        setPrivacyId(null);
        setUpdatedAt("");
        setPrivacyExists(false);
      }
    } catch (err) {
      console.error("Error fetching privacy policy:", err);
      setError("Gagal memuat kebijakan privasi");
      setPrivacyExists(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (content: string) => {
    if (!content.trim()) {
      setError("Konten tidak boleh kosong");
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccessMessage(null);

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      const result: ApiResponse = await response.json();

      if (result.success && result.data) {
        setPrivacyContent(result.data.content);
        setPrivacyId(result.data.id);
        setUpdatedAt(result.data.updated_at);
        setPrivacyExists(true);
        setSuccessMessage(
          privacyExists
            ? "Kebijakan Privasi berhasil diupdate!"
            : "Kebijakan Privasi berhasil dibuat!"
        );

        // Auto hide success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      } else {
        setError(result.message || "Gagal menyimpan kebijakan privasi");
      }
    } catch (err) {
      console.error("Error saving privacy policy:", err);
      setError("Terjadi kesalahan saat menyimpan kebijakan privasi");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!privacyId) {
      setError("Tidak ada kebijakan privasi untuk dihapus");
      return;
    }

    try {
      setDeleting(true);
      setError(null);
      setSuccessMessage(null);

      const response = await fetch(`${API_URL}/${privacyId}`, {
        method: "DELETE",
      });

      const result: ApiResponse = await response.json();

      if (result.success) {
        setPrivacyContent("");
        setPrivacyId(null);
        setUpdatedAt("");
        setPrivacyExists(false);
        setSuccessMessage("Kebijakan Privasi berhasil dihapus!");
        setShowDeleteModal(false);

        // Auto hide success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      } else {
        setError(result.message || "Gagal menghapus kebijakan privasi");
      }
    } catch (err) {
      console.error("Error deleting privacy policy:", err);
      setError("Terjadi kesalahan saat menghapus kebijakan privasi");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <Container fluid className="py-4">
        <div className="text-center py-5">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-3 text-muted">Memuat kebijakan privasi...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold mb-0">
              {privacyExists ? "Edit" : "Buat"} Kebijakan Privasi
            </h2>
            {privacyExists && (
              <Button
                variant="danger"
                onClick={() => setShowDeleteModal(true)}
                disabled={deleting}>
                {deleting ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    Menghapus...
                  </>
                ) : (
                  "Hapus Kebijakan Privasi"
                )}
              </Button>
            )}
          </div>

          {/* Success Message */}
          {successMessage && (
            <Alert
              variant="success"
              dismissible
              onClose={() => setSuccessMessage(null)}>
              {successMessage}
            </Alert>
          )}

          {/* Error Message */}
          {error && (
            <Alert variant="danger" dismissible onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {/* Info if updated */}
          {privacyExists && updatedAt && (
            <Alert variant="info" className="mb-4">
              <strong>Terakhir diupdate:</strong> {updatedAt}
            </Alert>
          )}

          {/* No Privacy Policy Warning */}
          {!privacyExists && (
            <Alert variant="warning" className="mb-4">
              <strong>⚠️ Kebijakan Privasi belum ada.</strong>
              <br />
              Silakan buat kebijakan privasi baru menggunakan form di bawah ini.
            </Alert>
          )}

          {/* Privacy Editor */}
          <PrivacyEditor
            key={privacyExists ? "editing" : "creating"}
            initialContent={privacyContent}
            onSubmit={handleSubmit}
            isLoading={saving}
            buttonText={
              privacyExists
                ? "Update Kebijakan Privasi"
                : "Buat Kebijakan Privasi"
            }
          />

          {/* Preview Section */}
          <div className="bg-white rounded-4 shadow-sm p-4 mt-4">
            <h5 className="fw-bold mb-3">Preview Kebijakan Privasi</h5>
            {privacyExists ? (
              <div
                className="p-3 bg-light rounded-3"
                style={{
                  whiteSpace: "pre-wrap",
                  maxHeight: "400px",
                  overflowY: "auto",
                  lineHeight: "1.6",
                }}>
                {privacyContent}
              </div>
            ) : (
              <div className="p-4 text-center text-muted bg-light rounded-3">
                <p className="mb-0">
                  Belum ada kebijakan privasi. Konten akan muncul di sini
                  setelah dibuat.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered>
        <Modal.Header closeButton>
          <Modal.Title>Konfirmasi Hapus</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Apakah Anda yakin ingin menghapus kebijakan privasi? Tindakan ini
            tidak dapat dibatalkan.
          </p>
          <Alert variant="warning" className="mb-0">
            <small>
              <strong>Catatan:</strong> Setelah dihapus, Anda dapat membuat
              kebijakan privasi baru.
            </small>
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowDeleteModal(false)}
            disabled={deleting}>
            Batal
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={deleting}>
            {deleting ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Menghapus...
              </>
            ) : (
              "Ya, Hapus"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
