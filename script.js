const root = document.documentElement;
const toggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".main-nav");
const themeToggle = document.querySelector(".theme-toggle");
const themeMeta = document.querySelector('meta[name="theme-color"]');

const MOBILE_QUERY = "(max-width: 1100px)";

/* =====================================================
   MODE TERANG / MODE MALAM
===================================================== */
function getStoredTheme() {
  try {
    const value = localStorage.getItem("theme");
    return value === "light" || value === "dark" ? value : null;
  } catch (e) {
    return null;
  }
}

function applyTheme(theme) {
  root.setAttribute("data-theme", theme);
  if (themeMeta) themeMeta.setAttribute("content", theme === "dark" ? "#0b1722" : "#ffffff");
  if (themeToggle) {
    const isDark = theme === "dark";
    themeToggle.setAttribute("aria-pressed", String(isDark));
    themeToggle.setAttribute("aria-label", isDark ? "Beralih ke mode terang" : "Beralih ke mode malam");
    themeToggle.setAttribute("title", isDark ? "Mode terang" : "Mode malam");
  }
}

const systemDark = window.matchMedia("(prefers-color-scheme: dark)");
applyTheme(getStoredTheme() || (systemDark.matches ? "dark" : "light"));

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
    try { localStorage.setItem("theme", next); } catch (e) { /* penyimpanan tidak tersedia */ }
  });
}

// Ikuti pengaturan sistem selama pengunjung belum memilih tema sendiri.
const onSystemChange = (event) => {
  if (!getStoredTheme()) applyTheme(event.matches ? "dark" : "light");
};
if (systemDark.addEventListener) systemDark.addEventListener("change", onSystemChange);
else if (systemDark.addListener) systemDark.addListener(onSystemChange);

/* =====================================================
   NAVIGASI: menu mobile
===================================================== */
function closeMenu() {
  if (nav && toggle) {
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Buka menu");
    toggle.textContent = "☰";
  }
}

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Tutup menu" : "Buka menu");
    toggle.textContent = isOpen ? "✕" : "☰";
  });

  // Setiap tautan di menu menutup menu (termasuk tautan submenu pada halaman yang sama).
  nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
}

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  const menuWasOpen = nav && nav.classList.contains("open");
  closeMenu();
  if (menuWasOpen && toggle) toggle.focus();
});

// Tutup saat mengetuk di luar menu / dropdown.
document.addEventListener("click", (event) => {
  if (nav && nav.classList.contains("open") && !event.target.closest(".site-header")) closeMenu();
});

// Reset status menu saat kembali ke tampilan desktop.
window.addEventListener("resize", () => {
  if (!window.matchMedia(MOBILE_QUERY).matches) closeMenu();
});
