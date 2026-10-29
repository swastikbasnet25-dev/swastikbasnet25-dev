
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


/* 8. CLICK SOUND EFFECTS */

let uiAudioContext;

function playClickSound() {
    try {
        if (!uiAudioContext) {
            uiAudioContext = new (
                window.AudioContext ||
                window.webkitAudioContext
            )();
        }

        if (uiAudioContext.state === "suspended") {
            uiAudioContext.resume();
        }

        const oscillator = uiAudioContext.createOscillator();
        const gain = uiAudioContext.createGain();
        const now = uiAudioContext.currentTime;

        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(900, now);
        oscillator.frequency.exponentialRampToValueAtTime(
            550,
            now + 0.045
        );

        gain.gain.setValueAtTime(0.035, now);
        gain.gain.exponentialRampToValueAtTime(
            0.001,
            now + 0.05
        );

        oscillator.connect(gain);
        gain.connect(uiAudioContext.destination);

        oscillator.start(now);
        oscillator.stop(now + 0.05);
    } catch (error) {
        // Sound must never interrupt website interactions.
    }
}

document.addEventListener("click", event => {
    const target = event.target;

    if (!(target instanceof Element)) return;

    const clickable = target.closest(
        "#menuButton, .tool-item, button, a, [role='button']"
    );

    if (clickable) {
        playClickSound();
    }
});
/* =========================================
   9. FLOATING PROJECT LIBRARY
========================================= */

const projectLibrary = document.getElementById("projectLibrary");
const libraryStage = document.getElementById("libraryStage");
const libraryTitle = document.getElementById("libraryTitle");
const libraryClose = document.getElementById("libraryClose");
const libraryCounter = document.getElementById("libraryCounter");

/*
 * Add your project image files to:
 * assests/projects/
 *
 * Replace these filenames with the exact names of your uploaded images.
 * Until an image exists, its card keeps a dark gradient thumbnail instead
 * of showing a broken-image icon.
 */

const projectCollections = {
    "THE BEAUTIFUL GAME": [
        { title: "Matchday Visual", image: "./assests/projects/beautiful-game-01.jpg", category: "FOOTBALL GRAPHICS" },
        { title: "Player Spotlight", image: "./assests/projects/beautiful-game-02.jpg", category: "PLAYER GRAPHIC" },
        { title: "The Final", image: "./assests/projects/beautiful-game-03.jpg", category: "MATCH CAMPAIGN" },
        { title: "Club Identity", image: "./assests/projects/beautiful-game-04.jpg", category: "SPORTS DESIGN" },
        { title: "The Game Never Stops", image: "./assests/projects/beautiful-game-05.jpg", category: "VISUAL STORY" }
    ],

    "OUT OF BOUNDS": [
        { title: "Altered Reality", image: "./assests/projects/out-of-bounds-01.jpg", category: "PHOTO MANIPULATION" },
        { title: "Beyond the Frame", image: "./assests/projects/out-of-bounds-02.jpg", category: "DIGITAL ART" },
        { title: "Visual Experiment", image: "./assests/projects/out-of-bounds-03.jpg", category: "COMPOSITING" },
        { title: "Unreal Spaces", image: "./assests/projects/out-of-bounds-04.jpg", category: "EXPERIMENTAL" },
        { title: "Distorted", image: "./assests/projects/out-of-bounds-05.jpg", category: "DIGITAL ART" }
    ],

    "IN CONSTANT MOTION": [
        { title: "Motion Study 01", image: "./assests/projects/motion-01.jpg", category: "MOTION DESIGN" },
        { title: "Rhythm & Type", image: "./assests/projects/motion-02.jpg", category: "KINETIC TYPE" },
        { title: "Visual Sequence", image: "./assests/projects/motion-03.jpg", category: "VIDEO EDITING" },
        { title: "Moving Forms", image: "./assests/projects/motion-04.jpg", category: "MOTION STUDY" },
        { title: "Frame by Frame", image: "./assests/projects/motion-05.jpg", category: "VISUAL STORY" }
    ],

    "THE UNKNOWN": [
        { title: "Untitled 01", image: "./assests/projects/unknown-01.jpg", category: "CREATIVE EXPERIMENT" },
        { title: "New Perspective", image: "./assests/projects/unknown-02.jpg", category: "PERSONAL WORK" },
        { title: "Form & Feeling", image: "./assests/projects/unknown-03.jpg", category: "VISUAL EXPLORATION" },
        { title: "No Rules", image: "./assests/projects/unknown-04.jpg", category: "EXPERIMENTAL" },
        { title: "Something Different", image: "./assests/projects/unknown-05.jpg", category: "PERSONAL WORK" }
    ]
};

