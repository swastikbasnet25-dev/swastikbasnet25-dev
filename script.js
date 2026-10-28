
/* =========================================
   DESIGN AFTER DARK — INTERACTIONS
   Swastik Basnet
========================================= */

// 1. LIVE KATHMANDU CLOCK

const clock = document.getElementById("clock");

function updateClock() {
    if (!clock) return;

    const now = new Date();

    const time = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Kathmandu",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
    }).format(now);

    clock.textContent = time;
}

updateClock();
setInterval(updateClock, 1000);


// 2. INTERACTIVE MENU

const menuButton = document.getElementById("menuButton");
const menuPanel = document.getElementById("menuPanel");
const menuLinks = menuPanel
    ? menuPanel.querySelectorAll("a")
    : [];

function closeMenu() {
    if (!menuPanel || !menuButton) return;

    menuPanel.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");

    const label = menuButton.childNodes[0];

    if (label) {
        label.textContent = "MENU ";
    }
}

function toggleMenu() {
    if (!menuPanel || !menuButton) return;

    const isOpen = menuPanel.classList.toggle("open");

    menuButton.setAttribute("aria-expanded", String(isOpen));

    const label = menuButton.childNodes[0];

    if (label) {
        label.textContent = isOpen ? "CLOSE " : "MENU ";
    }
}

if (menuButton && menuPanel) {
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.addEventListener("click", toggleMenu);

    menuLinks.forEach(link => {
        link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            closeMenu();
        }
    });
}


// 3. MOUSE-RESPONSIVE ORB

const hero = document.querySelector(".hero");
const orb = document.querySelector(".orb");

const canUseFinePointer = window.matchMedia(
    "(hover: hover) and (pointer: fine)"
).matches;

if (hero && orb && canUseFinePointer) {
    hero.addEventListener("pointermove", event => {
        const bounds = hero.getBoundingClientRect();

        const x = (event.clientX - bounds.left) / bounds.width;
        const y = (event.clientY - bounds.top) / bounds.height;

        const moveX = (x - 0.5) * 22;
        const moveY = (y - 0.5) * 22;

        orb.style.translate = `${moveX}px ${moveY}px`;
    });

    hero.addEventListener("pointerleave", () => {
        orb.style.translate = "0px 0px";
    });
}


// 4. SCROLL REVEAL ANIMATIONS

const revealElements = document.querySelectorAll(
    ".manifesto, .section-heading, .project, .about, .contact"
);

const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

if ("IntersectionObserver" in window && !reducedMotion) {
    revealElements.forEach(element => {
        element.classList.add("reveal-ready");
    });

    const revealObserver = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("revealed");
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12
        }
    );

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });
} else {
    revealElements.forEach(element => {
        element.classList.add("revealed");
    });
}


// 5. PROJECT CARD INTERACTIONS

const projects = document.querySelectorAll(".project");

projects.forEach(project => {
    const art = project.querySelector(".project-art");

    if (!art) return;

    project.addEventListener("pointermove", event => {
        if (!canUseFinePointer) return;

        const bounds = art.getBoundingClientRect();

        const x = (event.clientX - bounds.left) / bounds.width;
        const y = (event.clientY - bounds.top) / bounds.height;

        const rotateY = (x - 0.5) * 3;
        const rotateX = (0.5 - y) * 3;

        art.style.transform =
            `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    project.addEventListener("pointerleave", () => {
        art.style.transform = "";
    });
});


// 6. FOOTER YEAR

const yearElements = document.querySelectorAll(".footer-bottom");

yearElements.forEach(footer => {
    const copyright = footer.querySelector("span");

    if (copyright) {
        copyright.textContent =
            `© ${new Date().getFullYear()} SWASTIK BASNET`;
    }
});


// 7. EMAIL LINK REMINDER

const contactLink = document.getElementById("contactLink");

if (contactLink) {
    contactLink.addEventListener("click", event => {
        const email = contactLink.getAttribute("href");

        if (email && email.includes("YOUR_EMAIL@example.com")) {
            event.preventDefault();

            alert(
                "Your portfolio is almost ready! " +
                "Update the contact email in index.html first."
            );
        }
    });
}

console.log("DESIGN AFTER DARK — Portfolio initialized.");
