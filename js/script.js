"use strict";

/* Theme preference persists across visits. */
const themeToggle = document.querySelector("#theme-toggle");
const savedTheme = localStorage.getItem("trek-portfolio-theme");
if (savedTheme === "dark") document.body.classList.add("dark-theme");
function syncThemeButton() {
  if (!themeToggle) return;
  const dark = document.body.classList.contains("dark-theme");
  themeToggle.textContent = dark ? "Light mode" : "Dark mode";
  themeToggle.setAttribute("aria-pressed", String(dark));
}
syncThemeButton();
themeToggle?.addEventListener("click", () => {
  const dark = document.body.classList.toggle("dark-theme");
  localStorage.setItem("trek-portfolio-theme", dark ? "dark" : "light");
  syncThemeButton();
});

/* Typing headline: decorative only; reduced-motion users see a static title. */
const titleNode = document.querySelector("#typed-title");
const titles = ["Computer Science Student", "Aspiring Software Engineer", "AI Enthusiast"];
if (titleNode && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  let titleIndex = 0, charIndex = titles[0].length, deleting = true;
  const typeNext = () => {
    const current = titles[titleIndex];
    charIndex += deleting ? -1 : 1;
    titleNode.textContent = current.slice(0, charIndex);
    let delay = deleting ? 55 : 95;
    if (!deleting && charIndex === current.length) { deleting = true; delay = 1500; }
    else if (deleting && charIndex === 0) { deleting = false; titleIndex = (titleIndex + 1) % titles.length; delay = 350; }
    window.setTimeout(typeNext, delay);
  };
  window.setTimeout(typeNext, 1800);
}

/* One-at-a-time photo gallery with safe boundary handling. */
const galleryItems = [...document.querySelectorAll(".gallery-item")];
const previousPhotoButton = document.querySelector("#previous-photo");
const nextPhotoButton = document.querySelector("#next-photo");
const galleryStatus = document.querySelector("#gallery-status");
let currentPhotoIndex = 0;
function displayPhoto(index) {
  galleryItems.forEach((item, itemIndex) => { item.hidden = itemIndex !== index; });
  if (galleryStatus) galleryStatus.textContent = `Showing photo ${index + 1} of ${galleryItems.length}.`;
  if (previousPhotoButton) previousPhotoButton.disabled = index === 0;
  if (nextPhotoButton) nextPhotoButton.disabled = index === galleryItems.length - 1;
}
if (galleryItems.length) {
  displayPhoto(0);
  previousPhotoButton?.addEventListener("click", () => { if (currentPhotoIndex > 0) displayPhoto(--currentPhotoIndex); });
  nextPhotoButton?.addEventListener("click", () => { if (currentPhotoIndex < galleryItems.length - 1) displayPhoto(++currentPhotoIndex); });
}

/* Public GitHub API only: no personal access token or secret in the browser. */
const githubStatus = document.querySelector("#github-status");
const githubStats = document.querySelector("#github-stats");
const githubRepositories = document.querySelector("#github-repositories");
const escapeHTML = (value) => String(value ?? "").replace(/[&<>"']/g, char => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
}[char]));
async function loadGitHubProfile() {
  if (!githubStatus || !githubStats || !githubRepositories) return;
  try {
    const headers = { Accept: "application/vnd.github+json" };
    const [profileResponse, reposResponse] = await Promise.all([
      fetch("https://api.github.com/users/2007Trek", { headers }),
      fetch("https://api.github.com/users/2007Trek/repos?sort=updated&per_page=6&type=owner", { headers })
    ]);
    if (!profileResponse.ok || !reposResponse.ok) throw new Error("GitHub public API is temporarily unavailable.");
    const profile = await profileResponse.json();
    const repos = await reposResponse.json();
    githubStats.innerHTML = [
      ["Public repositories", profile.public_repos],
      ["Followers", profile.followers],
      ["Following", profile.following]
    ].map(([label, value]) => `<div class="stat-card"><strong>${Number(value).toLocaleString()}</strong><span>${escapeHTML(label)}</span></div>`).join("");
    githubRepositories.innerHTML = repos.slice(0, 6).map(repo => `
      <article class="repo-card">
        <h3><a href="${escapeHTML(repo.html_url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(repo.name)} ↗</a></h3>
        <p>${escapeHTML(repo.description || "No public description provided.")}</p>
        <div class="repo-meta"><span>${escapeHTML(repo.language || "Language not specified")}</span><span>★ ${Number(repo.stargazers_count).toLocaleString()}</span><span>Updated ${new Date(repo.updated_at).toLocaleDateString()}</span></div>
      </article>`).join("") || "<p>No public repositories were returned.</p>";
    githubStatus.textContent = "Public profile data loaded successfully.";
  } catch (error) {
    githubStatus.textContent = error.message + " Visit the GitHub profile directly to see current activity.";
    githubRepositories.innerHTML = '<a class="text-link" href="https://github.com/2007Trek?tab=repositories" target="_blank" rel="noopener noreferrer">Browse repositories on GitHub ↗</a>';
  }
}
loadGitHubProfile();

/* Footer year stays current. */
const yearNode = document.querySelector("#current-year");
if (yearNode) yearNode.textContent = new Date().getFullYear();
