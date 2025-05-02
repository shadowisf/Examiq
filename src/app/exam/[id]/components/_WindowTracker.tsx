export function windowTracker(
  onBlocked: () => void,
  onUnblocked: () => void,
  windowBlockCount: Record<string, number>
) {
  function handleVisibilityChange() {
    if (document.visibilityState !== "visible") {
      onBlocked();
    } else {
      onUnblocked();
    }
  }

  function handleBlur() {
    onBlocked();
    windowBlockCount.blur = (windowBlockCount.blur || 0) + 1;
  }

  function handleFocus() {
    onUnblocked();
    windowBlockCount.unblur = (windowBlockCount.unblur || 0) + 1;
  }

  function handleContextMenu(e: MouseEvent) {
    e.preventDefault();
  }

  document.addEventListener("visibilitychange", handleVisibilityChange);
  window.addEventListener("blur", handleBlur);
  window.addEventListener("focus", handleFocus);
  window.addEventListener("contextmenu", handleContextMenu);

  return () => {
    document.removeEventListener("visibilitychange", handleVisibilityChange);
    window.removeEventListener("blur", handleBlur);
    window.removeEventListener("focus", handleFocus);
    window.removeEventListener("contextmenu", handleContextMenu);
  };
}
