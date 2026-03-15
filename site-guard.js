(() => {
  try {
    const isLocal =
      location.protocol === "file:" ||
      location.hostname === "localhost" ||
      location.hostname === "127.0.0.1" ||
      location.hostname === "";

    // DevTools can't be truly blocked; this only deters casual copying.
    // Skip locally so development isn't painful.
    if (isLocal) return;

    document.addEventListener(
      "contextmenu",
      (event) => {
        event.preventDefault();
      },
      { capture: true }
    );

    document.addEventListener(
      "keydown",
      (event) => {
        const key = String(event.key || "").toUpperCase();
        const ctrlOrMeta = event.ctrlKey || event.metaKey;

        const blocked =
          event.key === "F12" ||
          (ctrlOrMeta && key === "U") || // View source
          (ctrlOrMeta && key === "S") || // Save page
          (ctrlOrMeta && event.shiftKey && (key === "I" || key === "J" || key === "C")); // DevTools

        if (!blocked) return;
        event.preventDefault();
        event.stopPropagation();
      },
      { capture: true }
    );
  } catch {}
})();
