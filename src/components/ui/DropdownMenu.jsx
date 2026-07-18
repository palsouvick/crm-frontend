import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import { scaleIn } from "../../lib/motion";

const MENU_WIDTH = 208;
const VIEWPORT_MARGIN = 8;

const itemVariantClasses = {
  default: "text-ink hover:bg-surface-hover",
  danger: "text-danger-600 hover:bg-danger-100",
};

// Renders its panel into a portal (like ui/Modal.jsx) rather than as an
// absolutely-positioned child, so it never gets clipped by a scrollable
// ancestor (e.g. DataTable's overflow-x-auto wrapper) or by the row it sits
// near the bottom of.
const DropdownMenu = ({ trigger, items, align = "right" }) => {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState(null);
  const triggerRef = useRef(null);
  const panelRef = useRef(null);
  const itemRefs = useRef([]);
  const menuId = useId();

  const computePosition = () => {
    const rect = triggerRef.current.getBoundingClientRect();
    const left =
      align === "right"
        ? Math.max(VIEWPORT_MARGIN, rect.right - MENU_WIDTH)
        : rect.left;

    // Flip the panel above the trigger when there isn't enough room below —
    // exactly the case for a row near the bottom of a scrollable table.
    const estimatedHeight = items.length * 36 + 8;
    const spaceBelow = window.innerHeight - rect.bottom;
    const shouldFlipUp = spaceBelow < estimatedHeight && rect.top > estimatedHeight;

    setPosition(
      shouldFlipUp
        ? { left, bottom: window.innerHeight - rect.top + 4, top: undefined }
        : { left, top: rect.bottom + 4, bottom: undefined }
    );
  };

  const openMenu = () => {
    computePosition();
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e) => {
      if (
        triggerRef.current?.contains(e.target) ||
        panelRef.current?.contains(e.target)
      ) {
        return;
      }
      setOpen(false);
    };
    const handleDismiss = () => setOpen(false);

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleDismiss, true);
    window.addEventListener("resize", handleDismiss);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleDismiss, true);
      window.removeEventListener("resize", handleDismiss);
    };
  }, [open]);

  const focusItem = (index) => {
    const enabled = items
      .map((item, i) => ({ item, i }))
      .filter(({ item }) => !item.disabled);
    if (enabled.length === 0) return;
    const clamped = ((index % enabled.length) + enabled.length) % enabled.length;
    itemRefs.current[enabled[clamped].i]?.focus();
  };

  const handleTriggerKeyDown = (e) => {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openMenu();
      requestAnimationFrame(() => focusItem(0));
    }
  };

  const handleMenuKeyDown = (e) => {
    const currentIndex = itemRefs.current.findIndex((el) => el === document.activeElement);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      focusItem(currentIndex + 1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      focusItem(currentIndex - 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      focusItem(0);
    } else if (e.key === "End") {
      e.preventDefault();
      focusItem(items.length - 1);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      triggerRef.current?.focus();
    }
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={handleTriggerKeyDown}
      >
        {trigger}
      </button>

      {createPortal(
        <AnimatePresence>
          {open && position && (
            <motion.div
              {...scaleIn}
              ref={panelRef}
              id={menuId}
              role="menu"
              onKeyDown={handleMenuKeyDown}
              style={{
                position: "fixed",
                top: position.top,
                bottom: position.bottom,
                left: position.left,
                width: MENU_WIDTH,
              }}
              className="z-50 bg-surface border border-border rounded-control shadow-lg py-1"
            >
              {items.map((item, i) => (
                <button
                  key={item.key}
                  ref={(el) => (itemRefs.current[i] = el)}
                  type="button"
                  role="menuitem"
                  tabIndex={-1}
                  disabled={item.disabled}
                  onClick={() => {
                    setOpen(false);
                    item.onSelect?.();
                  }}
                  className={clsx(
                    "w-full flex items-center gap-2 px-4 py-2 text-body text-left transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                    itemVariantClasses[item.variant ?? "default"]
                  )}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};

export default DropdownMenu;
