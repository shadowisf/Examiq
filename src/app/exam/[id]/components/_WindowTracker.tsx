export function windowTracker(onBlocked: () => void, onUnblocked: () => void) {
  const handleVisibilityChange = () => {
    if (document.visibilityState !== "visible") {
      onBlocked();
    } else {
      onUnblocked();
    }
  };

  const handleBlur = () => {
    onBlocked();
  };

  const handleFocus = () => {
    onUnblocked();
  };

  const handleContextMenu = (e: MouseEvent) => {
    e.preventDefault();
  };

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
