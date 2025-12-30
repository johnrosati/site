import React, { useEffect, useRef } from 'react';

const Modal = ({
  isOpen,
  onClose,
  children,
  titleId = 'modal-title',
  closeOnOverlayClick = true,
}) => {
  const dialogRef = useRef(null);
  const lastActiveElementRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    // Remember what had focus before opening
    lastActiveElementRef.current = document.activeElement;

    // Prevent background scroll
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';

    // Focus the dialog for keyboard users
    // (use rAF so it happens after render)
    const raf = requestAnimationFrame(() => {
      dialogRef.current?.focus();
    });

    // Close on Escape
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = overflow;

      // Restore focus to where the user was
      const el = lastActiveElementRef.current;
      if (el && typeof el.focus === 'function') el.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const onOverlayMouseDown = (e) => {
    if (!closeOnOverlayClick) return;
    // Only close if the user clicked the overlay itself (not the dialog)
    if (e.target === e.currentTarget) onClose?.();
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex justify-center items-center z-50"
      onMouseDown={onOverlayMouseDown}
      aria-hidden={false}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        ref={dialogRef}
        className="relative bg-white rounded shadow-lg p-4 max-w-lg w-[min(32rem,90vw)] mx-auto max-h-[80vh] overflow-y-auto outline-none"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-2 right-2 text-2xl leading-none font-bold"
        >
          &times;
        </button>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

export default Modal;