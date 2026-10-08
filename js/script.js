"use strict";

/* Validates the local contact form and shows a preview without sending data. */
const contactForm = document.querySelector("#contact-form");
const formFeedback = document.querySelector("#form-feedback");

if (contactForm && formFeedback) {
    contactForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const nameInput = document.querySelector("#name");
        const emailInput = document.querySelector("#email");
        const messageInput = document.querySelector("#message");

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const message = messageInput.value.trim();

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        formFeedback.className = "form-feedback";

        if (name === "") {
            formFeedback.textContent =
                "Please enter your name. Names containing only spaces are not accepted.";

            formFeedback.classList.add("form-error");
            nameInput.focus();
            return;
        }

        if (!emailPattern.test(email)) {
            formFeedback.textContent =
                "Please enter a valid email address.";

            formFeedback.classList.add("form-error");
            emailInput.focus();
            return;
        }

        if (message === "") {
            formFeedback.textContent =
                "Please enter a message. Messages containing only spaces are not accepted.";

            formFeedback.classList.add("form-error");
            messageInput.focus();
            return;
        }

        formFeedback.textContent =
            `Your data was validated successfully. `
            + `Name: ${name}. `
            + `Email: ${email}. `
            + `This is a local preview only; no message was sent.`;

        formFeedback.classList.add("form-success");

        contactForm.reset();
    });
}


/* Opens and closes additional information for each project card. */
const detailButtons = document.querySelectorAll(".details-button");

detailButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        const details = button.nextElementSibling;
        const isHidden = details.hasAttribute("hidden");

        if (isHidden) {
            details.removeAttribute("hidden");
            button.textContent = "Hide details";
            button.setAttribute("aria-expanded", "true");
        } else {
            details.setAttribute("hidden", "");
            button.textContent = "Show details";
            button.setAttribute("aria-expanded", "false");
        }
    });
});


/* Displays one gallery photo at a time and handles first/last boundaries. */
const galleryItems = document.querySelectorAll(".gallery-item");
const previousPhotoButton = document.querySelector("#previous-photo");
const nextPhotoButton = document.querySelector("#next-photo");
const galleryStatus = document.querySelector("#gallery-status");

let currentPhotoIndex = 0;

function displayPhoto(index) {
    galleryItems.forEach(function (item, itemIndex) {
        item.hidden = itemIndex !== index;
    });

    if (galleryStatus) {
        galleryStatus.textContent =
            `Showing photo ${index + 1} of ${galleryItems.length}.`;
    }

    if (previousPhotoButton) {
        previousPhotoButton.disabled = index === 0;
    }

    if (nextPhotoButton) {
        nextPhotoButton.disabled =
            index === galleryItems.length - 1;
    }
}

if (galleryItems.length > 0) {
    displayPhoto(currentPhotoIndex);

    if (previousPhotoButton) {
        previousPhotoButton.addEventListener("click", function () {
            if (currentPhotoIndex > 0) {
                currentPhotoIndex -= 1;
                displayPhoto(currentPhotoIndex);
            }
        });
    }

    if (nextPhotoButton) {
        nextPhotoButton.addEventListener("click", function () {
            if (currentPhotoIndex < galleryItems.length - 1) {
                currentPhotoIndex += 1;
                displayPhoto(currentPhotoIndex);
            }
        });
    }
}


/* Switches between readable light and dark colour themes. */
const themeToggle = document.querySelector("#theme-toggle");

if (themeToggle) {
    themeToggle.addEventListener("click", function () {
        const darkModeEnabled =
            document.body.classList.toggle("dark-theme");

        themeToggle.textContent = darkModeEnabled
            ? "Light mode"
            : "Dark mode";

        themeToggle.setAttribute(
            "aria-pressed",
            String(darkModeEnabled)
        );
    });
}