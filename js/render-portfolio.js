// Portfolio Data Renderer
class PortfolioRenderer {
  constructor() {
    this.portfolioData = null;
  }

  async loadData() {
    try {
      const response = await fetch("js/portfolio-data.json");
      this.portfolioData = await response.json();
      this.renderPortfolio();
    } catch (error) {
      console.error("Error loading portfolio data:", error);
    }
  }

  renderPortfolio() {
    if (!this.portfolioData) return;

    this.renderNavigation();
    this.renderHero();
    this.renderProjects();
    this.renderExperience();
    this.renderSkills();
    this.renderStory();
    this.renderContact();
    this.updatePageTitle();

    // Reinitialize experience tabs functionality after rendering
    this.initializeExperienceTabs();
  }

  renderNavigation() {
    const nav = document.querySelector("nav");
    if (!nav) return;

    // Update logo
    const logo = nav.querySelector(".logo");
    if (logo) {
      logo.innerHTML = `${this.portfolioData.personal.name}<span style="color: #6e06f2;">.</span>`;
    }

    // Update navigation links
    const navLinks = nav.querySelector(".nav-links");
    if (navLinks) {
      navLinks.innerHTML = this.portfolioData.navigation.links
        .map((link) => `<li><a href="${link.href}">${link.text}</a></li>`)
        .join("");
    }

    // Update contact button
    const contactBtn = nav.querySelector(".contact-btn");
    if (contactBtn) {
      contactBtn.textContent = this.portfolioData.navigation.contactButton;
    }
  }

  renderHero() {
    const hero = document.querySelector(".hero");
    if (!hero) return;

    const heroContent = hero.querySelector(".hero-content");
    if (heroContent) {
      const h1 = heroContent.querySelector("h1");
      const h2 = heroContent.querySelector("h2");
      const p = heroContent.querySelector("p");
      const buttons = heroContent.querySelector(".hero-buttons");

      if (h1) {
        const greeting = this.portfolioData.hero.greeting.replace(
          "Developer",
          this.portfolioData.personal.name
        );
        h1.textContent = greeting;
      }
      if (h2) h2.textContent = this.portfolioData.hero.title;
      if (p) p.textContent = this.portfolioData.hero.description;

      if (buttons) {
        buttons.innerHTML = this.portfolioData.hero.buttons
          .map(
            (btn) =>
              `<a href="${btn.href}" class="btn btn-${btn.type}">${btn.text}</a>`
          )
          .join("");
      }
    }

    // Update profile image
    const heroImage = hero.querySelector(".hero-image img");
    if (heroImage) {
      heroImage.src = this.portfolioData.personal.profileImage;
      heroImage.alt = `${this.portfolioData.personal.name} Portrait`;
    }
  }

  renderProjects() {
    const projectsGrid = document.querySelector(".projects-grid");
    if (!projectsGrid) return;

    projectsGrid.innerHTML = this.portfolioData.projects
      .map(
        (project) => `
                <div class="project-card fade-in-up">
                    <div class="project-image">
                        <i class="${project.icon}"></i>
                    </div>
                    <div class="project-content">
                        <h3>${project.name}</h3>
                        <p>${project.description}</p>
                        <a href="${project.link}" class="project-link">
                            View Project <i class="fas fa-arrow-right"></i>
                        </a>
                    </div>
                </div>
            `
      )
      .join("");
  }

  renderExperience() {
    const experienceContainer = document.querySelector(".experience-container");
    if (!experienceContainer) return;

    // Render company tabs
    const companyTabs = experienceContainer.querySelector(".company-tabs");
    if (companyTabs) {
      companyTabs.innerHTML = this.portfolioData.experience
        .map(
          (exp, index) => `
                    <button class="company-tab ${
                      index === 0 ? "active" : ""
                    }" data-company="${exp.id}">
                        ${exp.company}
                    </button>
                `
        )
        .join("");
    }

    // Render experience details
    const experienceContent = experienceContainer.querySelector(
      ".experience-content"
    );
    if (experienceContent) {
      experienceContent.innerHTML = this.portfolioData.experience
        .map(
          (exp, index) => `
                    <div id="${exp.id}" class="experience-details ${
            index === 0 ? "active" : ""
          }">
                        <h3>${
                          exp.position
                        }<span> </span><span class="company">@ ${
            exp.company
          }</span></h3>
                        <div class="period">${exp.period}</div>
                        <ul class="experience-list">
                            ${exp.achievements
                              .map(
                                (achievement) => `
                                <li>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                        fill="none" stroke="#6e06f2" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                    ${achievement}
                                </li>
                            `
                              )
                              .join("")}
                        </ul>
                    </div>
                `
        )
        .join("");
    }
  }

