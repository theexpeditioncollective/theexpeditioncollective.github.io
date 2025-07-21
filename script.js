// Sidebar functionality
const hamburger = document.getElementById("hamburger")
const sidebar = document.getElementById("sidebar")
const sidebarOverlay = document.getElementById("sidebar-overlay")
const closeSidebar = document.getElementById("close-sidebar")

function openSidebar() {
  sidebar.classList.add("open")
  sidebarOverlay.classList.add("active")
  document.body.style.overflow = "hidden"
}

function closeSidebarFunc() {
  sidebar.classList.remove("open")
  sidebarOverlay.classList.remove("active")
  document.body.style.overflow = "auto"
}

// Event listeners
hamburger.addEventListener("click", openSidebar)
closeSidebar.addEventListener("click", closeSidebarFunc)
sidebarOverlay.addEventListener("click", closeSidebarFunc)

// Close sidebar on ESC key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && sidebar.classList.contains("open")) {
    closeSidebarFunc()
  }
})

// Smooth scrolling for sidebar links
document.querySelectorAll(".sidebar-nav a").forEach((link) => {
  link.addEventListener("click", function (e) {
    const href = this.getAttribute("href")
    if (href.startsWith("#")) {
      e.preventDefault() // Prevent default only for internal anchors
      const target = document.querySelector(href)
      if (target) {
        closeSidebarFunc()
        setTimeout(() => {
          target.scrollIntoView({ behavior: "smooth" })
        }, 300)
      }
    } else {
      // For external links or links to other pages, allow default behavior
      closeSidebarFunc() // Close sidebar before navigating
    }
  })
})

// Header hide/show on scroll with blur effect
let lastScrollTop = 0
let scrollTimeout = null
const header = document.querySelector(".header")

function handleScroll() {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop

  // Get all hero sections: .hero, .hero2, .hero3, .ganga-hero, .who-we-are-hero, .connect-split-hero
  const heroSections = [
    document.querySelector(".hero"),
    document.querySelector(".hero2"),
    document.querySelector(".who-we-are-hero"),
    document.querySelector(".ganga-hero"),
    document.querySelector(".upcoming-expeditions-section"),
    document.querySelector(".connect-split-hero"), // Add connect page hero
  ].filter(Boolean)

  // Find the first hero section that exists
  let heroHeight = 0
  if (heroSections.length > 0) {
    heroHeight = heroSections[0].offsetHeight
  }
  const halfHeroHeight = heroHeight / 2

  // Add a small buffer to prevent jittery transitions
  const buffer = 10

  // Logic for applying/removing blur effect
  // This applies to all headers, but CSS will define the visual outcome for .ganga-page
  if (scrollTop > halfHeroHeight + buffer) {
    if (!header.classList.contains("header-blurred")) {
      header.classList.add("header-blurred")
    }
  } else if (scrollTop < halfHeroHeight - buffer) {
    if (header.classList.contains("header-blurred")) {
      header.classList.remove("header-blurred")
    }
  }

  // Universal hide/show header logic
  // This applies to all headers, including ganga-page
  if (scrollTop <= 100) {
    // At the very top, always show
    header.classList.remove("header-hidden")
    header.classList.add("header-visible")
  } else {
    // Scrolling down
    if (scrollTop > lastScrollTop) {
      header.classList.add("header-hidden")
      header.classList.remove("header-visible")
    }
    // Scrolling up
    else if (scrollTop < lastScrollTop) {
      header.classList.remove("header-hidden")
      header.classList.add("header-visible")
    }
  }

  lastScrollTop = scrollTop <= 0 ? 0 : scrollTop // For Mobile or negative scrolling
}

// Throttle scroll events for better performance
function throttledScroll() {
  if (scrollTimeout) {
    return
  }

  scrollTimeout = setTimeout(() => {
    handleScroll()
    scrollTimeout = null
  }, 10)
}

// Add scroll event listener
window.addEventListener("scroll", throttledScroll, { passive: true })

// Course cards gradient animation
function setupCourseCardsAnimation() {
  const courseCards = document.querySelectorAll(".course-card")
  const coursesSection = document.querySelector(".courses-section")

  if (!coursesSection || courseCards.length === 0) return

  // Create intersection observer for the courses section
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Add animation class to all course cards with staggered delay
          courseCards.forEach((card, index) => {
            setTimeout(() => {
              card.classList.add("animate-gradients")
            }, index * 200) // 200ms delay between each card
          })
        } else {
          // Remove animation class when section is out of view
          courseCards.forEach((card) => {
            card.classList.remove("animate-gradients")
          })
        }
      })
    },
    {
      threshold: 0.3, // Trigger when 30% of the section is visible
      rootMargin: "-50px 0px", // Add some margin for better timing
    },
  )

  observer.observe(coursesSection)
}

