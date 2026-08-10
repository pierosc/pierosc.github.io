

//COVER

const topmenu = document.getElementById("top-nav-menu");
const topoptions = document.getElementById("top-nav-options");
var navstatus = 0;

topmenu.addEventListener("click", () =>{
  if (navstatus ==0 ){
  topoptions.style.display = "flex";
  setTimeout(() => {
    topoptions.style.transform = "scaleY(1)";
  }, 50); 
  navstatus=1;
  }
  else{
    topoptions.style.transform = "scaleY(0)";
    setTimeout(() => {
      topoptions.style.display = "none";
    }, 100);
    navstatus = 0;
  }
})
//COVER TYPING
var typed = new Typed(".typing", {
  strings: ["Programmer", "Mechatronic", "Developer","Musician", "Techies player"],
  typeSpeed: 100,
  backSpeed: 60,
  loop: true
});

//HEADER NAV//
const about = document.getElementById("aboutme");
const project = document.getElementById("project");
const certificates = document.getElementById("certificate");
const social = document.getElementById("social");
//sections
const aboutsection = document.getElementById("nombre");
const projectsection = document.getElementById("projects");
const certificatesection = document.getElementById("cert-title");
const socialsection = document.getElementById("footer");

about.addEventListener("click", () =>{
  let scrollpos = document.documentElement.scrollTop;
  var inicioabout = scrollpos + aboutsection.getBoundingClientRect().top - 69;
  scroll(0,inicioabout);
});

project.addEventListener("click", () =>{
  let scrollpos = document.documentElement.scrollTop;
  var inicioproject = scrollpos + projectsection.getBoundingClientRect().top - 69;
  scroll(0,inicioproject);
});

certificates.addEventListener("click", () =>{
  let scrollpos = document.documentElement.scrollTop;
  var iniciocertificate = scrollpos + certificatesection.getBoundingClientRect().top - 69;
  scroll(0,iniciocertificate);

});  

social.addEventListener("click", () =>{
  let scrollpos = document.documentElement.scrollTop;
  var iniciosocial = scrollpos + socialsection.getBoundingClientRect().top - 69;
  scroll(0, iniciosocial);
});







//PROJECT GALLERY//
const projectTrack = document.getElementById("project-track");
const projectCards = Array.from(document.querySelectorAll(".project-card"));
const projectFilters = Array.from(document.querySelectorAll(".project-filter"));
const previousProject = document.querySelector(".project-nav--previous");
const nextProject = document.querySelector(".project-nav--next");
const currentProject = document.getElementById("project-current");
const totalProjects = document.getElementById("project-total");
const projectStatus = document.getElementById("project-status");

const visibleProjectCards = () => projectCards.filter((card) => !card.hidden);

const updateProjectNavigation = () => {
  const visibleCards = visibleProjectCards();
  const maxScroll = Math.max(0, projectTrack.scrollWidth - projectTrack.clientWidth);
  const firstCard = visibleCards[0];
  const gap = parseFloat(getComputedStyle(projectTrack).columnGap) || 24;
  const step = firstCard ? firstCard.getBoundingClientRect().width + gap : 1;
  const position = Math.min(visibleCards.length, Math.round(projectTrack.scrollLeft / step) + 1);

  currentProject.textContent = String(position || 0).padStart(2, "0");
  totalProjects.textContent = String(visibleCards.length).padStart(2, "0");
  previousProject.disabled = projectTrack.scrollLeft <= 2;
  nextProject.disabled = projectTrack.scrollLeft >= maxScroll - 2 || maxScroll === 0;
};

const scrollProjects = (direction) => {
  const firstCard = visibleProjectCards()[0];
  if (!firstCard) return;

  const gap = parseFloat(getComputedStyle(projectTrack).columnGap) || 24;
  projectTrack.scrollBy({
    left: direction * (firstCard.getBoundingClientRect().width + gap),
    behavior: "smooth",
  });
};

projectFilters.forEach((filterButton) => {
  filterButton.addEventListener("click", () => {
    const selectedFilter = filterButton.dataset.projectFilter;

    projectFilters.forEach((button) => {
      const isActive = button === filterButton;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    projectCards.forEach((card) => {
      card.hidden = selectedFilter !== "all" && card.dataset.projectCategory !== selectedFilter;
    });

    const label = filterButton.textContent.trim();
    projectStatus.textContent = selectedFilter === "all" ? "Showing all projects" : `Showing ${label} projects`;
    projectTrack.scrollTo({ left: 0, behavior: "smooth" });
    requestAnimationFrame(updateProjectNavigation);
  });
});

previousProject.addEventListener("click", () => scrollProjects(-1));
nextProject.addEventListener("click", () => scrollProjects(1));
projectTrack.addEventListener("scroll", updateProjectNavigation, { passive: true });
window.addEventListener("resize", updateProjectNavigation);

projectTrack.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
    event.preventDefault();
    scrollProjects(event.key === "ArrowLeft" ? -1 : 1);
  }
});

let isProjectDragging = false;
let projectDragStart = 0;
let projectScrollStart = 0;

projectTrack.addEventListener("pointerdown", (event) => {
  if (event.pointerType !== "mouse" || event.button !== 0) return;
  isProjectDragging = true;
  projectDragStart = event.clientX;
  projectScrollStart = projectTrack.scrollLeft;
  projectTrack.classList.add("is-dragging");
  projectTrack.setPointerCapture(event.pointerId);
});

