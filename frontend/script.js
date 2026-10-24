
let events = [
    {
        id: 1,
        title: "Build the Future: AI Meetup",
        category: "Technology",
        date: "NOV 08, 2026",
        time: "10:00 AM",
        venue: "Innovation Hub",
        city: "Mumbai",
        price: "Free",
        desc: "Meet curious minds, explore practical AI ideas, and connect with people building what comes next.",
        symbol: "⌘",
        cover: "tech"
    },
    {
        id: 2,
        title: "The Art of Seeing",
        category: "Art & Design",
        date: "NOV 12, 2026",
        time: "2:00 PM",
        venue: "The Creative Studio",
        city: "Mumbai",
        price: "₹299",
        desc: "A hands-on creative session exploring visual storytelling and new ways to see everyday life.",
        symbol: "✳",
        cover: "artcover"
    },
    {
        id: 3,
        title: "Afterglow: Live Sessions",
        category: "Music",
        date: "NOV 15, 2026",
        time: "6:30 PM",
        venue: "Harbour Stage",
        city: "Navi Mumbai",
        price: "₹499",
        desc: "An intimate evening of independent music, emerging artists, and new sounds.",
        symbol: "♫",
        cover: "music"
    },
    {
        id: 4,
        title: "People Who Make Things",
        category: "Community",
        date: "NOV 18, 2026",
        time: "11:00 AM",
        venue: "Common Ground",
        city: "Panvel",
        price: "Free",
        desc: "A welcoming meetup for makers, students, creators, and anyone with an idea to share.",
        symbol: "◎",
        cover: "community"
    },
    {
        id: 5,
        title: "Slow Sunday: Reset & Create",
        category: "Community",
        date: "NOV 22, 2026",
        time: "9:00 AM",
        venue: "The Green Room",
        city: "Navi Mumbai",
        price: "₹199",
        desc: "A slower morning with creative prompts, reflection, and thoughtful conversations.",
        symbol: "☼",
        cover: "wellness"
    },
    {
        id: 6,
        title: "Pitch Night: Ideas in Motion",
        category: "Technology",
        date: "NOV 27, 2026",
        time: "4:00 PM",
        venue: "Launchpad Workspace",
        city: "Mumbai",
        price: "Free",
        desc: "Watch early-stage ideas take shape and meet ambitious builders.",
        symbol: "↗",
        cover: "business"
    }
];

const API_URL = "http://127.0.0.1:5000/api/events";
const $ = selector => document.querySelector(selector);

let category = "All";
let toastTimer;

function saved() {
    try {
        return JSON.parse(localStorage.getItem("eventora-saved") || "[]");
    } catch {
        return [];
    }
}

function toast(message) {
    const toastElement = $("#toast");
    if (!toastElement) return;

    toastElement.textContent = message;
    toastElement.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
        toastElement.classList.remove("show");
    }, 2300);
}

function formatDate(dateString) {
    if (!dateString) return "DATE TBA";

    // Preserve dates already formatted by the frontend.
    if (/^[A-Z]{3}\s+\d{2},\s+\d{4}$/i.test(dateString)) {
        return dateString.toUpperCase();
    }

    const date = new Date(dateString + "T00:00:00");

    if (Number.isNaN(date.getTime())) {
        return dateString;
    }

    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric"
    }).toUpperCase();
}

async function loadEvents() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("API returned status " + response.status);
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
            throw new Error("Invalid event data received");
        }

        const backendEvents = data.map((event, index) => ({
            id: Number(event.id),
            title: event.title || "Untitled Event",
            category: event.category || "Community",
            date: formatDate(event.date),
            time: event.time || "Time TBA",
            venue: event.venue || event.location || "Location TBA",
            city: event.city || event.location || "Location TBA",
            price: event.price || "Free",
            desc: event.desc || event.description || "",
            symbol: event.symbol || ["⌘", "✳", "♫"][index % 3],
            cover: event.cover ||
                (event.category === "Hackathon" ? "business" : "tech")
        }));

        // Only replace the demo events after a successful API response.
        events = backendEvents;

        render();

        console.log("EVENTORA: Events loaded successfully from Flask.");

    } catch (error) {
        console.warn(
            "EVENTORA: Backend unavailable. Showing demo events.",
            error
        );

        toast("Showing demo events. Backend unavailable.");
        // Existing demo events remain available if Flask is offline.
    }
}

