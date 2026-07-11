import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import clsx from "clsx";
import { fadeIn, scaleIn } from "../../lib/motion";

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-4xl",
};

const Modal = ({
  isOpen,
  onClose,
  title,
  description,
  size = "md",
  footer,
  children,
  closeOnOverlayClick = true,
  closeOnEsc = true,
}) => {
  const titleId = useId();
  const panelRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    triggerRef.current = document.activeElement;
    document.body.style.overflow = "hidden";

    const firstFocusable = panelRef.current?.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    firstFocusable?.focus();

    const handleKeyDown = (e) => {
      if (closeOnEsc && e.key === "Escape") {
        onClose?.();
        return;
      }
      if (e.key !== "Tab") return;

      const focusable = panelRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      triggerRef.current?.focus?.();
    };
  }, [isOpen, closeOnEsc, onClose]);

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          {...fadeIn}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onMouseDown={(e) => {
            if (closeOnOverlayClick && e.target === e.currentTarget) {
              onClose?.();
            }
          }}
        >
          <motion.div
            {...scaleIn}
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? titleId : undefined}
            className={clsx(
              "w-full bg-surface rounded-panel shadow-xl flex flex-col max-h-[90vh]",
              sizeClasses[size]
            )}
          >
            {title && (
              <div className="flex items-start justify-between px-6 py-4 border-b border-border">
                <div>
                  <h2 id={titleId} className="text-h4 font-semibold text-ink">
                    {title}
                  </h2>
                  {description && (
                    <p className="mt-1 text-body text-ink-muted">{description}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="text-ink-subtle hover:text-ink rounded-control p-1 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
            )}

            <div className="px-6 py-4 overflow-y-auto">{children}</div>

            {footer && (
              <div className="px-6 py-4 border-t border-border flex justify-end gap-3">
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default Modal;
