import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

const Modal = ({
  isOpen,
  onClose,
  children,
  titleId = 'modal-title',
  closeOnOverlayClick = true,
  showTonePlate = true,
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
      const root = dialogRef.current;
      if (!root) return;
      root.focus();
    });

    // Close on Escape and trap focus inside the dialog
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose?.();
        return;
      }

      if (e.key !== 'Tab') return;

      const root = dialogRef.current;
      if (!root) return;

      const focusables = root.querySelectorAll(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
      );

      if (!focusables.length) {
        e.preventDefault();
        return;
      }

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;

      if (e.shiftKey) {
        if (active === first || active === root) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (active === last) {
          e.preventDefault();
          first.focus();
        }
      }
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

  const onOverlayClick = (e) => {
    if (!closeOnOverlayClick) return;
    // Only close if the user clicked the overlay itself (not the dialog)
    if (e.target === e.currentTarget) onClose?.();
  };

  return createPortal(
    <div
      className="fixed inset-0 bg-paper flex justify-center items-center z-[9999] p-4 sm:p-8"
      onClick={onOverlayClick}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-label="Modal Dialog"
        tabIndex={-1}
        ref={dialogRef}
        className="relative bg-paper rounded-lg shadow-xl p-6 sm:p-8 w-[min(92vw,48rem)] lg:w-[min(92vw,64rem)] mx-auto max-h-[85vh] overflow-y-auto outline-none"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 z-30 h-8 w-8 flex items-center justify-center text-1xl font-semibold text-ink/30 hover:text-accent rounded-full focus:outline-none focus-visible:ring-1 focus-visible:ring-accent"
        >
          &times;
        </button>
        <div className="relative z-10">{children}</div>
        {showTonePlate && (
          <div
            aria-hidden="true"
            className="pointer-events-none hidden lg:block absolute left-10 sm:left-16 right-[calc(50%+1rem)] top-[calc(6rem+14rem)] bottom-12 rounded-xl border border-ink/10 bg-gradient-to-b from-ink/5 via-accent/12 to-ink/5 shadow-inner z-20"
          />
        )}
      </div>
    </div>,
    document.body 
  );
};

export default Modal;