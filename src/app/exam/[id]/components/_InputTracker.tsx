export function inputTracker(
  keyPressCount: Record<string, number>,
  mouseClickCount: Record<string, number>
) {
  function handleKeyPress(event: KeyboardEvent) {
    const key = event.key.toUpperCase();
    keyPressCount[key] = (keyPressCount[key] || 0) + 1;
  }

  function handleMouseDown(event: MouseEvent) {
    let button = "";

    switch (event.button) {
      case 0:
        button = "left";
        break;
      case 1:
        button = "middle";
        break;
      case 2:
        button = "right";
        break;
      default:
        button = `button-${event.button}`;
    }

    mouseClickCount[button] = (mouseClickCount[button] || 0) + 1;
  }

  window.addEventListener("keydown", handleKeyPress);
  window.addEventListener("mousedown", handleMouseDown);

  return function cleanup() {
    window.removeEventListener("keydown", handleKeyPress);
    window.removeEventListener("mousedown", handleMouseDown);
  };
}
