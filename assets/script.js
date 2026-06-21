/**
 * IsBar AI — Shared Script
 * Navbar effects, hamburger menu, fade-in animations, smooth scroll
 * Chatbot functionality (DeepSeek AI integration)
 */
document.addEventListener('DOMContentLoaded', () => {

  /* ═══════════════════════════════════════════
     NAVBAR SCROLL EFFECT
     ═══════════════════════════════════════════ */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const handleScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  /* ═══════════════════════════════════════════
     HAMBURGER MENU TOGGLE
     ═══════════════════════════════════════════ */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('open');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    document.addEventListener('click', (e) => {
      if (navLinks.classList.contains('open') &&
          !navLinks.contains(e.target) &&
          !hamburger.contains(e.target)) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  /* ═══════════════════════════════════════════
     SMOOTH SCROLL FOR ANCHOR LINKS
     ═══════════════════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navHeight = navbar ? navbar.offsetHeight : 70;
        const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 10;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ═══════════════════════════════════════════
     INTERSECTION OBSERVER — FADE IN ANIMATIONS
     ═══════════════════════════════════════════ */
  const animateSelectors = [
    '.service-card',
    '.course-card',
    '.feature-item',
    '.benefit-item',
    '.join-card',
    '.quiz-card',
    '.fade-in',
    '.live-section',
    '.community-cta .cta-buttons',
    '.stats-grid',
    '.welcome-section',
    '.quick-link-card',
    '.stat-item'
  ];

  const animateElements = document.querySelectorAll(animateSelectors.join(','));

  if (animateElements.length > 0 && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          const parent = entry.target.parentElement;
          if (parent) {
            const siblings = parent.querySelectorAll(animateSelectors.join(','));
            const index = Array.from(siblings).indexOf(entry.target);
            if (index >= 0) {
              entry.target.style.transitionDelay = `${(index % 4) * 0.1}s`;
            }
          }
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    animateElements.forEach(el => observer.observe(el));
  } else {
    animateElements.forEach(el => el.classList.add('visible'));
  }

  /* ═══════════════════════════════════════════
     MOBILE MENU IMPROVEMENTS
     ═══════════════════════════════════════════ */
  if (navLinks) {
    navLinks.addEventListener('touchmove', (e) => {
      if (navLinks.classList.contains('open')) {
        e.stopPropagation();
      }
    }, { passive: true });
  }

  /* ═══════════════════════════════════════════
     ACTIVE NAV LINK HIGHLIGHTING
     ═══════════════════════════════════════════ */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    } else if (currentPage === '' && href === 'index.html') {
      link.classList.add('active');
    }
  });

  /* ═══════════════════════════════════════════
     ═══════════════════════════════════════════
     CHATBOT FUNCTIONALITY
     ═══════════════════════════════════════════
     ═══════════════════════════════════════════ */

  const chatMessages = document.getElementById('chatMessages');
  const chatInput = document.getElementById('chatInput');
  const sendBtn = document.getElementById('sendBtn');
  const chatSuggestions = document.getElementById('chatSuggestions');

  // Only initialize on pages with chat
  if (!chatMessages) return;

  const WELCOME_MESSAGE = `Salaan! Waan ahay IsBar AI. Wax kasta oo aad i weydiiso AI-ga, courses-ka, buugaagta, ama IsBar AI ku saabsan — waan kaa caawin karaa! 👋`;

  // Session storage key
  const STORAGE_KEY = 'isbar_chat_history';

  // Chat history
  let chatHistory = [];

  /* ── Load history from sessionStorage ── */
  function loadHistory() {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        chatHistory = JSON.parse(stored);
        return true;
      }
    } catch (e) {
      console.warn('Failed to load chat history:', e);
    }
    return false;
  }

  /* ── Save history to sessionStorage ── */
  function saveHistory() {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(chatHistory));
    } catch (e) {
      console.warn('Failed to save chat history:', e);
    }
  }

  /* ── Scroll chat to bottom ── */
  function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  /* ── Add message to the chat UI ── */
  function addMessageUI(text, role) {
    const div = document.createElement('div');
    div.className = `message ${role}`;
    div.textContent = text;
    chatMessages.appendChild(div);
    scrollToBottom();
  }

  /* ── Show loading indicator ── */
  function showLoading() {
    const loader = document.createElement('div');
    loader.className = 'loading-indicator';
    loader.id = 'chatLoader';
    loader.innerHTML = `
      <span class="loading-dot"></span>
      <span class="loading-dot"></span>
      <span class="loading-dot"></span>
    `;
    chatMessages.appendChild(loader);
    scrollToBottom();
  }

  /* ── Hide loading indicator ── */
  function hideLoading() {
    const loader = document.getElementById('chatLoader');
    if (loader) loader.remove();
  }

  /* ── Typewriter effect ── */
  function typewriterEffect(text, container, speed = 25) {
    return new Promise((resolve) => {
      let index = 0;
      container.textContent = '';

      // Add blinking cursor
      const cursor = document.createElement('span');
      cursor.className = 'typing-cursor';
      container.appendChild(document.createTextNode(''));
      container.appendChild(cursor);

      function type() {
        if (index < text.length) {
          // Insert text before cursor
          const textNode = document.createTextNode(text[index]);
          container.insertBefore(textNode, cursor);
          index++;
          scrollToBottom();
          setTimeout(type, speed);
        } else {
          cursor.remove();
          resolve();
        }
      }

      type();
    });
  }

  /* ── Render all history messages ── */
  function renderHistory() {
    chatMessages.innerHTML = '';

    if (chatHistory.length === 0) {
      // Show welcome message
      const welcomeDiv = document.createElement('div');
      welcomeDiv.className = 'message bot';
      chatMessages.appendChild(welcomeDiv);
      typewriterEffect(WELCOME_MESSAGE, welcomeDiv, 20);
      return;
    }

    // Render all stored messages
    for (const msg of chatHistory) {
      addMessageUI(msg.content, msg.role);
    }
  }

  /* ── Find answer in knowledge.js ── */
  function findKnowledgeAnswer(query) {
    if (typeof findKnowledge === 'function') {
      return findKnowledge(query);
    }
    // Try knowledgeBase directly if available
    if (typeof knowledgeBase !== 'undefined' && typeof knowledgeKeys !== 'undefined') {
      const q = query.toLowerCase().trim();
      if (knowledgeBase[q]) return knowledgeBase[q];
      for (const key of knowledgeKeys) {
        if (q.includes(key) || key.includes(q)) {
          return knowledgeBase[key];
        }
      }
      const words = q.split(/\s+/);
      for (const word of words) {
        if (word.length > 2) {
          for (const key of knowledgeKeys) {
            if (key.includes(word)) {
              return knowledgeBase[key];
            }
          }
        }
      }
    }
    return null;
  }

  /* ── Send message to the API ── */
  async function sendMessage(message) {
    if (!message || !message.trim()) return;

    const text = message.trim();

    // Disable input while processing
    chatInput.disabled = true;
    sendBtn.disabled = true;

    // Add user message to UI and history
    addMessageUI(text, 'user');
    chatHistory.push({ role: 'user', content: text });
    saveHistory();

    // Clear input
    chatInput.value = '';

    // Show loading indicator
    showLoading();

    try {
      // Try the API first
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: chatHistory.slice(-10)
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      hideLoading();

      const reply = data.reply || 'Waan ka xumahay, jawaab heli kari waayay.';

      // Add bot response with typewriter effect
      const botDiv = document.createElement('div');
      botDiv.className = 'message bot';
      chatMessages.appendChild(botDiv);
      await typewriterEffect(reply, botDiv, 20);

      // Save to history
      chatHistory.push({ role: 'assistant', content: reply });
      saveHistory();
      scrollToBottom();

    } catch (error) {
      console.warn('API call failed, using knowledge fallback:', error.message);
      hideLoading();

      // Fallback to knowledge.js
      const knowledgeReply = findKnowledgeAnswer(text);

      if (knowledgeReply) {
        const botDiv = document.createElement('div');
        botDiv.className = 'message bot';
        chatMessages.appendChild(botDiv);
        await typewriterEffect(knowledgeReply, botDiv, 20);
        chatHistory.push({ role: 'assistant', content: knowledgeReply });
      } else {
        const fallbackReply = `Waan ka xumahay, waxaan la xiriiri kari waayay DeepSeek AI-ga. Fadlan isku day mar kale, ama booqo Support-ka haddii ay sii socoto dhibaatadu. 🤝`;
        const botDiv = document.createElement('div');
        botDiv.className = 'message bot';
        chatMessages.appendChild(botDiv);
        await typewriterEffect(fallbackReply, botDiv, 20);
        chatHistory.push({ role: 'assistant', content: fallbackReply });
      }

      saveHistory();
      scrollToBottom();
    }

    // Re-enable input
    chatInput.disabled = false;
    sendBtn.disabled = false;
    chatInput.focus();
  }

  /* ── Handle send button click ── */
  function handleSend() {
    const text = chatInput.value.trim();
    if (text) {
      sendMessage(text);
    }
  }

  /* ── Handle Enter key ── */
  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  });

  sendBtn.addEventListener('click', handleSend);

  /* ── Suggestion buttons ── */
  if (chatSuggestions) {
    chatSuggestions.addEventListener('click', (e) => {
      const btn = e.target.closest('.suggestion-btn');
      if (btn) {
        const query = btn.dataset.query;
        if (query) {
          sendMessage(query);
        }
      }
    });
  }

  /* ── Initialize chat ── */
  loadHistory();
  renderHistory();

  // Focus input on load
  setTimeout(() => chatInput.focus(), 500);
});
