// =====================================================
// HORYVĒ - main.ts
// TypeScript source (compile to main.js)
//
// This file handles: language switching (EN/FR),
// navigation, mobile menu, animations, smooth scroll.
//
// All translatable text lives in translations.js
// (the TRANSLATIONS object). This file just swaps
// text based on each element's data-i18n attribute.
// =====================================================

// ---- TYPES ----
type Lang = "en" | "fr";

interface TranslationEntry {
  en: string;
  fr: string;
}

interface TranslationTable {
  [key: string]: TranslationEntry;
}

// translations.js defines this global before main.js runs
declare const TRANSLATIONS: TranslationTable;

// ---- STATE ----
let currentLang: Lang = "en";

// ---- SANITIZE HTML ----
// Allows only <br>, <em>, and <span class="accent"> - prevents injection
function sanitizeHTML(input: string): string {
  if (typeof input !== "string") return "";

  const ALLOWED = /^\/?(br|em|span(?: class="accent")?)$/i;

  let result = "";
  let i = 0;

  while (i < input.length) {
    const ch = input[i];

    if (ch === "<") {
      const close = input.indexOf(">", i);

      if (close === -1) {
        result += "&lt;";
        i++;
        continue;
      }

      const tagContent = input.slice(i + 1, close).trim();

      if (ALLOWED.test(tagContent)) {
        result += "<" + tagContent + ">";
      } else {
        result += "&lt;" + input.slice(i + 1, close) + "&gt;";
      }

      i = close + 1;
    } else if (ch === ">") {
      result += "&gt;";
      i++;
    } else {
      result += ch;
      i++;
    }
  }

  return result;
}

// ---- LANGUAGE SWITCHER ----
function setLang(lang: Lang): void {
  if (typeof TRANSLATIONS === "undefined") {
    console.error("TRANSLATIONS is not loaded. Check translations.js and make sure it loads before main.js.");
    return;
  }

  currentLang = lang;

  const langBtn = document.getElementById("lang-btn") as HTMLButtonElement | null;
  if (langBtn) {
    langBtn.textContent = lang === "en" ? "FR" : "EN";
    langBtn.setAttribute("aria-label", lang === "en" ? "Passer en français" : "Switch to English");
  }

  document.documentElement.setAttribute("lang", lang);

  const nodes = document.querySelectorAll<HTMLElement>("[data-i18n]");
  nodes.forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (!key) return;

    const entry = TRANSLATIONS[key];
    if (!entry) {
      console.warn("Missing translation key:", key);
      return;
    }

    const val = lang === "en" ? entry.en : entry.fr;
    if (typeof val !== "string") {
      console.warn("Missing translation value:", key, lang);
      return;
    }
    el.innerHTML = sanitizeHTML(val);
  });
}

function toggleLang(): void {
  setLang(currentLang === "en" ? "fr" : "en");
}

// ---- NAVBAR SCROLL EFFECT ----
function initNavScroll(): void {
  const nav = document.getElementById("nav");
  if (!nav) return;

  const handleScroll = (): void => {
    if (window.scrollY > 20) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();
}

// ---- MOBILE BURGER MENU ----
function initBurger(): void {
  const burger = document.getElementById("burger") as HTMLButtonElement | null;
  const navLinks = document.getElementById("nav-links");
  if (!burger || !navLinks) return;

  let isOpen = false;

  burger.addEventListener("click", () => {
    isOpen = !isOpen;
    navLinks.classList.toggle("open", isOpen);
    burger.setAttribute("aria-expanded", String(isOpen));
    burger.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  });

  const links = navLinks.querySelectorAll<HTMLAnchorElement>(".nav-link");
  links.forEach((link) => {
    link.addEventListener("click", () => {
      isOpen = false;
      navLinks.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
    });
  });

  document.addEventListener("click", (e: MouseEvent) => {
    const target = e.target as Node;
    if (isOpen && !navLinks.contains(target) && !burger.contains(target)) {
      isOpen = false;
      navLinks.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
    }
  });
}

// ---- HERO DOTS ANIMATION ----
function initHeroDots(): void {
  const dots = document.querySelectorAll<HTMLElement>(".dot");
  if (dots.length === 0) return;

  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (mq.matches) return;

  let current = 0;
  setInterval(() => {
    dots[current].classList.remove("active");
    current = (current + 1) % dots.length;
    dots[current].classList.add("active");
  }, 2800);
}

// ---- SMOOTH SCROLL (keyboard accessible) ----
function initSmoothScroll(): void {
  const anchors = document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]');
  anchors.forEach((anchor) => {
    anchor.addEventListener("click", (e: MouseEvent) => {
      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;

      let target: HTMLElement | null;
      try {
        target = document.querySelector<HTMLElement>(href);
      } catch {
        return;
      }
      if (!target) return;

      e.preventDefault();

      const navHeight = 68;
      const targetY = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top: targetY, behavior: "smooth" });

      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    });
  });
}

// ---- INTERSECTION OBSERVER: FADE IN ----
function initFadeIn(): void {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (mq.matches) return;

  const targets = document.querySelectorAll<HTMLElement>(
    ".pb-copy, .pb-media, .feat-row, .about-copy, .about-media, .bundle-band, .nl-inner, .contact-inner, .trio-item, .review-card, .wid-list-col, .wid-img-col"
  );

  targets.forEach((el) => el.classList.add("fade-in"));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  targets.forEach((el) => observer.observe(el));
}

// ---- ACTIVE NAV LINK ON SCROLL ----
function initActiveNav(): void {
  const sections = document.querySelectorAll<HTMLElement>("section[id]");
  const navLinks = document.querySelectorAll<HTMLAnchorElement>(".nav-link");

  if (sections.length === 0 || navLinks.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          navLinks.forEach((link) => {
            const href = link.getAttribute("href");
            link.style.color = href === `#${id}` ? "var(--blush-deep)" : "";
          });
        }
      });
    },
    { rootMargin: "-50% 0px -50% 0px" }
  );

  sections.forEach((s) => observer.observe(s));
}

// ---- INIT ----
function init(): void {
  initNavScroll();
  initBurger();
  initHeroDots();
  initSmoothScroll();
  initFadeIn();
  initActiveNav();

  const langBtn = document.getElementById("lang-btn");
  if (langBtn) {
    langBtn.addEventListener("click", toggleLang);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
