import React from "react";
import Modal from "./Modal";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  productName?: string; // Tambahkan prop untuk nama produk
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  productName,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="text-center">
        <h5 className="mb-3">Yakin ingin menghapus produk ini?</h5>

        {/* Tampilkan nama produk jika ada */}
        {productName && (
          <p className="text-muted mb-4">
            Produk: <strong className="text-dark">{productName}</strong>
          </p>
        )}

        <div className="d-flex justify-content-center gap-3 mt-4">
          <button
            className="btn btn-secondary"
            onClick={onClose}
            style={{
              borderRadius: "20px",
              padding: "8px 24px",
            }}>
            Batal
          </button>
          <button
            className="btn"
            style={{
              backgroundColor: "#468386",
              color: "white",
              borderRadius: "20px",
              padding: "8px 24px",
            }}
            onClick={onConfirm}>
            Hapus
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteModal;
