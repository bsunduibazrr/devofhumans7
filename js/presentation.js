/**
 * Presentation Engine: Orchestrates 25 slides, transitions, keyboard controls,
 * Web Audio FX, presenter notes, Gen-Z celebration widgets, and interactive widgets.
 */

class PresentationController {
  constructor() {
    this.currentIndex = 0;
    this.totalSlides = 25;
    this.isTransitioning = false;
    this.mode = 'presentation'; // 'presentation' or 'scroll'
    this.soundEnabled = true;
    this.notesOpen = false;
    this.wheelLock = false;

    // Presentation Timer
    this.timerSeconds = 0;
    this.timerInterval = null;
    this.timerRunning = false;

    // Web Audio Context (Procedural sound synthesis)
    this.audioCtx = null;

    // Gen-Z Counter
    this.aPlusClicks = 0;

    this.init();
  }

  init() {
    this.cacheDOMElements();
    this.initAudioContext();
    this.initDockDots();
    this.bindKeyboard();
    this.bindTouchAndWheel();
    this.bindUIButtons();
    this.bindInteractiveWidgets();
    this.initCustomCursor();
    this.startTimer();

    // Initial render
    this.goToSlide(0, true);

    // Initialize 3D scene safely regardless of script load timing
    const init3D = () => {
      if (!this.scene3d && window.PresentationScene3D) {
        this.scene3d = new window.PresentationScene3D('webgl-canvas-container');
      }
    };

    if (document.readyState === 'loading') {
      window.addEventListener('DOMContentLoaded', init3D);
    } else {
      init3D();
    }
  }

  cacheDOMElements() {
    this.slidesContainer = document.getElementById('slides-viewport');
    this.slideElements = document.querySelectorAll('.slide-section');
    this.totalSlides = this.slideElements.length || (window.PRESENTATION_DATA ? window.PRESENTATION_DATA.slides.length : 25);

    this.progressBar = document.getElementById('presentation-progress-bar');
    this.counterCurrent = document.getElementById('slide-counter-current');
    this.counterTotal = document.getElementById('slide-counter-total');
    this.slideTitleBadge = document.getElementById('active-slide-title');
    this.dockCenterNav = document.querySelector('.dock-center-nav');

    this.btnPrev = document.getElementById('btn-nav-prev');
    this.btnNext = document.getElementById('btn-nav-next');
    this.btnFullscreen = document.getElementById('btn-toggle-fullscreen');
    this.btnNotes = document.getElementById('btn-toggle-notes');
    this.btnSound = document.getElementById('btn-toggle-sound');
    this.btnMode = document.getElementById('btn-toggle-mode');

    this.notesDrawer = document.getElementById('presenter-notes-drawer');
    this.notesCloseBtn = document.getElementById('btn-close-notes');
    this.notesContent = document.getElementById('notes-body-text');
    this.notesNextPreview = document.getElementById('notes-next-slide-title');
    this.timerDisplay = document.getElementById('notes-timer-display');
    this.btnTimerToggle = document.getElementById('btn-timer-toggle');
    this.btnTimerReset = document.getElementById('btn-timer-reset');

    this.cursorDot = document.getElementById('custom-cursor-dot');
    this.cursorRing = document.getElementById('custom-cursor-ring');
  }

  /**
   * Dynamically generate 25 dots in the bottom navigation dock
   */
  initDockDots() {
    if (!this.dockCenterNav) return;
    this.dockCenterNav.innerHTML = '';

    for (let i = 0; i < this.totalSlides; i++) {
      const dot = document.createElement('div');
      dot.className = `dock-indicator-dot ${i === 0 ? 'active' : ''}`;
      dot.setAttribute('data-index', i);
      const slideData = window.PRESENTATION_DATA ? window.PRESENTATION_DATA.slides[i] : null;
      dot.setAttribute('title', slideData ? `${slideData.number}. ${slideData.title}` : `Слайд ${i + 1}`);

      dot.addEventListener('click', () => {
        this.goToSlide(i);
      });

      this.dockCenterNav.appendChild(dot);
    }
  }