let activeCollection = "";
let selectedProjectIndex = -1;
let previouslyFocusedElement = null;

function openProjectLibrary(collectionName) {
    if (!projectLibrary || !libraryStage) return;

    const projects = projectCollections[collectionName];
    if (!projects) return;

    activeCollection = collectionName;
    selectedProjectIndex = -1;
    previouslyFocusedElement = document.activeElement;

    libraryTitle.textContent = collectionName;
    libraryCounter.textContent =
        `${String(projects.length).padStart(2, "0")} PROJECTS`;

    libraryStage.classList.remove("has-selection");
    libraryStage.replaceChildren();

    projects.forEach((project, index) => {
        const card = document.createElement("button");
        card.type = "button";
        card.className = "library-card";
        card.dataset.slot = String(index);
        card.setAttribute(
            "aria-label",
            `View ${project.title}`
        );

        const imageFrame = document.createElement("span");
        imageFrame.className = "library-card-image";

        const image = document.createElement("img");
        image.src = project.image;
        image.alt = project.title;
        image.loading = "lazy";

        image.addEventListener("error", () => {
            image.remove();
        }, { once: true });

        imageFrame.appendChild(image);

        const meta = document.createElement("span");
        meta.className = "library-card-meta";

        const title = document.createElement("span");
        title.className = "library-card-title";
        title.textContent = project.title;

        const number = document.createElement("span");
        number.className = "library-card-number";
        number.textContent = String(index + 1).padStart(2, "0");

        meta.append(title, number);

        const category = document.createElement("span");
        category.className = "library-card-category";
        category.textContent = project.category;

        card.append(imageFrame, meta, category);

        card.addEventListener("click", () => {
            selectLibraryProject(index);
        });

        libraryStage.appendChild(card);
    });

    projectLibrary.classList.add("is-open");
    projectLibrary.setAttribute("aria-hidden", "false");
    document.body.classList.add("library-open");

    requestAnimationFrame(() => {
        libraryClose?.focus();
    });
}

function selectLibraryProject(index) {
    if (!libraryStage) return;

    const cards = [...libraryStage.querySelectorAll(".library-card")];
    if (!cards[index]) return;

    selectedProjectIndex = index;
    libraryStage.classList.add("has-selection");

    cards.forEach((card, cardIndex) => {
        const isSelected = cardIndex === index;

        card.classList.toggle("is-selected", isSelected);
        card.setAttribute("aria-pressed", String(isSelected));
        card.tabIndex = isSelected ? 0 : 0;
    });
}

function closeProjectLibrary() {
    if (!projectLibrary) return;

    projectLibrary.classList.remove("is-open");
    projectLibrary.setAttribute("aria-hidden", "true");
    document.body.classList.remove("library-open");

    activeCollection = "";
    selectedProjectIndex = -1;

    if (previouslyFocusedElement instanceof HTMLElement) {
        previouslyFocusedElement.focus();
    }
}

/* Clicking a category opens its five-project library. */
document.querySelectorAll(".project").forEach(project => {
    project.setAttribute("tabindex", "0");
    project.setAttribute("role", "button");

    const heading = project.querySelector(".project-info h3");
    const collectionName = heading?.textContent.trim();

    if (!collectionName || !projectCollections[collectionName]) return;

    project.setAttribute(
        "aria-label",
        `Open ${collectionName} project library`
    );

    project.addEventListener("click", event => {
        // Avoid opening the library when selecting text.
        if (event.target.closest("a")) return;

        openProjectLibrary(collectionName);
    });

    project.addEventListener("keydown", event => {
        if (
            event.target === project &&
            (event.key === "Enter" || event.key === " ")
        ) {
            event.preventDefault();
            openProjectLibrary(collectionName);
        }
    });
});

