// ==================================================
// SMS SHIELD - FRONTEND JAVASCRIPT
// ==================================================

document.documentElement.classList.add("js");

const $ = (id) => document.getElementById(id);

const messageInput = $("messageInput");
const analyzeButton = $("analyzeButton");
const buttonText = $("buttonText");
const clearButton = $("clearButton");
const characterCount = $("characterCount");
const countBar = $("countBar");
const detectionCard = $("detectionCard");
const resultSection = $("resultSection");
const resultBadge = $("resultBadge");
const resultIcon = $("resultIcon");
const resultText = $("resultText");
const resultDescription = $("resultDescription");
const analyzedMessage = $("analyzedMessage");
const resultTime = $("resultTime");
const errorMessage = $("errorMessage");

const MAX_CHARS = 5000;

// Minimum time (ms) the "scanning" animation is shown.
// Set to 0 if you want results to appear instantly.
const MIN_SCAN_MS = 800;

const prefersReducedMotion =
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const finePointer =
    window.matchMedia("(hover: hover) and (pointer: fine)").matches;

const SAMPLES = {

    spam:
        "CONGRATULATIONS! You have won a $1000 gift card. " +
        "Claim your prize now at http://bit.ly/claim-prize " +
        "or reply WIN to 80085. Offer expires today!",

    ham:
        "Hey, I'll be home by 7. Can you pick up some milk " +
        "on your way back? Thanks!"

};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));


// --------------------------------------------------
// CHARACTER COUNTER
// --------------------------------------------------

function updateCounter() {

    const length = messageInput.value.length;

    characterCount.textContent = `${length} / ${MAX_CHARS} characters`;

    countBar.style.width = `${Math.min((length / MAX_CHARS) * 100, 100)}%`;

    characterCount.parentElement.classList.toggle(
        "near-limit",
        length > MAX_CHARS * 0.9
    );

}

messageInput.addEventListener("input", updateCounter);


// --------------------------------------------------
// CLEAR INPUT
// --------------------------------------------------

clearButton.addEventListener("click", function () {

    messageInput.value = "";

    updateCounter();

    resultSection.classList.add("hidden");

    errorMessage.classList.add("hidden");

    messageInput.focus();

});


// --------------------------------------------------
// SAMPLE MESSAGES
// --------------------------------------------------

document.querySelectorAll(".sample-chip").forEach(function (chip) {

    chip.addEventListener("click", function () {

        messageInput.value = SAMPLES[chip.dataset.sample] || "";

        updateCounter();

        errorMessage.classList.add("hidden");

        messageInput.focus();

    });

});


// --------------------------------------------------
// ERROR DISPLAY
// --------------------------------------------------

function showError(message) {

    errorMessage.textContent = message;

    errorMessage.classList.remove("hidden");

}


// --------------------------------------------------
// LOADING STATE
// --------------------------------------------------

function setLoading(isLoading) {

    analyzeButton.disabled = isLoading;

    analyzeButton.classList.toggle("loading", isLoading);

    detectionCard.classList.toggle("scanning", isLoading);

    buttonText.textContent = isLoading
        ? "Analyzing Message..."
        : "Analyze Message";

}


// --------------------------------------------------
// PREDICTION REQUEST
// --------------------------------------------------

analyzeButton.addEventListener("click", async function () {

    const message = messageInput.value.trim();

    // Validate input

    errorMessage.classList.add("hidden");

    resultSection.classList.add("hidden");

    if (!message) {

        showError("Please enter an SMS message before analyzing.");

        messageInput.focus();

        return;

    }


    if (message.length > MAX_CHARS) {

        showError("Message must not exceed 5000 characters.");

        return;

    }


    // Loading state

    setLoading(true);


    try {

        const [response] = await Promise.all([

            fetch("/predict", {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    message: message

                })

            }),

            sleep(MIN_SCAN_MS)

        ]);


        const data = await response.json().catch(function () {
            return {};
        });


        if (!response.ok || !data.success) {

            throw new Error(
                data.error || "Unable to analyze the message."
            );

        }


        displayResult(data);


    }

    catch (error) {

        showError(error.message);

    }

    finally {

        setLoading(false);

    }

});


