/* ================================================================
   ESTUDIO TERRENO — Interactividad
   ================================================================ */
(function () {
  'use strict';

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  // Año dinámico
  var yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Nav móvil
  var navToggle = $('.nav-toggle');
  var primaryNav = $('#primary-nav');
  var siteHeader = $('#siteHeader');

  if (navToggle && primaryNav) {
    navToggle.addEventListener('click', function () {
      var isOpen = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!isOpen));
      primaryNav.classList.toggle('open');
      if (siteHeader) siteHeader.classList.toggle('nav-open', !isOpen);
      document.body.style.overflow = !isOpen ? 'hidden' : '';
    });
    $$('.primary-nav a').forEach(function (link) {
      link.addEventListener('click', function () {
        navToggle.setAttribute('aria-expanded', 'false');
        primaryNav.classList.remove('open');
        if (siteHeader) siteHeader.classList.remove('nav-open');
        document.body.style.overflow = '';
      });
    });
  }

  // Reveal on scroll
  var reveals = $$('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var delay = parseInt(entry.target.dataset.delay || '0', 10);
          setTimeout(function () { entry.target.classList.add('is-visible'); }, delay);
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -40px 0px', threshold: 0.05 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // Form validation
  var form = $('#contactForm');
  var formStatus = $('#formStatus');

  function setStatus(msg, type) {
    if (!formStatus) return;
    formStatus.textContent = msg;
    formStatus.classList.remove('success', 'error');
    if (type) formStatus.classList.add(type);
  }
  function markError(field, has) {
    var w = field.closest('.form-field');
    if (w) w.classList.toggle('error', has);
  }
  function validEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); }

  function validate() {
    var ok = true, first = null;
    $$('[required]', form).forEach(function (field) {
      var v = (field.value || '').trim();
      var isOk = !!v;
      if (field.type === 'email') isOk = validEmail(v);
      markError(field, !isOk);
      if (!isOk) { ok = false; if (!first) first = field; }
    });
    if (first) {
      first.focus();
      first.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    return ok;
  }

  if (form) {
    $$('input, select, textarea', form).forEach(function (field) {
      field.addEventListener('input', function () {
        var w = field.closest('.form-field');
        if (w && w.classList.contains('error')) w.classList.remove('error');
      });
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validate()) { setStatus('Revisá los campos marcados.', 'error'); return; }
      var gotcha = form.querySelector('[name="_gotcha"]');
      if (gotcha && gotcha.value) return;
      var btn = form.querySelector('button[type="submit"]');
      if (btn) { btn.disabled = true; btn.style.opacity = '0.6'; }
      setStatus('Enviando…');
      setTimeout(function () {
        setStatus('¡Recibido! Te respondemos en menos de 24 horas.', 'success');
        form.reset();
        if (btn) { btn.disabled = false; btn.style.opacity = '1'; }
      }, 1200);
    });
  }

  // Smooth scroll con offset
  $$('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var href = link.getAttribute('href');
      if (href === '#' || href === '#!') return;
      var target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.pageYOffset - 78;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

})();
