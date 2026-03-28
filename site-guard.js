(() => {
  try {
    const pathName = location.pathname.split("/").pop() || "index.html";
    const isFile = location.protocol === "file:";
    const isLocalHost =
      location.hostname === "localhost" ||
      location.hostname === "127.0.0.1" ||
      location.hostname === "";

    const pageMeta = {
      "index.html": {
        path: "Home / Registry",
        summary: "Start with browse, weekly free picks, creator tools, and support from one place.",
        links: [
          { href: "assets.html", icon: "fas fa-grid-2", label: "All Assets" },
          { href: "assets.html?view=weekly-free", icon: "fas fa-gift", label: "Weekly Free" },
          { href: "upload.html", icon: "fas fa-cloud-arrow-up", label: "Publish" },
        ],
      },
      "assets.html": {
        path: "Home / Assets",
        summary: "Search, filter, and jump into the registry without digging through extra menus.",
        links: [
          { href: "assets.html?view=weekly-free", icon: "fas fa-gift", label: "Weekly Free" },
          { href: "upload.html", icon: "fas fa-cloud-arrow-up", label: "Publish" },
          { href: "support.html", icon: "fas fa-life-ring", label: "Help" },
        ],
      },
      "asset.html": {
        path: "Home / Assets / Detail",
        summary: "Use this page to inspect the release, reach the creator, or jump back into browse.",
        links: [
          { href: "assets.html", icon: "fas fa-grid-2", label: "Back To Assets" },
          { href: "profile.html", icon: "fas fa-user", label: "Creator Profile" },
          { href: "support.html", icon: "fas fa-life-ring", label: "Help" },
        ],
      },
      "upload.html": {
        path: "Home / Publish",
        summary: "Move through the publish flow in a straight line: profile, guidelines, then release.",
        links: [
          { href: "guidelines.html", icon: "fas fa-book-open", label: "Guidelines" },
          { href: "profile.html", icon: "fas fa-user", label: "Profile" },
          { href: "support.html", icon: "fas fa-life-ring", label: "Upload Help" },
        ],
      },
      "profile.html": {
        path: "Home / Account / Profile",
        summary: "Keep your creator page, assets, and network controls in one place.",
        links: [
          { href: "upload.html", icon: "fas fa-cloud-arrow-up", label: "Publish" },
          { href: "friends.html", icon: "fas fa-user-friends", label: "Friends" },
          { href: "assets.html", icon: "fas fa-grid-2", label: "Browse" },
        ],
      },
      "friends.html": {
        path: "Home / Account / Friends",
        summary: "Handle follows, requests, and blocks without bouncing between pages.",
        links: [
          { href: "profile.html", icon: "fas fa-user", label: "Profile" },
          { href: "assets.html", icon: "fas fa-grid-2", label: "Browse" },
          { href: "support.html", icon: "fas fa-life-ring", label: "Support" },
        ],
      },
      "review.html": {
        path: "Home / Moderation / Review",
        summary: "Review, approve, and publish from one queue instead of hopping around the site.",
        links: [
          { href: "upload.html", icon: "fas fa-cloud-arrow-up", label: "Publish" },
          { href: "assets.html", icon: "fas fa-grid-2", label: "Browse" },
          { href: "support.html", icon: "fas fa-life-ring", label: "Help" },
        ],
      },
      "support.html": {
        path: "Home / Support",
        summary: "Find answers fast for account issues, publishing, moderation, and local setup.",
        links: [
          { href: "guidelines.html", icon: "fas fa-book-open", label: "Guidelines" },
          { href: "upload.html", icon: "fas fa-cloud-arrow-up", label: "Publish" },
          { href: "about.html", icon: "fas fa-circle-info", label: "About" },
        ],
      },
      "about.html": {
        path: "Home / About",
        summary: "Get the high-level view of how Loom works before you dive into the registry.",
        links: [
          { href: "assets.html", icon: "fas fa-grid-2", label: "Browse" },
          { href: "support.html", icon: "fas fa-life-ring", label: "Support" },
          { href: "guidelines.html", icon: "fas fa-book-open", label: "Guidelines" },
        ],
      },
      "guidelines.html": {
        path: "Home / Guidelines",
        summary: "Check the publishing rules before you spend time preparing a release.",
        links: [
          { href: "upload.html", icon: "fas fa-cloud-arrow-up", label: "Publish" },
          { href: "support.html", icon: "fas fa-life-ring", label: "Help" },
          { href: "assets.html", icon: "fas fa-grid-2", label: "Browse" },
        ],
      },
      "privacy.html": {
        path: "Home / Legal / Privacy",
        summary: "Quick access to the legal pages and support without backing out of the footer.",
        links: [
          { href: "terms.html", icon: "fas fa-scale-balanced", label: "Terms" },
          { href: "support.html", icon: "fas fa-life-ring", label: "Support" },
          { href: "index.html", icon: "fas fa-house", label: "Home" },
        ],
      },
      "terms.html": {
        path: "Home / Legal / Terms",
        summary: "Read the terms, jump to privacy, or head back into the main site quickly.",
        links: [
          { href: "privacy.html", icon: "fas fa-shield-halved", label: "Privacy" },
          { href: "support.html", icon: "fas fa-life-ring", label: "Support" },
          { href: "index.html", icon: "fas fa-house", label: "Home" },
        ],
      },
      "developers.html": {
        path: "Home / Creators / Directory",
        summary: "Compare creator pages and move back to assets or profile editing without extra clicks.",
        links: [
          { href: "profile.html", icon: "fas fa-user", label: "Profile" },
          { href: "assets.html", icon: "fas fa-grid-2", label: "Browse" },
          { href: "support.html", icon: "fas fa-life-ring", label: "Support" },
        ],
      },
      default: {
        path: "Home / Loom",
        summary: "Use the quick links to move between browse, publishing, account, and support.",
        links: [
          { href: "index.html", icon: "fas fa-house", label: "Home" },
          { href: "assets.html", icon: "fas fa-grid-2", label: "Assets" },
          { href: "upload.html", icon: "fas fa-cloud-arrow-up", label: "Publish" },
        ],
      },
    };

    const dockItems = [
      { href: "index.html", icon: "fas fa-house", label: "Home", match: ["index.html"] },
      { href: "assets.html", icon: "fas fa-grid-2", label: "Assets", match: ["assets.html", "asset.html"] },
      { href: "upload.html", icon: "fas fa-cloud-arrow-up", label: "Publish", match: ["upload.html", "review.html"] },
      { href: "profile.html", icon: "fas fa-user", label: "Profile", match: ["profile.html", "friends.html", "developers.html"] },
      { href: "support.html", icon: "fas fa-life-ring", label: "Support", match: ["support.html", "about.html", "guidelines.html", "privacy.html", "terms.html"] },
    ];

    const onReady = (fn) => {
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", fn, { once: true });
      } else {
        fn();
      }
    };

    const showFileWarning = () => {
      if (document.getElementById("loom-file-warning")) return;
      const warning = document.createElement("div");
      warning.id = "loom-file-warning";
      warning.style.cssText =
        "position:sticky;top:0;z-index:9999;margin:12px auto 0;width:min(1500px,calc(100% - 2rem));padding:14px 16px;border-radius:18px;border:1px solid rgba(255,121,198,.22);background:rgba(18,16,25,.96);backdrop-filter:blur(14px);box-shadow:0 14px 32px rgba(0,0,0,.45);color:#f8f8f2;font:13px/1.6 'Outfit',sans-serif";
      warning.innerHTML =
        "<strong style='display:block;font-weight:800;margin-bottom:4px;letter-spacing:.04em;text-transform:uppercase'>Run Loom from a local server</strong>" +
        "<span style='color:rgba(248,248,242,.74)'>Some pages use Firebase modules and will not work correctly from <code style='background:rgba(255,255,255,.08);padding:2px 6px;border-radius:8px'>file://</code>. Start <code style='background:rgba(255,255,255,.08);padding:2px 6px;border-radius:8px'>launch-local.bat</code> or <code style='background:rgba(255,255,255,.08);padding:2px 6px;border-radius:8px'>launch-local.ps1</code>, then open <code style='background:rgba(255,255,255,.08);padding:2px 6px;border-radius:8px'>http://127.0.0.1:4173</code>.</span>";
      document.body.prepend(warning);
    };

    const injectPageContext = () => {
      const header = document.querySelector(".shell-header");
      const main = document.querySelector("main");
      if (!header || !main || document.querySelector(".page-context-strip")) return;

      const meta = pageMeta[pathName] || pageMeta.default;
      const strip = document.createElement("nav");
      strip.className = "site-wrap page-context-strip surface";
      strip.setAttribute("aria-label", "Page context");

      const copy = document.createElement("div");
      copy.className = "page-context-copy";
      copy.innerHTML = `
        <div class="page-context-label">You Are Here</div>
        <div class="page-context-path">${meta.path}</div>
        <p class="page-context-summary">${meta.summary}</p>
      `;

      const links = document.createElement("div");
      links.className = "page-context-links";
      for (const link of meta.links || []) {
        const anchor = document.createElement("a");
        anchor.className = "page-context-link";
        anchor.href = link.href;
        anchor.innerHTML = `<i class="${link.icon}"></i><span>${link.label}</span>`;
        links.appendChild(anchor);
      }

      strip.append(copy, links);
      header.insertAdjacentElement("afterend", strip);
    };

    const injectMobileDock = () => {
      if (document.querySelector(".mobile-dock")) return;
      const dock = document.createElement("nav");
      dock.className = "mobile-dock";
      dock.setAttribute("aria-label", "Quick navigation");

      for (const item of dockItems) {
        const anchor = document.createElement("a");
        const isActive = item.match.includes(pathName);
        anchor.className = `mobile-dock-link${isActive ? " is-active" : ""}`;
        anchor.href = item.href;
        if (isActive) {
          anchor.setAttribute("aria-current", "page");
        }
        anchor.innerHTML = `<i class="${item.icon}"></i><span>${item.label}</span>`;
        dock.appendChild(anchor);
      }

      document.body.classList.add("has-mobile-dock");
      document.body.appendChild(dock);
    };

    const enhanceSiteChrome = () => {
      injectPageContext();
      injectMobileDock();
    };

    if (isFile) {
      onReady(showFileWarning);
      return;
    }

    onReady(enhanceSiteChrome);

    if (isLocalHost) return;

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
          (ctrlOrMeta && key === "U") ||
          (ctrlOrMeta && key === "S") ||
          (ctrlOrMeta && event.shiftKey && (key === "I" || key === "J" || key === "C"));

        if (!blocked) return;
        event.preventDefault();
        event.stopPropagation();
      },
      { capture: true }
    );
  } catch {}
})();
