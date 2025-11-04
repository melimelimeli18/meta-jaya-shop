import React from "react";
import Modal from "./Modal";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ isOpen, onClose, onConfirm }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="text-center">
        <h5>Yakin ingin menghapus produk ini?</h5>
        <div className="d-flex justify-content-center gap-3 mt-4">
          <button
            className="btn btn-secondary"
            onClick={onClose}
          >
            Batal
          </button>
          <button
            className="btn"
            style={{ backgroundColor: "#468386", color: "white" }}
            onClick={onConfirm}
          >
            Hapus
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteModal;
