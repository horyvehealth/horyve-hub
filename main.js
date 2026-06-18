"use strict";

// =====================================================
// HORYVĒ - main.js
//
// Handles:
// - English / French language switching
// - Safe translation rendering
// - Navigation scroll effect
// - Mobile burger menu
// - Hero dots animation
// - Smooth scrolling
// - Fade-in animations
// - Active nav link highlighting
//
// All translatable text lives in translations.js
// =====================================================


// -----------------------------------------------------
// CURRENT LANGUAGE
// -----------------------------------------------------
let currentLang = "en";


// -----------------------------------------------------
// SANITIZE HTML
//
// Security protection for translations.
//
// Allows only:
// - <br>
// - <em>
// - <span class="accent">
//
// Everything else is escaped so unwanted HTML/scripts
// cannot run from translations.js.
// -----------------------------------------------------
function sanitizeHTML(input) {
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


// -----------------------------------------------------
// LANGUAGE SWITCHER
//
// Changes all elements with data-i18n="key"
// using the TRANSLATIONS object from translations.js.
// -----------------------------------------------------
function setLang(lang) {
    if (typeof TRANSLATIONS === "undefined") {
        console.error("TRANSLATIONS is not loaded. Check translations.js and make sure it loads before main.js.");
        return;
    }

    currentLang = lang;

    const langBtn = document.getElementById("lang-btn");

    if (langBtn) {
        langBtn.textContent = lang === "en" ? "FR" : "EN";
        langBtn.setAttribute(
            "aria-label",
            lang === "en" ? "Passer en français" : "Switch to English"
        );
    }

    document.documentElement.setAttribute("lang", lang);

    const nodes = document.querySelectorAll("[data-i18n]");

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


// -----------------------------------------------------
// TOGGLE LANGUAGE BUTTON
// -----------------------------------------------------
function toggleLang() {
    setLang(currentLang === "en" ? "fr" : "en");
}


// -----------------------------------------------------
// NAVBAR SCROLL EFFECT
//
// Adds class "scrolled" when user scrolls down.
// -----------------------------------------------------
function initNavScroll() {
    const nav = document.getElementById("nav");
    if (!nav) return;

    const handleScroll = () => {
        if (window.scrollY > 20) {
            nav.classList.add("scrolled");
        } else {
            nav.classList.remove("scrolled");
        }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
}


// -----------------------------------------------------
// MOBILE BURGER MENU
//
// Opens/closes the mobile menu.
// Also closes it when a link is clicked or when user
// clicks outside the menu.
// -----------------------------------------------------
function initBurger() {
    const burger = document.getElementById("burger");
    const navLinks = document.getElementById("nav-links");

    if (!burger || !navLinks) return;

    let isOpen = false;

    burger.addEventListener("click", () => {
        isOpen = !isOpen;
        navLinks.classList.toggle("open", isOpen);
        burger.setAttribute("aria-expanded", String(isOpen));
        burger.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    });

    const links = navLinks.querySelectorAll(".nav-link");

    links.forEach((link) => {
        link.addEventListener("click", () => {
            isOpen = false;
            navLinks.classList.remove("open");
            burger.setAttribute("aria-expanded", "false");
        });
    });

    document.addEventListener("click", (e) => {
        const target = e.target;

        if (isOpen && !navLinks.contains(target) && !burger.contains(target)) {
            isOpen = false;
            navLinks.classList.remove("open");
            burger.setAttribute("aria-expanded", "false");
        }
    });
}


// -----------------------------------------------------
// HERO DOTS ANIMATION
//
// Rotates the small dots in the hero section.
// Disabled if user prefers reduced motion.
// -----------------------------------------------------
function initHeroDots() {
    const dots = document.querySelectorAll(".dot");
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


// -----------------------------------------------------
// SMOOTH SCROLL
//
// Smoothly scrolls to internal links like #about.
// try/catch prevents invalid anchor links from breaking JS.
// -----------------------------------------------------
function initSmoothScroll() {
    const anchors = document.querySelectorAll('a[href^="#"]');

    anchors.forEach((anchor) => {
        anchor.addEventListener("click", (e) => {
            const href = anchor.getAttribute("href");

            if (!href || href === "#") return;

            let target;

            try {
                target = document.querySelector(href);
            } catch {
                return;
            }

            if (!target) return;

            e.preventDefault();

            const navHeight = 68;
            const targetY =
                target.getBoundingClientRect().top + window.scrollY - navHeight;

            window.scrollTo({
                top: targetY,
                behavior: "smooth"
            });

            target.setAttribute("tabindex", "-1");
            target.focus({ preventScroll: true });
        });
    });
}


// -----------------------------------------------------
// FADE-IN ANIMATIONS
//
// Adds fade-in effect to sections when they enter view.
// Disabled if user prefers reduced motion.
// -----------------------------------------------------
function initFadeIn() {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;

    const targets = document.querySelectorAll(
        ".pb-copy, .pb-media, .feat-row, .about-copy, .about-media, .bundle-band, .nl-inner, .contact-inner, .trio-item, .review-card, .wid-list-col, .wid-img-col"
    );

    targets.forEach((el) => el.classList.add("fade-in"));

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -40px 0px"
        }
    );

    targets.forEach((el) => observer.observe(el));
}


// -----------------------------------------------------
// ACTIVE NAV LINK ON SCROLL
//
// Highlights the nav link matching the section currently
// visible on screen.
// -----------------------------------------------------
function initActiveNav() {
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-link");

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
        {
            rootMargin: "-50% 0px -50% 0px"
        }
    );

    sections.forEach((section) => observer.observe(section));
}


// -----------------------------------------------------
// INIT
//
// Starts all website behavior after the page is ready.
// -----------------------------------------------------
function init() {
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


// -----------------------------------------------------
// RUN INIT WHEN PAGE IS READY
// -----------------------------------------------------
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
} else {
    init();
}