libraryClose?.addEventListener("click", closeProjectLibrary);

document.addEventListener("keydown", event => {
    if (event.key === "Escape" && projectLibrary?.classList.contains("is-open")) {
        closeProjectLibrary();
    }

    if (
        projectLibrary?.classList.contains("is-open") &&
        event.key === "ArrowRight" &&
        selectedProjectIndex >= 0
    ) {
        selectLibraryProject(
            (selectedProjectIndex + 1) % projectCollections[activeCollection].length
        );
    }

    if (
        projectLibrary?.classList.contains("is-open") &&
        event.key === "ArrowLeft" &&
        selectedProjectIndex >= 0
    ) {
        const total = projectCollections[activeCollection].length;
        selectLibraryProject((selectedProjectIndex - 1 + total) % total);
    }
});

/* Clicking the empty space closes the library. */
projectLibrary?.addEventListener("click", event => {
    if (event.target === projectLibrary) {
        closeProjectLibrary();
    }
});

/* ==========================================
   10. LIVING COSMOS — ANIMATED STARFIELD
========================================== */

(() => {
    const canvas = document.getElementById("cosmosCanvas");

    if (!canvas) {
        console.warn("Cosmos canvas not found. Check index.html.");
        return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    const stars = [];
    const starCount = 180;

    let width = 0;
    let height = 0;
    let animationFrame = null;
    let lastFrame = 0;

    const pointer = {
        x: 0,
        y: 0,
        targetX: 0,
        targetY: 0
    };

    function resizeCanvas() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        width = window.innerWidth;
        height = window.innerHeight;

        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);

        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        stars.length = 0;

        for (let i = 0; i < starCount; i++) {
            stars.push({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: Math.random() * 1.3 + 0.2,
                alpha: Math.random() * 0.65 + 0.15,
                speed: Math.random() * 0.7 + 0.15,
                phase: Math.random() * Math.PI * 2,
                twinkle: Math.random() * 0.8 + 0.2,
                depth: Math.random() * 0.8 + 0.2
            });
        }

        if (reduceMotion) draw(0);
    }

    function draw(time = 0) {
        ctx.clearRect(0, 0, width, height);

        pointer.x += (pointer.targetX - pointer.x) * 0.035;
        pointer.y += (pointer.targetY - pointer.y) * 0.035;

        for (const star of stars) {
            const twinkle = reduceMotion
                ? 1
                : 0.65 + Math.sin(
                    time * 0.001 * star.twinkle + star.phase
                ) * 0.35;

            const x = star.x + pointer.x * star.depth * 12;
            const y = star.y + pointer.y * star.depth * 12;

            ctx.beginPath();
            ctx.arc(x, y, star.radius, 0, Math.PI * 2);

            ctx.fillStyle = `rgba(225, 230, 255, ${
                star.alpha * twinkle
            })`;

            ctx.fill();

            if (star.radius > 1.15) {
                ctx.beginPath();
                ctx.arc(x, y, star.radius * 2.8, 0, Math.PI * 2);

                ctx.fillStyle = `rgba(150, 170, 255, ${
                    star.alpha * twinkle * 0.07
                })`;

                ctx.fill();
            }
        }
    }

    function animate(time) {
        animationFrame = null;

        if (document.hidden) return;

        if (time - lastFrame >= 30) {
            draw(time);
            lastFrame = time;
        }

        animationFrame = requestAnimationFrame(animate);
    }

    function startAnimation() {
        if (reduceMotion || document.hidden || animationFrame !== null) {
            if (reduceMotion) draw(0);
            return;
        }

        animationFrame = requestAnimationFrame(animate);
    }

    function stopAnimation() {
        if (animationFrame !== null) {
            cancelAnimationFrame(animationFrame);
            animationFrame = null;
        }
    }

    window.addEventListener("resize", resizeCanvas);

    window.addEventListener("pointermove", event => {
        pointer.targetX =
            (event.clientX / window.innerWidth - 0.5) * 2;

        pointer.targetY =
            (event.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            stopAnimation();
        } else {
            startAnimation();
        }
    });

    resizeCanvas();
    startAnimation();

    console.log("DESIGN AFTER DARK — Living cosmos initialized.");
})();