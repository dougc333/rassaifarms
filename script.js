const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const year = document.querySelector("#year");
const googleSignIn = document.querySelector("#googleSignIn");
const photoUpload = document.querySelector("#photoUpload");
const photoNote = document.querySelector("#photoNote");
const photoShareForm = document.querySelector("#photoShareForm");
const shareStatus = document.querySelector("#shareStatus");
const previewGrid = document.querySelector("#previewGrid");
const uploadDropzone = document.querySelector(".upload-dropzone");

if (year) {
  year.textContent = new Date().getFullYear();
}

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  siteNav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      siteNav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
}

function enablePhotoSharing() {
  if (!photoUpload || !photoNote || !photoShareForm || !shareStatus || !uploadDropzone) {
    return;
  }

  photoUpload.disabled = false;
  photoNote.disabled = false;
  photoShareForm.querySelector("button[type='submit']").disabled = false;
  uploadDropzone.classList.remove("is-disabled");
  shareStatus.textContent = "Signed in locally. Choose photos for David's review.";
}

function renderPreviews(files) {
  if (!previewGrid) {
    return;
  }

  previewGrid.innerHTML = "";
  Array.from(files).slice(0, 8).forEach((file) => {
    const card = document.createElement("article");
    card.className = "preview-card";

    const image = document.createElement("img");
    image.src = URL.createObjectURL(file);
    image.alt = `Preview of ${file.name}`;
    image.addEventListener("load", () => URL.revokeObjectURL(image.src), { once: true });

    const label = document.createElement("p");
    label.textContent = file.name;

    card.append(image, label);
    previewGrid.append(card);
  });
}

if (uploadDropzone) {
  uploadDropzone.classList.toggle("is-disabled", photoUpload?.disabled ?? true);
}

googleSignIn?.addEventListener("click", enablePhotoSharing);

photoUpload?.addEventListener("change", (event) => {
  renderPreviews(event.target.files || []);
  if (shareStatus && event.target.files?.length) {
    shareStatus.textContent = `${event.target.files.length} photo${event.target.files.length === 1 ? "" : "s"} ready to send for review.`;
  }
});

photoShareForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (shareStatus) {
    shareStatus.textContent = "Photo sharing preview complete. Connect Google login and storage to send these to David.";
  }
});