  renderSkills() {
    const skillsGrid = document.querySelector(".skills-grid");
    if (!skillsGrid) return;

    skillsGrid.innerHTML = this.portfolioData.skills.categories
      .map(
        (category) => `
                <div class="skill-category fade-in-up">
                    <h4>${category.name}</h4>
                    <ul class="skill-list">
                        ${category.skills
                          .map((skill) => `<li>${skill}</li>`)
                          .join("")}
                    </ul>
                </div>
            `
      )
      .join("");
  }

  renderStory() {
    const storyContent = document.querySelector(".story-content");
    if (!storyContent) return;

    storyContent.innerHTML = this.portfolioData.story.paragraphs
      .map((paragraph) => `<p>${paragraph}</p>`)
      .join("");
  }

  renderContact() {
    const contactContainer = document.querySelector(".contact-container");
    if (!contactContainer) return;

    const contactContent = contactContainer.querySelector(".contact-content");
    if (contactContent) {
      const h2 = contactContent.querySelector("h2");
      const p = contactContent.querySelector("p");
      const socialLinks = contactContent.querySelector(".social-links");
      const contactButtons = contactContent.querySelector(".contact-buttons");

      if (h2) h2.textContent = this.portfolioData.contact.heading;
      if (p) p.textContent = this.portfolioData.contact.description;

      if (socialLinks) {
        socialLinks.innerHTML = this.portfolioData.contact.socialLinks
          .map(
            (social) =>
              `<a href="${social.url}"><i class="${social.icon}"></i></a>`
          )
          .join("");
      }

      if (contactButtons) {
        const buttonsHTML = this.portfolioData.contact.buttons
          .map((btn) => {
            // Add mail icon for "Get In Touch" button
            if (btn.text === "Get In Touch") {
              return `<a href="${btn.href}" class="btn btn-${btn.type}">
                  <i class="fas fa-envelope"></i> ${btn.text}
                </a>`;
            }
            return `<a href="${btn.href}" class="btn btn-${btn.type}">${btn.text}</a>`;
          })
          .join("");

        // Add resume download button
        const resumeButton = `<a href="#" class="btn btn-resume" id="download-resume">
          <i class="fas fa-download"></i> Download Resume
        </a>`;

        contactButtons.innerHTML = buttonsHTML + resumeButton;

        // Add event listener for resume download
        const downloadResumeBtn =
          contactButtons.querySelector("#download-resume");
        if (downloadResumeBtn && this.portfolioData.contact.resumeFileId) {
          downloadResumeBtn.addEventListener("click", (e) => {
            e.preventDefault();
            this.downloadResume();
          });
        }
      }
    }
  }

  initializeExperienceTabs() {
    const companyTabs = document.querySelectorAll(".company-tab");
    const experienceDetails = document.querySelectorAll(".experience-details");

    companyTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const company = tab.dataset.company;

        // Remove active class from all tabs and details
        companyTabs.forEach((t) => t.classList.remove("active"));
        experienceDetails.forEach((d) => d.classList.remove("active"));

        // Add active class to clicked tab and corresponding detail
        tab.classList.add("active");
        document.getElementById(company).classList.add("active");
      });
    });
  }

  downloadResume() {
    const resumeFileId = this.portfolioData.contact.resumeFileId;
    if (!resumeFileId) {
      console.error("Resume file ID not found in portfolio data");
      return;
    }

    // Construct Google Drive download URL
    const downloadUrl = `https://drive.google.com/uc?export=download&id=${resumeFileId}`;

    // Create a temporary anchor element to trigger download
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = "Deepak_Kumar_Resume.pdf";
    link.target = "_blank";

    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  updatePageTitle() {
    const name = this.portfolioData.personal.name;
    const title = this.portfolioData.personal.title;
    document.title = `${name} | ${title}`;
  }
}

// Initialize and load portfolio data
document.addEventListener("DOMContentLoaded", () => {
  const portfolioRenderer = new PortfolioRenderer();
  portfolioRenderer.loadData();
});