// --------------------------------------------------
// DISPLAY RESULT
// --------------------------------------------------

function displayResult(data) {

    resultSection.classList.remove("hidden");

    resultSection.classList.remove("spam", "ham");

    resultBadge.classList.remove("spam", "ham");


    const isSpam = data.prediction === "SPAM";


    if (isSpam) {

        resultSection.classList.add("spam");

        resultBadge.classList.add("spam");

        resultIcon.textContent = "⚠";

        resultText.textContent = "SPAM DETECTED";

        resultDescription.textContent =
            "This message has been classified as spam. " +
            "Be careful before responding or clicking any links.";

    }

    else {

        resultSection.classList.add("ham");

        resultBadge.classList.add("ham");

        resultIcon.textContent = "✓";

        resultText.textContent = "LEGITIMATE MESSAGE";

        resultDescription.textContent =
            "This message has been classified as legitimate (Ham). " +
            "However, always verify suspicious requests independently.";

    }


    analyzedMessage.textContent = data.message;

    resultTime.textContent = data.timestamp;


    resultSection.scrollIntoView({

        behavior: prefersReducedMotion ? "auto" : "smooth",

        block: "nearest"

    });


    // Celebrate / warn with a particle burst

    const rect = resultBadge.getBoundingClientRect();

    burst(
        rect.left + rect.width / 2,
        rect.top + rect.height / 2,
        isSpam ? "spam" : "ham"
    );

}


// --------------------------------------------------
// KEYBOARD SHORTCUT (Ctrl/Cmd + Enter)
// --------------------------------------------------

messageInput.addEventListener("keydown", function (event) {

    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {

        analyzeButton.click();

    }

});


// ==================================================
// VISUAL EFFECTS
// ==================================================


// --------------------------------------------------
// NAVBAR SHADOW ON SCROLL
// --------------------------------------------------

const navbar = $("navbar");

function onScroll() {

    navbar.classList.toggle("scrolled", window.scrollY > 24);

}

window.addEventListener("scroll", onScroll, { passive: true });

onScroll();


// --------------------------------------------------
// SCROLL REVEAL + COUNT-UP NUMBERS
// --------------------------------------------------

function countUp(element) {

    const target = parseFloat(element.dataset.count);

    if (Number.isNaN(target) || prefersReducedMotion) {
        return;
    }

    const duration = 1500;

    const start = performance.now();

    function tick(now) {

        const progress = Math.min((now - start) / duration, 1);

        const eased = 1 - Math.pow(1 - progress, 3);

        element.textContent = (target * eased).toFixed(2) + "%";

        if (progress < 1) {
            requestAnimationFrame(tick);
        }

    }

    requestAnimationFrame(tick);

}

const revealTargets = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {

    const observer = new IntersectionObserver(function (entries) {

        entries.forEach(function (entry) {

            if (!entry.isIntersecting) {
                return;
            }

            entry.target.classList.add("in-view");

            entry.target
                .querySelectorAll("[data-count]")
                .forEach(countUp);

            observer.unobserve(entry.target);

        });

    }, {

        threshold: 0.12,

        rootMargin: "0px 0px -5% 0px"

    });

    revealTargets.forEach(function (element) {
        observer.observe(element);
    });

}

else {

    revealTargets.forEach(function (element) {
        element.classList.add("in-view");
    });

}


// --------------------------------------------------
// 3D TILT CARDS
// --------------------------------------------------

