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
        title: "Registry Home",
        path: "Home / Registry",
        summary: "Start with browse, weekly free picks, creator tools, and support from one place.",
        links: [
          { href: "assets.html", icon: "fas fa-grid-2", label: "All Assets" },
          { href: "assets.html?view=weekly-free", icon: "fas fa-gift", label: "Weekly Free" },
          { href: "upload.html", icon: "fas fa-cloud-arrow-up", label: "Publish" },
        ],
      },
      "assets.html": {
        title: "Browse Assets",
        path: "Home / Assets",
        summary: "Search, filter, and jump into the registry without digging through extra menus.",
        links: [
          { href: "assets.html?view=weekly-free", icon: "fas fa-gift", label: "Weekly Free" },
          { href: "upload.html", icon: "fas fa-cloud-arrow-up", label: "Publish" },
          { href: "support.html", icon: "fas fa-life-ring", label: "Help" },
        ],
      },
      "asset.html": {
        title: "Asset Detail",
        path: "Home / Assets / Detail",
        summary: "Use this page to inspect the release, reach the creator, or jump back into browse.",
        links: [
          { href: "assets.html", icon: "fas fa-grid-2", label: "Back To Assets" },
          { href: "profile.html", icon: "fas fa-user", label: "Creator Profile" },
          { href: "support.html", icon: "fas fa-life-ring", label: "Help" },
        ],
      },
      "upload.html": {
        title: "Release Builder",
        path: "Home / Publish",
        summary: "Move through the publish flow in a straight line: profile, guidelines, then release.",
        links: [
          { href: "guidelines.html", icon: "fas fa-book-open", label: "Guidelines" },
          { href: "profile.html", icon: "fas fa-user", label: "Profile" },
          { href: "support.html", icon: "fas fa-life-ring", label: "Upload Help" },
        ],
      },
      "profile.html": {
        title: "Profile Dashboard",
        path: "Home / Account / Profile",
        summary: "Keep your creator page, assets, and network controls in one place.",
        links: [
          { href: "upload.html", icon: "fas fa-cloud-arrow-up", label: "Publish" },
          { href: "friends.html", icon: "fas fa-user-friends", label: "Friends" },
          { href: "assets.html", icon: "fas fa-grid-2", label: "Browse" },
        ],
      },
      "friends.html": {
        title: "Friends And Network",
        path: "Home / Account / Friends",
        summary: "Handle follows, requests, and blocks without bouncing between pages.",
        links: [
          { href: "profile.html", icon: "fas fa-user", label: "Profile" },
          { href: "assets.html", icon: "fas fa-grid-2", label: "Browse" },
          { href: "support.html", icon: "fas fa-life-ring", label: "Support" },
        ],
      },
      "review.html": {
        title: "Review Queue",
        path: "Home / Moderation / Review",
        summary: "Review, approve, and publish from one queue instead of hopping around the site.",
        links: [
          { href: "upload.html", icon: "fas fa-cloud-arrow-up", label: "Publish" },
          { href: "assets.html", icon: "fas fa-grid-2", label: "Browse" },
          { href: "support.html", icon: "fas fa-life-ring", label: "Help" },
        ],
      },
      "support.html": {
        title: "Support Center",
        path: "Home / Support",
        summary: "Find answers fast for account issues, publishing, moderation, and local setup.",
        links: [
          { href: "guidelines.html", icon: "fas fa-book-open", label: "Guidelines" },
          { href: "upload.html", icon: "fas fa-cloud-arrow-up", label: "Publish" },
          { href: "about.html", icon: "fas fa-circle-info", label: "About" },
        ],
      },
      "about.html": {
        title: "About Loom",
        path: "Home / About",
        summary: "Get the high-level view of how Loom works before you dive into the registry.",
        links: [
          { href: "assets.html", icon: "fas fa-grid-2", label: "Browse" },
          { href: "support.html", icon: "fas fa-life-ring", label: "Support" },
          { href: "guidelines.html", icon: "fas fa-book-open", label: "Guidelines" },
        ],
      },
      "guidelines.html": {
        title: "Publishing Guidelines",
        path: "Home / Guidelines",
        summary: "Check the publishing rules before you spend time preparing a release.",
        links: [
          { href: "upload.html", icon: "fas fa-cloud-arrow-up", label: "Publish" },
          { href: "support.html", icon: "fas fa-life-ring", label: "Help" },
          { href: "assets.html", icon: "fas fa-grid-2", label: "Browse" },
        ],
      },
      "privacy.html": {
        title: "Privacy Policy",
        path: "Home / Legal / Privacy",
        summary: "Quick access to the legal pages and support without backing out of the footer.",
        links: [
          { href: "terms.html", icon: "fas fa-scale-balanced", label: "Terms" },
          { href: "support.html", icon: "fas fa-life-ring", label: "Support" },
          { href: "index.html", icon: "fas fa-house", label: "Home" },
        ],
      },
      "terms.html": {
        title: "Terms Of Use",
        path: "Home / Legal / Terms",
        summary: "Read the terms, jump to privacy, or head back into the main site quickly.",
        links: [
          { href: "privacy.html", icon: "fas fa-shield-halved", label: "Privacy" },
          { href: "support.html", icon: "fas fa-life-ring", label: "Support" },
          { href: "index.html", icon: "fas fa-house", label: "Home" },
        ],
      },
      "developers.html": {
        title: "Creator Directory",
        path: "Home / Creators / Directory",
        summary: "Compare creator pages and move back to assets or profile editing without extra clicks.",
        links: [
          { href: "profile.html", icon: "fas fa-user", label: "Profile" },
          { href: "assets.html", icon: "fas fa-grid-2", label: "Browse" },
          { href: "support.html", icon: "fas fa-life-ring", label: "Support" },
        ],
      },
      default: {
        title: "Loom Workspace",
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

    const buildSiteFrame = () => {
      const header = document.querySelector(".shell-header");
      const main = document.querySelector("main");
      if (!header || !main || document.querySelector(".site-frame")) return;
      const meta = pageMeta[pathName] || pageMeta.default;
      const pageClass = `page-${String(pathName).replace(/\.html$/i, "").replace(/[^a-z0-9_-]/gi, "-")}`;

      const siblings = [];
      let current = header.nextElementSibling;
      while (current) {
        siblings.push(current);
        current = current.nextElementSibling;
      }

      const frame = document.createElement("div");
      frame.className = "site-frame";

      const sidebar = document.createElement("aside");
      sidebar.className = "site-sidebar";

      const mainColumn = document.createElement("div");
      mainColumn.className = "site-main-column";

      header.parentNode.insertBefore(frame, header);
      frame.append(sidebar, mainColumn);
      sidebar.appendChild(header);

      const sidebarMeta = document.createElement("section");
      sidebarMeta.className = "shell-sidebar-meta";
      sidebarMeta.innerHTML = `
        <div class="shell-sidebar-kicker">Current Workspace</div>
        <div class="shell-sidebar-path">${meta.path}</div>
        <p class="shell-sidebar-summary">${meta.summary}</p>
      `;

      const shellNav = header.querySelector(".shell-nav");
      const shellActions = header.querySelector(".shell-actions");
      if (shellActions) {
        header.insertBefore(sidebarMeta, shellActions);
      } else if (shellNav) {
        shellNav.insertAdjacentElement("afterend", sidebarMeta);
      } else {
        header.appendChild(sidebarMeta);
      }

      for (const node of siblings) {
        if (node.classList && node.classList.contains("mobile-dock")) continue;
        mainColumn.appendChild(node);
      }

      document.body.classList.add("site-frame-ready");
      document.body.classList.add(pageClass);
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
      const main = document.querySelector("main");
      const mainColumn = document.querySelector(".site-main-column");
      const target = mainColumn || main;
      if (!main || !target || document.querySelector(".workspace-bar")) return;

      const meta = pageMeta[pathName] || pageMeta.default;
      const bar = document.createElement("section");
      bar.className = "site-wrap workspace-bar surface";

      const copy = document.createElement("div");
      copy.className = "workspace-copy";
      copy.innerHTML = `
        <div class="workspace-kicker">${meta.path}</div>
        <div class="workspace-title">${meta.title || "Loom Workspace"}</div>
        <p class="workspace-summary">${meta.summary}</p>
      `;
      bar.append(copy);

      if (Array.isArray(meta.links) && meta.links.length) {
        const links = document.createElement("div");
        links.className = "workspace-actions";
        for (const link of meta.links.slice(0, 2)) {
          const anchor = document.createElement("a");
          anchor.className = "workspace-action";
          anchor.href = link.href;
          anchor.innerHTML = `<i class="${link.icon}"></i><span>${link.label}</span>`;
          links.appendChild(anchor);
        }
        bar.appendChild(links);
      }

      target.insertBefore(bar, main);
    };

    const cleanupGlobalLinks = () => {
      document.querySelectorAll('.shell-nav .shell-link[href*="view=weekly-free"]').forEach((anchor) => {
        anchor.remove();
      });

      document.querySelectorAll('a[href="index.html#devchoice-grid"]').forEach((anchor) => {
        anchor.href = "index.html#featured-grid";
        if (anchor.textContent.trim().toLowerCase() === "dev choice") {
          anchor.textContent = "Featured";
        }
      });

      document.querySelectorAll('a[href="index.html#featured-grid"]').forEach((anchor) => {
        if (anchor.textContent.trim().toLowerCase() === "feature system") {
          anchor.textContent = "Featured";
        }
      });
    };

    const simplifyHeaderActions = () => {
      const actions = document.querySelector(".shell-actions");
      if (!actions) return;

      if (["index.html", "profile.html", "friends.html"].includes(pathName)) {
        return;
      }

      const visiblePills = Array.from(actions.querySelectorAll(".shell-pill")).filter((item) => {
        return !item.classList.contains("hidden") && item.offsetParent !== null;
      });

      if (visiblePills.length <= 1) {
        return;
      }

      const preferred =
        actions.querySelector("#back-btn") ||
        actions.querySelector("#review-link:not(.hidden)") ||
        visiblePills[0];

      for (const pill of visiblePills) {
        if (pill === preferred) continue;
        pill.style.display = "none";
        pill.setAttribute("aria-hidden", "true");
      }
    };

    const simplifyShortcutSections = () => {
      const shortcutSections = Array.from(document.querySelectorAll(".page-shortcuts"));
      for (const section of shortcutSections) {
        const shortcuts = Array.from(section.querySelectorAll(".page-shortcut"));
        if (shortcuts.length <= 2) continue;
        shortcuts.slice(2).forEach((shortcut) => shortcut.remove());
      }
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
      buildSiteFrame();
      cleanupGlobalLinks();
      simplifyHeaderActions();
      injectPageContext();
      simplifyShortcutSections();
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
