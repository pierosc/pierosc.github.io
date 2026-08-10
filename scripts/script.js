const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Hero typing
if (window.Typed && document.querySelector(".typing")) {
  new Typed(".typing", {
    strings: ["a software developer", "a frontend developer", "an interactive UI builder", "a creative coder"],
    typeSpeed: reducedMotion ? 0 : 62,
    backSpeed: reducedMotion ? 0 : 34,
    backDelay: 1500,
    loop: !reducedMotion,
    showCursor: true,
  });
}

// Mobile navigation
const menuButton = document.getElementById("top-nav-menu");
const navOptions = document.getElementById("top-nav-options");
const navLinks = Array.from(document.querySelectorAll(".nav-link"));

const setMenuState = (open) => {
  navOptions?.classList.toggle("is-open", open);
  menuButton?.setAttribute("aria-expanded", String(open));
  document.body.classList.toggle("menu-open", open && window.innerWidth <= 900);
};

menuButton?.addEventListener("click", () => setMenuState(!navOptions.classList.contains("is-open")));
navLinks.forEach((link) => link.addEventListener("click", () => setMenuState(false)));
window.addEventListener("resize", () => {
  if (window.innerWidth > 900) setMenuState(false);
});

// Section reveals and active navigation
const revealItems = document.querySelectorAll(".reveal, .icons");
if (reducedMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.14, rootMargin: "0px 0px -45px" });
  revealItems.forEach((item) => revealObserver.observe(item));
}

const sectionLinks = new Map([
  [document.getElementById("knowledge"), document.getElementById("aboutme")],
  [document.getElementById("projects"), document.getElementById("project")],
  [document.getElementById("certificates"), document.getElementById("certificate")],
  [document.getElementById("footer"), document.getElementById("social")],
]);

const activeSectionObserver = new IntersectionObserver((entries) => {
  const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (!visible) return;
  navLinks.forEach((link) => link.classList.remove("is-active"));
  sectionLinks.get(visible.target)?.classList.add("is-active");
}, { rootMargin: "-25% 0px -55%", threshold: [0, 0.1, 0.3] });

sectionLinks.forEach((link, section) => {
  if (section) activeSectionObserver.observe(section);
});

// Project carousel
const projectTrack = document.getElementById("project-track");
const projectCards = Array.from(document.querySelectorAll(".project-card"));
const projectFilters = Array.from(document.querySelectorAll(".project-filter"));
const previousProject = document.querySelector(".project-nav--previous");
const nextProject = document.querySelector(".project-nav--next");
const currentProject = document.getElementById("project-current");
const totalProjects = document.getElementById("project-total");
const projectStatus = document.getElementById("project-status");

const visibleProjectCards = () => projectCards.filter((card) => !card.hidden);

const projectStep = () => {
  const firstCard = visibleProjectCards()[0];
  const gap = projectTrack ? parseFloat(getComputedStyle(projectTrack).columnGap) || 18 : 18;
  return firstCard ? firstCard.getBoundingClientRect().width + gap : 1;
};

const updateProjectNavigation = () => {
  if (!projectTrack) return;
  const cards = visibleProjectCards();
  const maxScroll = Math.max(0, projectTrack.scrollWidth - projectTrack.clientWidth);
  const position = Math.min(cards.length, Math.round(projectTrack.scrollLeft / projectStep()) + 1);
  if (currentProject) currentProject.textContent = String(position || 0).padStart(2, "0");
  if (totalProjects) totalProjects.textContent = String(cards.length).padStart(2, "0");
  if (previousProject) previousProject.disabled = projectTrack.scrollLeft <= 2;
  if (nextProject) nextProject.disabled = projectTrack.scrollLeft >= maxScroll - 2 || maxScroll === 0;
};

const scrollProjects = (direction) => projectTrack?.scrollBy({ left: direction * projectStep(), behavior: reducedMotion ? "auto" : "smooth" });

projectFilters.forEach((filterButton) => {
  filterButton.addEventListener("click", () => {
    const selectedFilter = filterButton.dataset.projectFilter;
    projectFilters.forEach((button) => {
      const active = button === filterButton;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    projectCards.forEach((card) => {
      card.hidden = selectedFilter !== "all" && card.dataset.projectCategory !== selectedFilter;
    });
    const label = filterButton.textContent.trim();
    if (projectStatus) projectStatus.textContent = selectedFilter === "all" ? "Showing all projects" : `Showing ${label} projects`;
    projectTrack?.scrollTo({ left: 0, behavior: reducedMotion ? "auto" : "smooth" });
    requestAnimationFrame(updateProjectNavigation);
  });
});

previousProject?.addEventListener("click", () => scrollProjects(-1));
nextProject?.addEventListener("click", () => scrollProjects(1));
projectTrack?.addEventListener("scroll", updateProjectNavigation, { passive: true });
window.addEventListener("resize", updateProjectNavigation);

projectTrack?.addEventListener("keydown", (event) => {
  if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
  event.preventDefault();
  scrollProjects(event.key === "ArrowLeft" ? -1 : 1);
});

let isProjectDragging = false;
let projectDragStart = 0;
let projectScrollStart = 0;

projectTrack?.addEventListener("pointerdown", (event) => {
  if (event.pointerType !== "mouse" || event.button !== 0) return;
  isProjectDragging = true;
  projectDragStart = event.clientX;
  projectScrollStart = projectTrack.scrollLeft;
  projectTrack.classList.add("is-dragging");
  projectTrack.setPointerCapture(event.pointerId);
});

projectTrack?.addEventListener("pointermove", (event) => {
  if (isProjectDragging) projectTrack.scrollLeft = projectScrollStart - (event.clientX - projectDragStart);
});

const stopProjectDragging = (event) => {
  if (!isProjectDragging || !projectTrack) return;
  isProjectDragging = false;
  projectTrack.classList.remove("is-dragging");
  if (projectTrack.hasPointerCapture(event.pointerId)) projectTrack.releasePointerCapture(event.pointerId);
  updateProjectNavigation();
};

projectTrack?.addEventListener("pointerup", stopProjectDragging);
projectTrack?.addEventListener("pointercancel", stopProjectDragging);
updateProjectNavigation();

// Compact social dock
const socialDock = document.getElementById("dropdwn");
const socialButton = socialDock?.querySelector(".dropbtn");
const setSocialState = (open) => {
  socialDock?.classList.toggle("is-open", open);
  socialButton?.setAttribute("aria-expanded", String(open));
  socialButton?.setAttribute("aria-label", open ? "Close social links" : "Open social links");
};

socialButton?.addEventListener("click", () => setSocialState(!socialDock.classList.contains("is-open")));
document.addEventListener("click", (event) => {
  if (socialDock && !socialDock.contains(event.target)) setSocialState(false);
});

const footer = document.getElementById("footer");
const updateFloatingDock = () => {
  const footerIsNear = footer && footer.getBoundingClientRect().top < window.innerHeight * 0.82;
  socialDock?.classList.toggle("is-visible", window.scrollY > window.innerHeight * 0.55 && !footerIsNear);
  if (footerIsNear) setSocialState(false);
};
window.addEventListener("scroll", updateFloatingDock, { passive: true });
updateFloatingDock();

const year = document.getElementById("current-year");
if (year) year.textContent = new Date().getFullYear();