document.querySelectorAll(".tilt").forEach(function (element) {

    if (prefersReducedMotion || !finePointer) {
        return;
    }

    const maxTilt = parseFloat(element.dataset.tilt || "8");

    const lift = parseFloat(element.dataset.lift || "0");

    const lockOnFocus = element.dataset.lockOnFocus === "true";

    let frame = null;


    element.addEventListener("pointermove", function (event) {

        const rect = element.getBoundingClientRect();

        const px = (event.clientX - rect.left) / rect.width;

        const py = (event.clientY - rect.top) / rect.height;


        cancelAnimationFrame(frame);

        frame = requestAnimationFrame(function () {

            element.style.setProperty("--mx", `${px * 100}%`);

            element.style.setProperty("--my", `${py * 100}%`);


            // Keep text crisp while the person is typing

            if (lockOnFocus && element.contains(document.activeElement) &&
                document.activeElement.tagName === "TEXTAREA") {

                element.style.transform = "";

                return;

            }


            const rotateX = (0.5 - py) * maxTilt * 2;

            const rotateY = (px - 0.5) * maxTilt * 2;

            element.style.transform =
                `perspective(1100px) rotateX(${rotateX.toFixed(2)}deg) ` +
                `rotateY(${rotateY.toFixed(2)}deg) translateY(${-lift}px)`;

        });

    });


    element.addEventListener("pointerleave", function () {

        cancelAnimationFrame(frame);

        element.style.transform = "";

    });

});


// --------------------------------------------------
// 3D CROWN FOLLOWS THE POINTER
// --------------------------------------------------

(function crownParallax() {

    const stage = $("crownStage");

    const tilt = $("crownTilt");

    if (!stage || !tilt || prefersReducedMotion || !finePointer) {
        return;
    }

    document.addEventListener("pointermove", function (event) {

        const rect = stage.getBoundingClientRect();

        const dx = (event.clientX - (rect.left + rect.width / 2)) / window.innerWidth;

        const dy = (event.clientY - (rect.top + rect.height / 2)) / window.innerHeight;

        const clamp = (value, limit) => Math.max(-limit, Math.min(limit, value));

        tilt.style.setProperty("--ry", `${clamp(dx * 38, 18).toFixed(2)}deg`);

        tilt.style.setProperty("--rx", `${clamp(-dy * 34, 16).toFixed(2)}deg`);

    });

})();


// --------------------------------------------------
// AMBIENT GOLD & RED PARTICLES
// --------------------------------------------------

(function ambientParticles() {

    const canvas = $("particles");

    if (!canvas) {
        return;
    }

    const ctx = canvas.getContext("2d");

    const palette = [
        "212,175,55",
        "212,175,55",
        "244,213,122",
        "238,58,85",
        "255,240,184"
    ];

    let width = 0;
    let height = 0;
    let particles = [];
    let rafId = null;


    function spawn(initial) {

        return {

            x: Math.random() * width,

            y: initial ? Math.random() * height : height + 10,

            radius: Math.random() * 2.2 + 0.6,

            speedY: Math.random() * 0.45 + 0.15,

            drift: Math.random() * Math.PI * 2,

            driftSpeed: Math.random() * 0.01 + 0.004,

            alpha: Math.random() * 0.5 + 0.25,

            color: palette[(Math.random() * palette.length) | 0]

        };

    }


    function resize() {

        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        width = window.innerWidth;

        height = window.innerHeight;

        canvas.width = width * dpr;

        canvas.height = height * dpr;

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const count = Math.min(80, Math.round((width * height) / 20000));

        particles = Array.from({ length: count }, function () {
            return spawn(true);
        });

    }


    function draw(animate) {

        ctx.clearRect(0, 0, width, height);

        particles.forEach(function (p) {

            if (animate) {

                p.y -= p.speedY;

                p.drift += p.driftSpeed;

                p.x += Math.sin(p.drift) * 0.35;

                if (p.y < -10) {
                    Object.assign(p, spawn(false));
                }

            }

            const twinkle = 0.6 + 0.4 * Math.sin(p.drift * 3);

            ctx.beginPath();

            ctx.arc(p.x, p.y, p.radius * 3, 0, Math.PI * 2);

            ctx.fillStyle = `rgba(${p.color},${(p.alpha * twinkle * 0.12).toFixed(3)})`;

            ctx.fill();

            ctx.beginPath();

            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

            ctx.fillStyle = `rgba(${p.color},${(p.alpha * twinkle).toFixed(3)})`;

            ctx.fill();

        });

    }


    function loop() {

        draw(true);

        rafId = requestAnimationFrame(loop);

    }


    resize();

    let resizeTimer = null;

    window.addEventListener("resize", function () {

        clearTimeout(resizeTimer);

        resizeTimer = setTimeout(function () {

            resize();

            if (prefersReducedMotion) {
                draw(false);
            }

        }, 150);

    });


    if (prefersReducedMotion) {

        draw(false);

        return;

    }


    loop();


    document.addEventListener("visibilitychange", function () {

        if (document.hidden) {

            cancelAnimationFrame(rafId);

            rafId = null;

        }

        else if (rafId === null) {

            loop();

        }

    });

})();