  /**
   * Pure procedural Web Audio sound synthesizer (No external audio files needed!)
   */
  initAudioContext() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.audioCtx = new AudioCtx();
      }
    } catch (e) {
      console.warn('Web Audio not supported or blocked:', e);
    }
  }

  playTickSound() {
    if (!this.soundEnabled || !this.audioCtx) return;
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1400, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(320, this.audioCtx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.06, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.04);
    } catch (err) {}
  }

  playSubWhooshSound() {
    if (!this.soundEnabled || !this.audioCtx) return;
    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(120, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(45, this.audioCtx.currentTime + 0.28);

      gain.gain.setValueAtTime(0.09, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.28);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.28);
    } catch (err) {}
  }

  playVictoryChord() {
    if (!this.soundEnabled || !this.audioCtx) return;
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C Major triumph
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        try {
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
          gain.gain.setValueAtTime(0.12, this.audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.6);
          osc.connect(gain);
          gain.connect(this.audioCtx.destination);
          osc.start();
          osc.stop(this.audioCtx.currentTime + 0.6);
        } catch(e) {}
      }, idx * 80);
    });
  }

  launchConfetti() {
    const colors = ['#09090b', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];
    for (let i = 0; i < 70; i++) {
      const p = document.createElement('div');
      p.className = 'confetti-particle';
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = Math.random() * 8 + 6;
      p.style.backgroundColor = color;
      p.style.width = `${size}px`;
      p.style.height = `${size * 0.65}px`;
      p.style.left = `${window.innerWidth / 2 + (Math.random() * 160 - 80)}px`;
      p.style.top = `${window.innerHeight / 2 + (Math.random() * 80 - 40)}px`;

      const tx = (Math.random() - 0.5) * window.innerWidth * 0.85;
      const ty = -(Math.random() * 280 + 80) + Math.random() * 380;
      const rot = Math.random() * 720 - 360;

      p.style.setProperty('--tx', `${tx}px`);
      p.style.setProperty('--ty', `${ty}px`);
      p.style.setProperty('--rot', `${rot}deg`);

      document.body.appendChild(p);
      setTimeout(() => p.remove(), 1600);
    }
  }

  goToSlide(index, immediate = false) {
    if (index < 0 || index >= this.totalSlides) return;
    if (this.isTransitioning && !immediate) return;

    this.isTransitioning = true;
    const prevIndex = this.currentIndex;
    this.currentIndex = index;

    // Trigger audio feedback
    if (!immediate) {
      this.playTickSound();
      if (index === 0 || index === this.totalSlides - 1 || Math.abs(index - prevIndex) > 2) {
        this.playSubWhooshSound();
      }
    }

    // 1. Update Slide DOM states
    this.slideElements.forEach((slide, idx) => {
      slide.classList.remove('active', 'prev', 'next');
      if (idx === index) {
        slide.classList.add('active');
        // Restart CSS staggered animations
        slide.querySelectorAll('.stagger-reveal').forEach((el) => {
          el.style.animation = 'none';
          el.offsetHeight; // trigger reflow
          el.style.animation = '';
        });
      } else if (idx < index) {
        slide.classList.add('prev');
      } else {
        slide.classList.add('next');
      }
    });

    // In presentation mode, transform the viewport wrapper
    if (this.mode === 'presentation' && this.slidesContainer) {
      const offsetPercent = index * 100;
      this.slidesContainer.style.transform = `translateY(-${offsetPercent}vh)`;
    }

    // 2. Update 3D Kinetic Scene
    if (this.scene3d) {
      this.scene3d.setSlide(index);
    }

    // 3. Update Progress and HUD
    this.updateHUD(index);

    // 4. Update Presenter Notes
    this.updatePresenterNotes(index);

    // Release transition lock after animation completes
    setTimeout(() => {
      this.isTransitioning = false;
    }, immediate ? 50 : 700);
  }

  nextSlide() {
    if (this.currentIndex < this.totalSlides - 1) {
      this.goToSlide(this.currentIndex + 1);
    }
  }

  prevSlide() {
    if (this.currentIndex > 0) {
      this.goToSlide(this.currentIndex - 1);
    }
  }

  updateHUD(index) {
    const numStr = String(index + 1).padStart(2, '0');
    const totStr = String(this.totalSlides).padStart(2, '0');

    if (this.counterCurrent) this.counterCurrent.textContent = numStr;
    if (this.counterTotal) this.counterTotal.textContent = totStr;

    // Progress bar width
    if (this.progressBar) {
      const progressPercent = ((index + 1) / this.totalSlides) * 100;
      this.progressBar.style.width = `${progressPercent}%`;
    }

    // Active slide title in bottom dock
    const slideData = window.PRESENTATION_DATA ? window.PRESENTATION_DATA.slides[index] : null;
    if (this.slideTitleBadge && slideData) {
      this.slideTitleBadge.textContent = `${slideData.number}. ${slideData.title}`;
    }

    // Bottom dock miniature dots
    document.querySelectorAll('.dock-indicator-dot').forEach((dot, idx) => {
      if (idx === index) {
        dot.classList.add('active');
        if (dot.scrollIntoView) {
          dot.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
      } else {
        dot.classList.remove('active');
      }
    });

    // Disable prev/next buttons on bounds
    if (this.btnPrev) this.btnPrev.disabled = index === 0;
    if (this.btnNext) this.btnNext.disabled = index === this.totalSlides - 1;
  }

  updatePresenterNotes(index) {
    const slideData = window.PRESENTATION_DATA ? window.PRESENTATION_DATA.slides[index] : null;
    const nextSlideData = window.PRESENTATION_DATA ? window.PRESENTATION_DATA.slides[index + 1] : null;

    if (this.notesContent && slideData) {
      this.notesContent.innerHTML = `
        <div class="notes-slide-title">
          <span class="mono-badge">СЛАЙД ${slideData.number} / ${this.totalSlides}</span>
          <h4>${slideData.title}</h4>
        </div>
        <div class="notes-lead-prompt">
          <strong>Илтгэгчийн ярих гол санаа:</strong>
          <p>${slideData.speakerNotes || 'Энэ слайдын ярианы тэмдэглэл бэлэн байна.'}</p>
        </div>
      `;
    }

    if (this.notesNextPreview) {
      if (nextSlideData) {
        this.notesNextPreview.textContent = `Дараагийн слайд: ${nextSlideData.number}. ${nextSlideData.title}`;
      } else {
        this.notesNextPreview.textContent = 'Төгсгөлийн слайд (Асуулт, хариулт)';
      }
    }
  }

  bindKeyboard() {
    window.addEventListener('keydown', (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
        case ' ': // Spacebar
        case 'PageDown':
          e.preventDefault();
          this.nextSlide();
          break;

        case 'ArrowLeft':
        case 'ArrowUp':
        case 'PageUp':
          e.preventDefault();
          this.prevSlide();
          break;

        case 'Home':
          e.preventDefault();
          this.goToSlide(0);
          break;

        case 'End':
          e.preventDefault();
          this.goToSlide(this.totalSlides - 1);
          break;

        case 'f':
        case 'F':
          e.preventDefault();
          this.toggleFullscreen();
          break;

        case 'n':
        case 'N':
          e.preventDefault();
          this.toggleNotesDrawer();
          break;

        case 'm':
        case 'M':
          e.preventDefault();
          this.toggleSound();
          break;

        case 'Escape':
          if (this.notesOpen) {
            this.toggleNotesDrawer(false);
          }
          break;
      }
    });
  }

  bindTouchAndWheel() {
    window.addEventListener('wheel', (e) => {
      if (this.mode !== 'presentation') return;

      if (this.wheelLock) return;
      this.wheelLock = true;
      setTimeout(() => { this.wheelLock = false; }, 850);

      if (e.deltaY > 25) {
        this.nextSlide();
      } else if (e.deltaY < -25) {
        this.prevSlide();
      }
    }, { passive: true });

    let touchStartY = 0;
    let touchStartX = 0;

    window.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        touchStartY = e.touches[0].clientY;
        touchStartX = e.touches[0].clientX;
      }
    }, { passive: true });

    window.addEventListener('touchend', (e) => {
      if (e.changedTouches.length === 1) {
        const deltaY = e.changedTouches[0].clientY - touchStartY;
        const deltaX = e.changedTouches[0].clientX - touchStartX;

        if (Math.abs(deltaY) > 50 && Math.abs(deltaY) > Math.abs(deltaX)) {
          if (deltaY < 0) this.nextSlide();
          else this.prevSlide();
        } else if (Math.abs(deltaX) > 60 && Math.abs(deltaX) > Math.abs(deltaY)) {
          if (deltaX < 0) this.nextSlide();
          else this.prevSlide();
        }
      }
    }, { passive: true });
  }

  bindUIButtons() {
    if (this.btnPrev) this.btnPrev.addEventListener('click', () => this.prevSlide());
    if (this.btnNext) this.btnNext.addEventListener('click', () => this.nextSlide());
    if (this.btnFullscreen) this.btnFullscreen.addEventListener('click', () => this.toggleFullscreen());
    if (this.btnNotes) this.btnNotes.addEventListener('click', () => this.toggleNotesDrawer());
    if (this.notesCloseBtn) this.notesCloseBtn.addEventListener('click', () => this.toggleNotesDrawer(false));
    if (this.btnSound) this.btnSound.addEventListener('click', () => this.toggleSound());
    if (this.btnMode) this.btnMode.addEventListener('click', () => this.toggleMode());

    // Presentation Timer controls
    if (this.btnTimerToggle) {
      this.btnTimerToggle.addEventListener('click', () => {
        if (this.timerRunning) this.pauseTimer();
        else this.startTimer();
      });
    }

    if (this.btnTimerReset) {
      this.btnTimerReset.addEventListener('click', () => this.resetTimer());
    }
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.warn('Fullscreen request failed:', err);
      });
      if (this.btnFullscreen) this.btnFullscreen.classList.add('active');
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      if (this.btnFullscreen) this.btnFullscreen.classList.remove('active');
    }
  }

  toggleNotesDrawer(forceState) {
    this.notesOpen = forceState !== undefined ? forceState : !this.notesOpen;
    if (this.notesDrawer) {
      if (this.notesOpen) {
        this.notesDrawer.classList.add('open');
        if (this.btnNotes) this.btnNotes.classList.add('active');
      } else {
        this.notesDrawer.classList.remove('open');
        if (this.btnNotes) this.btnNotes.classList.remove('active');
      }
    }
  }

  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    if (this.btnSound) {
      if (this.soundEnabled) {
        this.btnSound.classList.add('active');
        this.btnSound.innerHTML = `
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
          </svg>
          <span>ДУУТАЙ</span>
        `;
        this.playTickSound();
      } else {
        this.btnSound.classList.remove('active');
        this.btnSound.innerHTML = `
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <line x1="23" y1="9" x2="17" y2="15"></line>
            <line x1="17" y1="9" x2="23" y2="15"></line>
          </svg>
          <span>ХААСАН</span>
        `;
      }
    }
  }

  toggleMode() {
    if (this.mode === 'presentation') {
      this.mode = 'scroll';
      document.body.classList.add('mode-scroll');
      document.body.classList.remove('mode-presentation');
      if (this.slidesContainer) this.slidesContainer.style.transform = 'none';
      if (this.btnMode) {
        this.btnMode.innerHTML = `
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
            <line x1="8" y1="21" x2="16" y2="21"></line>
            <line x1="12" y1="17" x2="12" y2="21"></line>
          </svg>
          <span>СЛАЙД РУУ БУЦАХ</span>
        `;
      }
      this.setupScrollObserver();
    } else {
      this.mode = 'presentation';
      document.body.classList.add('mode-presentation');
      document.body.classList.remove('mode-scroll');
      if (this.btnMode) {
        this.btnMode.innerHTML = `
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="19" x2="12" y2="5"></line>
            <polyline points="5 12 12 5 19 12"></polyline>
          </svg>
          <span>ГҮЙЛГЭЖ ҮЗЭХ</span>
        `;
      }
      this.goToSlide(this.currentIndex, true);
    }
  }

  setupScrollObserver() {
    if (this.scrollObserver) this.scrollObserver.disconnect();

    this.scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && this.mode === 'scroll') {
          const index = parseInt(entry.target.getAttribute('data-slide-index'), 10);
          if (!isNaN(index) && index !== this.currentIndex) {
            this.currentIndex = index;
            if (this.scene3d) this.scene3d.setSlide(index);
            this.updateHUD(index);
            this.updatePresenterNotes(index);
          }
        }
      });
    }, { threshold: 0.55 });

    this.slideElements.forEach((el) => this.scrollObserver.observe(el));
  }

  startTimer() {
    if (this.timerRunning) return;
    this.timerRunning = true;
    if (this.btnTimerToggle) this.btnTimerToggle.textContent = 'Зогсоох';

    this.timerInterval = setInterval(() => {
      this.timerSeconds++;
      this.renderTimer();
    }, 1000);
  }

  pauseTimer() {
    this.timerRunning = false;
    clearInterval(this.timerInterval);
    if (this.btnTimerToggle) this.btnTimerToggle.textContent = 'Үргэлжлүүлэх';
  }

  resetTimer() {
    this.pauseTimer();
    this.timerSeconds = 0;
    this.renderTimer();
  }

  renderTimer() {
    if (!this.timerDisplay) return;
    const mins = String(Math.floor(this.timerSeconds / 60)).padStart(2, '0');
    const secs = String(this.timerSeconds % 60).padStart(2, '0');
    this.timerDisplay.textContent = `${mins}:${secs}`;
  }

  bindInteractiveWidgets() {
    // 1. Myth vs Fact reveal cards
    document.querySelectorAll('.myth-card').forEach((card) => {
      card.addEventListener('click', () => {
        card.classList.toggle('revealed');
        this.playTickSound();
      });
    });

    // 2. Gen-Z Finale A+ Button on Slide 25
    const aPlusBtn = document.getElementById('btn-grade-aplus');
    const aPlusCounter = document.getElementById('grade-counter-tag');
    if (aPlusBtn) {
      aPlusBtn.addEventListener('click', () => {
        this.aPlusClicks++;
        this.launchConfetti();
        this.playVictoryChord();

        if (aPlusCounter) {
          if (this.aPlusClicks === 1) {
            aPlusCounter.innerHTML = `🎉 Багш <strong style="color:var(--ink-pure); font-size:0.95rem;">1 удаа A+</strong> дарлаа! Баярлалаа багш аа!`;
          } else {
            aPlusCounter.innerHTML = `🔥 Багш нийт <strong style="color:var(--ink-pure); font-size:0.95rem;">${this.aPlusClicks} удаа A+</strong> дарлаа! 20 кредит батлагдлаа! 🚀`;
          }
        }
      });
    }
  }

  initCustomCursor() {
    if (!this.cursorDot || !this.cursorRing) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      this.cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    });

    const loop = () => {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      this.cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);

    const hoverTargets = 'a, button, .myth-card, .team-card, .dock-indicator-dot, .stat-hero-box, .editorial-card, .pillar-card, .genz-badge';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(hoverTargets)) {
        this.cursorRing.classList.add('cursor-hover');
      }
    });

    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(hoverTargets)) {
        this.cursorRing.classList.remove('cursor-hover');
      }
    });
  }
}

// Instantiate upon script execution
window.presentationApp = new PresentationController();
// pres v1
