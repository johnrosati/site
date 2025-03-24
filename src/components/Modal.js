import React from 'react';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-10 flex justify-center items-center z-50">
      <div className="bg-white rounded shadow-lg p-4 max-w-lg mx-auto max-h-[80vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-2 right-2 text-xl font-bold">
          &times;
        </button>
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;