// --------------------------------------------------
// RESULT BURST (gold confetti for ham, red sparks for spam)
// --------------------------------------------------

const burstCanvas = $("burstCanvas");

const burstCtx = burstCanvas.getContext("2d");

let burstParticles = [];
let burstRunning = false;
let burstWidth = 0;
let burstHeight = 0;

function sizeBurstCanvas() {

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    burstWidth = window.innerWidth;

    burstHeight = window.innerHeight;

    burstCanvas.width = burstWidth * dpr;

    burstCanvas.height = burstHeight * dpr;

    burstCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

}

sizeBurstCanvas();

window.addEventListener("resize", sizeBurstCanvas);


function burst(x, y, kind) {

    if (prefersReducedMotion) {
        return;
    }

    const palettes = {

        spam: ["#c8102e", "#ee3a55", "#7d0b1f", "#ff8a9a"],

        ham: ["#d4af37", "#f4d57a", "#fff0b8", "#9c7a1a"]

    };

    const colors = palettes[kind] || palettes.ham;

    const isSpam = kind === "spam";

    const total = isSpam ? 36 : 56;


    for (let i = 0; i < total; i++) {

        const angle = Math.random() * Math.PI * 2;

        const speed = (isSpam ? 3 : 2) + Math.random() * (isSpam ? 7 : 6);

        burstParticles.push({

            x: x,

            y: y,

            vx: Math.cos(angle) * speed,

            vy: Math.sin(angle) * speed - (isSpam ? 0 : 2),

            size: 3 + Math.random() * 5,

            rotation: Math.random() * Math.PI * 2,

            spin: (Math.random() - 0.5) * 0.4,

            life: 1,

            decay: 0.012 + Math.random() * 0.012,

            color: colors[(Math.random() * colors.length) | 0],

            shape: isSpam ? "spark" : "confetti"

        });

    }

    if (!burstRunning) {

        burstRunning = true;

        requestAnimationFrame(stepBurst);

    }

}


function stepBurst() {

    burstCtx.clearRect(0, 0, burstWidth, burstHeight);

    burstParticles = burstParticles.filter(function (p) {
        return p.life > 0;
    });


    burstParticles.forEach(function (p) {

        p.vx *= 0.985;

        p.vy += 0.14;

        p.x += p.vx;

        p.y += p.vy;

        p.rotation += p.spin;

        p.life -= p.decay;


        burstCtx.save();

        burstCtx.globalAlpha = Math.max(p.life, 0);

        burstCtx.translate(p.x, p.y);

        burstCtx.rotate(p.rotation);

        burstCtx.fillStyle = p.color;


        if (p.shape === "confetti") {

            burstCtx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);

        }

        else {

            burstCtx.beginPath();

            burstCtx.moveTo(0, -p.size);

            burstCtx.lineTo(p.size * 0.4, 0);

            burstCtx.lineTo(0, p.size);

            burstCtx.lineTo(-p.size * 0.4, 0);

            burstCtx.closePath();

            burstCtx.fill();

        }

        burstCtx.restore();

    });


    if (burstParticles.length) {

        requestAnimationFrame(stepBurst);

    }

    else {

        burstRunning = false;

        burstCtx.clearRect(0, 0, burstWidth, burstHeight);

    }

}