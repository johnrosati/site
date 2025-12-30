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
      className="fixed inset-0 m-0 p-0 bg-black/60 flex justify-center items-center z-[9999]"
      style={{
        padding:
          'env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)',
      }}
      onMouseDown={onOverlayMouseDown}
      aria-hidden={false}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        ref={dialogRef}
        className="relative bg-white rounded-lg shadow-xl p-6 sm:p-8 w-[min(92vw,48rem)] lg:w-[min(92vw,64rem)] mx-auto max-h-[85vh] overflow-y-auto outline-none"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-3 right-3 text-2xl leading-none font-semibold text-ink/70 hover:text-ink focus:outline-none"
        >
          &times;
        </button>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;