projectTrack.addEventListener("pointermove", (event) => {
  if (!isProjectDragging) return;
  projectTrack.scrollLeft = projectScrollStart - (event.clientX - projectDragStart);
});

const stopProjectDragging = (event) => {
  if (!isProjectDragging) return;
  isProjectDragging = false;
  projectTrack.classList.remove("is-dragging");
  if (projectTrack.hasPointerCapture(event.pointerId)) projectTrack.releasePointerCapture(event.pointerId);
  updateProjectNavigation();
};

projectTrack.addEventListener("pointerup", stopProjectDragging);
projectTrack.addEventListener("pointercancel", stopProjectDragging);
updateProjectNavigation();




//CERTIFICATES
VanillaTilt.init(document.querySelectorAll(".cert-img .img-box"), {
  max: 25,
  speed: 400,
  glare:true,
  "max-glare":1,
});

var footerstatus = 0;
//ASIDE NAV ANIMATIONS//
window.onscroll = () => {
    let scroll = document.documentElement.scrollTop;
    if (scroll > 500) {
      document.getElementById("dropdwn").style.transform = "scale(1)";
      
      //console.log(scrollY);
    } else {
      document.getElementById("dropdwn").style.transform = "scale(0)";
    };
    
    //NAVTOP
    let inicioabout = scroll + aboutsection.getBoundingClientRect().top - 70;
    let inicioproject = scroll + projectsection.getBoundingClientRect().top - 70;
    let iniciocertificate = scroll + certificatesection.getBoundingClientRect().top - 70;
    let iniciosocial = scroll + socialsection.getBoundingClientRect().top - 70;

    if (scroll>=inicioabout && scroll< inicioproject){
      about.className="nav_active";
      project.className="nav";
      certificates.className="nav";
      social.className="nav";
    };
    if (scroll>=inicioproject && scroll< iniciocertificate){

      about.className="nav";
      project.className="nav_active";
      certificates.className="nav";
      social.className="nav";
    };
    if (scroll>=iniciocertificate && scroll< iniciosocial){

      about.className="nav";
      project.className="nav";
      certificates.className="nav_active";
      social.className="nav";
    };
    if (scroll>=iniciosocial){
      about.className="nav";
      project.className="nav";
      certificates.className="nav";
      social.className="nav_active";
    };
    //Footer
    const footertop = document.querySelector(".top-footer");
    const right = document.querySelector(".right");
    const left = document.querySelector(".left");
    const footercircle = document.querySelector(".footer-circle");
    const footermenu = document.querySelector(".footer-menu");
    const footerinner = document.querySelector(".footer-innermenu");
    

    
    if (scroll>=iniciosocial+120){
      footercircle.style.display = "block";
      footermenu.style.display = "block";
      right.style.animation = "tuercaright 1s normal both";
      left.style.animation = "tuercaleft 1s normal both";
      footercircle.style.animation = "footercircle 1s 1s normal both";
      footermenu.style.animation = "footermenu 1s 1s normal both";
      footerinner.style.animation = "footerinner 1s 1s normal both";
      document.getElementById("dropdwn").style.animation = "asidebot 1s linear normal both";
      console.log(footermenu);

      footerstatus = 1;
    };

    if (scroll<iniciosocial+120 && footerstatus == 1){
      right.style.animation = "tuercarightr 1s normal both";
      left.style.animation = "tuercaleftr 1s normal both";
      footercircle.style.animation = "footercircler 1s normal both";
      footermenu.style.animation = "footermenur 1s normal both";
      footerinner.style.animation = "footerinnerr 1s normal both";
      document.getElementById("dropdwn").style.animation = "asidebotr 1s 1s normal both";
    };


};
//Aparición de las opciones//
const navspan = document.getElementById("span");
const navicon = document.getElementById("drop-icon");
const drpbtn = document.querySelector(".dropbtn");
let asidenavstatus = 0;

drpbtn.addEventListener("click", () => {
  if(asidenavstatus == 0){
  navspan.style.transform = "scaleY(1)";
  navicon.style.transform = "rotate(135deg)";
  drpbtn.style.animation = "corner 0.15s normal both";
  asidenavstatus =1;
  }
  else {
    navspan.style.transform = "scaleY(0)";
    navicon.style.transform = "rotate(0deg)";
    drpbtn.style.animation = "corner-reverse 0.15s normal 0.3s both";
    asidenavstatus=0;
  };

});




window.onload = () => {
    // SHOW ASIDE NAV
    document.getElementById("dropdwn").style.transform = "scale(0)";
    navspan.style.transform = "scaleY(0)";
    //LOADER ANIMATION
   /* document.getElementById("loading").style.opacity = "0";
    document.getElementById("loading").style.visibility = "hidden";*/
    document.body.style.overflowY = "auto";
   // window.scrollTo(0, 0);
};


//Footer




//SCROLLREVEAL
//knowledge
ScrollReveal().reveal('.knowledge h1', {delay: 500});
ScrollReveal().reveal('.knowledge h2', {delay: 500});
ScrollReveal().reveal('.about-me .icons .icon-box', { interval: 200, reset: true });
//projects
ScrollReveal().reveal('.projects-header', {delay: 250});
ScrollReveal().reveal('.project-filter', {interval: 90});
ScrollReveal().reveal('.project-card', {interval: 120});
//certificates
//ScrollReveal().reveal('.certificates', {delay: 500});