// Contact section animation
function setupContactAnimation() {
  const contactTitle = document.querySelector(".contact-title")
  const contactForm = document.querySelector(".contact-form")
  const contactSection = document.querySelector(".contact-section")

  if (!contactSection || !contactTitle || !contactForm) return

  // Create intersection observer for the contact section
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Add animation classes with staggered timing
          setTimeout(() => {
            contactTitle.classList.add("animate-contact")
          }, 100)

          setTimeout(() => {
            contactForm.classList.add("animate-contact")
          }, 400)
        } else {
          // Remove animation classes when section is out of view
          contactTitle.classList.remove("animate-contact")
          contactForm.classList.remove("animate-contact")
        }
      })
    },
    {
      threshold: [0.1, 0.2, 0.3], // Multiple thresholds for different screen sizes
      rootMargin: "-10% 0px -10% 0px", // Percentage-based margins work better across devices
    },
  )

  observer.observe(contactSection)
}

// Floating label functionality
function setupFloatingLabels() {
  const formGroups = document.querySelectorAll(".form-group")

  formGroups.forEach((group) => {
    const input = group.querySelector(".form-input, .form-textarea")
    const label = group.querySelector(".form-label")

    if (!input || !label) return

    // Function to check if field has content
    function hasContent() {
      return input.value.trim() !== ""
    }

    // Function to update label position
    function updateLabel() {
      if (document.activeElement === input || hasContent()) {
        label.classList.add("active")
        // Add extra spacing for textarea
        if (input.classList.contains("form-textarea")) {
          input.style.paddingTop = "30px"
        }
      } else {
        label.classList.remove("active")
        // Reset padding for textarea
        if (input.classList.contains("form-textarea")) {
          input.style.paddingTop = "25px"
        }
      }
    }

    // Initial check
    updateLabel()

    // Event listeners
    input.addEventListener("focus", updateLabel)
    input.addEventListener("blur", updateLabel)
    input.addEventListener("input", updateLabel)

    // For autofill detection
    input.addEventListener("change", updateLabel)
  })
}

// Auto-update copyright year
function updateCopyrightYear() {
  const currentYear = new Date().getFullYear()
  const yearElement = document.getElementById("current-year")
  if (yearElement) {
    yearElement.textContent = currentYear
  }
}

// Form submission
document.querySelector(".contact-form")?.addEventListener("submit", function (e) {
  e.preventDefault()
  alert("Thank you for your message! We'll get back to you soon.")
  this.reset()

  // Reset floating labels after form reset
  setTimeout(() => {
    setupFloatingLabels()
  }, 100)
})

// Search functionality
document.querySelector(".search-btn")?.addEventListener("click", () => {
  const searchValue = document.querySelector(".search-input")?.value
  if (searchValue && searchValue.trim()) {
    alert(`Searching for: ${searchValue}`)
  }
})

document.querySelector(".search-input")?.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    const searchValue = this.value
    if (searchValue.trim()) {
      alert(`Searching for: ${searchValue}`)
    }
  }
})

// Typewriter effect for quote
function typeWriter() {
  const lines = ["Tell me and I forget.", "Teach me and I remember.", "Involve me and I learn.", "-Benjamin Franklin"]

  const quoteTextElement = document.querySelector(".quote-text")
  const quoteAuthorElement = document.querySelector(".quote-author")
  const quoteBox = document.querySelector(".quote-box")

  if (!quoteTextElement || !quoteAuthorElement || !quoteBox) return

  // Add typing class to show cursor
  quoteBox.classList.add("typing")

  // Content is already empty from HTML
  let lineIndex = 0
  let charIndex = 0
  let currentElement = quoteTextElement

  function typeNextChar() {
    if (lineIndex < lines.length) {
      const currentLine = lines[lineIndex]

      // Switch to author element for the last line
      if (lineIndex === 3) {
        currentElement = quoteAuthorElement
      }

      if (charIndex < currentLine.length) {
        // Add character
        if (lineIndex < 3) {
          // For quote lines, wrap in <p> tags
          const existingPs = currentElement.querySelectorAll("p")
          if (existingPs.length <= lineIndex) {
            const newP = document.createElement("p")
            if (lineIndex === 2) {
              // Third line: "Involve me and I learn."
              if (charIndex < "Involve me and ".length) {
                newP.innerHTML = currentLine.substring(0, charIndex + 1)
              } else {
                const beforeBold = "Involve me and "
                const boldPart = currentLine.substring("Involve me and ".length, "Involve me and I learn".length)
                const afterBold = currentLine.substring("Involve me and I learn".length)

                if (charIndex < "Involve me and I learn".length) {
                  const boldText = boldPart.substring(0, charIndex - beforeBold.length + 1)
                  newP.innerHTML = beforeBold + "<strong>" + boldText + "</strong>"
                } else {
                  const remainingText = afterBold.substring(0, charIndex - "Involve me and I learn".length + 1)
                  newP.innerHTML = beforeBold + "<strong>" + boldPart + "</strong>" + remainingText
                }
              }
            } else {
              newP.textContent = currentLine.charAt(charIndex)
            }
            currentElement.appendChild(newP)
          } else {
            const currentP = existingPs[lineIndex]
            if (lineIndex === 2) {
              // Third line: "Involve me and I learn."
              if (charIndex < "Involve me and ".length) {
                currentP.innerHTML = currentLine.substring(0, charIndex + 1)
              } else {
                const beforeBold = "Involve me and "
                const boldPart = currentLine.substring("Involve me and ".length, "Involve me and I learn".length)
                const afterBold = currentLine.substring("Involve me and I learn".length)

                if (charIndex < "Involve me and I learn".length) {
                  const boldText = boldPart.substring(0, charIndex - beforeBold.length + 1)
                  currentP.innerHTML = beforeBold + "<strong>" + boldText + "</strong>"
                } else {
                  const remainingText = afterBold.substring(0, charIndex - "Involve me and I learn".length + 1)
                  currentP.innerHTML = beforeBold + "<strong>" + boldPart + "</strong>" + remainingText
                }
              }
            } else {
              currentP.textContent = currentLine.substring(0, charIndex + 1)
            }
          }
        } else {
          // For author line
          currentElement.textContent = currentLine.substring(0, charIndex + 1)
        }

        charIndex++
        setTimeout(typeNextChar, 25) // Faster typing speed
      } else {
        // Move to next line
        lineIndex++
        charIndex = 0
        setTimeout(typeNextChar, 150) // Shorter pause between lines
      }
    } else {
      // Typing complete - remove cursor
      quoteBox.classList.remove("typing")
      quoteBox.classList.add("typing-complete")
    }
  }

  typeNextChar()
}

