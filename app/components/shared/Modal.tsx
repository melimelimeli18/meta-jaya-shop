'use client';

import React from 'react';
import Modal from 'react-bootstrap/Modal';

interface ModalBaseProps {
  show: boolean;
  handleClose: () => void;
  children?: React.ReactNode;
}

const ModalBase: React.FC<ModalBaseProps> = ({ show, handleClose, children }) => {
  return (
    <Modal
      show={show}
      onHide={handleClose}       
      centered
      backdrop={true}            
      keyboard={true}            
      contentClassName="rounded-4 border-0 shadow"
    >
      <Modal.Body
        className="bg-white rounded-4"
        style={{
          minHeight: '150px',
        }}
      >
        {children || null}
      </Modal.Body>
    </Modal>
  );
};

export default ModalBase;