function render() {
    const searchInput = $("#search");
    const eventContainer = $("#events");
    const emptyState = $("#empty");
    const countElement = $("#count");

    if (!eventContainer || !searchInput) return;

    const query = searchInput.value.trim().toLowerCase();
    const savedIds = saved();

    const filteredEvents = events.filter(event => {
        const matchesCategory =
            category === "All" || event.category === category;

        const searchableText = [
            event.title,
            event.venue,
            event.city,
            event.desc,
            event.category
        ].join(" ").toLowerCase();

        return matchesCategory && searchableText.includes(query);
    });

    eventContainer.innerHTML = filteredEvents.map(event => {
        const isSaved = savedIds.includes(event.id);

        return `
            <article class="event">
                <div class="cover ${event.cover}">
                    <span class="tag">
                        ${event.category.toUpperCase()}
                    </span>

                    <button
                        class="save ${isSaved ? "saved" : ""}"
                        data-save="${event.id}"
                        aria-label="Save ${event.title}"
                    >${isSaved ? "♥" : "♡"}</button>

                    <span class="symbol">${event.symbol}</span>
                </div>

                <div class="event-body">
                    <div class="meta">
                        ${event.date} &nbsp; • &nbsp; ${event.time}
                    </div>

                    <h3>${event.title}</h3>
                    <p>${event.desc}</p>

                    <div class="event-bottom">
                        <span>⌖ ${event.city}</span>
                        <strong>${event.price}</strong>

                        <button class="details" data-open="${event.id}">
                            Details ↗
                        </button>
                    </div>
                </div>
            </article>
        `;
    }).join("");

    if (emptyState) {
        emptyState.classList.toggle("hidden", filteredEvents.length > 0);
    }

    if (countElement) {
        countElement.textContent =
            String(filteredEvents.length).padStart(2, "0") +
            " EXPERIENCES";
    }
}

function openEvent(id) {
    const event = events.find(item => item.id === Number(id));

    if (!event) return;

    const modalBody = $("#modal-body");
    const modal = $("#modal");

    if (!modalBody || !modal) return;

    modalBody.innerHTML = `
        <span class="modal-cat">
            ${event.category.toUpperCase()} · EVENT PREVIEW
        </span>

        <h2 class="modal-title">${event.title}</h2>
        <p class="modal-desc">${event.desc}</p>

        <div class="modal-info">
            <span>◷ &nbsp;${event.date} · ${event.time}</span>
            <span>⌖ &nbsp;${event.venue}, ${event.city}</span>
            <span>✦ &nbsp;${event.price}</span>
        </div>

        <button
            class="primary"
            data-register="${event.id}"
            style="border:0;color:white;cursor:pointer;margin-top:18px"
        >
            Register interest ↗
        </button>

        <p class="modal-note">
            Demo only: this saves your interest in this browser.
            It is not a confirmed booking.
        </p>
    `;

    if (typeof modal.showModal === "function") {
        modal.showModal();
    }
}

// Category filters
const filterContainer = $("#filters");

if (filterContainer) {
    filterContainer.addEventListener("click", event => {
        const button = event.target.closest("[data-cat]");

        if (!button) return;

        category = button.dataset.cat;

        document.querySelectorAll("[data-cat]").forEach(item => {
            item.classList.toggle("active", item === button);
        });

        render();
    });
}

// Search
if ($("#search")) {
    $("#search").addEventListener("input", render);
}

// Save events and open event details
const eventContainer = $("#events");

if (eventContainer) {
    eventContainer.addEventListener("click", event => {
        const saveButton = event.target.closest("[data-save]");
        const openButton = event.target.closest("[data-open]");

        if (saveButton) {
            let ids = saved();
            const id = Number(saveButton.dataset.save);

            ids = ids.includes(id)
                ? ids.filter(savedId => savedId !== id)
                : [...ids, id];

            localStorage.setItem("eventora-saved", JSON.stringify(ids));

            toast(
                ids.includes(id)
                    ? "Event saved for later"
                    : "Removed from saved events"
            );

            render();
        }

        if (openButton) {
            openEvent(openButton.dataset.open);
        }
    });
}

// Demo registration interest
const modalBody = $("#modal-body");

if (modalBody) {
    modalBody.addEventListener("click", event => {
        const button = event.target.closest("[data-register]");

        if (!button) return;

        let ids = [];

        try {
            ids = JSON.parse(
                localStorage.getItem("eventora-interest") || "[]"
            );
        } catch {
            ids = [];
        }

        const id = Number(button.dataset.register);

        if (!ids.includes(id)) {
            ids.push(id);
        }

        localStorage.setItem("eventora-interest", JSON.stringify(ids));

        if ($("#modal")) {
            $("#modal").close();
        }

        toast("Interest saved! Registration is still demo-only.");
    });
}

// Close event details
if ($("#close") && $("#modal")) {
    $("#close").addEventListener("click", () => {
        $("#modal").close();
    });
}

// Footer year
if ($("#year")) {
    $("#year").textContent = new Date().getFullYear();
}

// Render immediately, then load backend events.
render();
loadEvents();