// Start typewriter effect after quote box animation
function startTypewriter() {
  setTimeout(() => {
    typeWriter()
  }, 1200) // Reduced from 1700 to 1200 for faster start
}

// Add loading animation
window.addEventListener("load", () => {
  document.body.classList.add("loaded")
  startTypewriter()
  updateCopyrightYear() // Update copyright year on page load
  setupCourseCardsAnimation() // Setup course cards animation
  setupContactAnimation() // Setup contact section animation
  setupFloatingLabels() // Setup floating label functionality
})

// Logo Animation
const wrapper = document.getElementById("logoWrapper")
const logotype = document.getElementById("logotype")
const monogram = document.getElementById("monogram")
let hoverActive = false
let enterTimeout

wrapper.addEventListener("mouseenter", () => {
  // Don't animate if header is blurred or on who-we-are page
  if (header.classList.contains("header-blurred") || window.location.pathname.includes("who-we-are.html")) {
    return
  }

  hoverActive = true
  logotype.style.transform = "scaleX(1) scaleY(3)"
  logotype.style.opacity = "1"
  clearTimeout(enterTimeout)
  enterTimeout = setTimeout(() => {
    if (hoverActive && !header.classList.contains("header-blurred")) {
      logotype.style.transform = "scaleX(0) scaleY(3)"
      logotype.style.opacity = "0"
      monogram.style.transform = "scaleX(1) scale(0.6)"
      monogram.style.opacity = "1"
    }
  }, 75)
})

wrapper.addEventListener("mouseleave", () => {
  // Don't animate if header is blurred or on who-we-are page
  if (header.classList.contains("header-blurred") || window.location.pathname.includes("who-we-are.html")) {
    return
  }

  hoverActive = false
  clearTimeout(enterTimeout)
  monogram.style.transform = "scaleX(2.5) scale(0.6)"
  monogram.style.opacity = "0"
  setTimeout(() => {
    if (!hoverActive && !header.classList.contains("header-blurred")) {
      logotype.style.transform = "scaleX(1) scaleY(1)"
      logotype.style.opacity = "1"
    }
  }, 75)
})

// Course card click handler for Ganga page
document.addEventListener("DOMContentLoaded", () => {
  const gangaCard = document.querySelector('.course-card[data-bg="frames"]')
  if (gangaCard) {
    gangaCard.addEventListener("click", () => {
      window.location.href = "ganga.html"
    })
  }
})

// Join us button click handler
document.addEventListener("DOMContentLoaded", () => {
  const joinUsBtn = document.querySelector(".join-us-btn")
  if (joinUsBtn) {
    joinUsBtn.addEventListener("click", () => {
      // Scroll to contact section or open contact form
      const contactSection = document.querySelector(".contact-section")
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: "smooth" })
      } else {
        // If on ganga page, redirect to home page contact section
        window.location.href = "index.html#connect"
      }
    })
  }
})

// Who we are video functionality
document.addEventListener("DOMContentLoaded", () => {
  const video = document.querySelector(".who-we-are-video")
  if (video) {
    video.addEventListener("play", () => {
      header.classList.add("header-hidden")
    })
    video.addEventListener("pause", () => {
      header.classList.remove("header-hidden")
    })
    video.addEventListener("ended", () => {
      header.classList.remove("header-hidden")
    })
  }
})

// Intersection Observer for day row animations
const observerOptions = {
  threshold: 0.3,
  rootMargin: '-50px 0px -50px 0px'
};

const dayRowObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.classList.contains('animate-in')) {
      // Only add animate-in class if it's not already there
      entry.target.classList.add('animate-in');
    }
  });
}, observerOptions);

// Observe all day rows
document.addEventListener('DOMContentLoaded', () => {
  const dayRows = document.querySelectorAll('.day-row');
  dayRows.forEach(row => {
    dayRowObserver.observe(row);
  });
});
