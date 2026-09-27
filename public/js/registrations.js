(function () {
  'use strict';

  var lastOpener = null;

  /* ------------------ Modales ------------------ */

  function openModal(id, opener) {
    var dialog = document.getElementById(id);
    if (!dialog) return;

    if (id === 'modal-view') fillView(dialog, opener);

    lastOpener = opener || null;

    if (typeof dialog.showModal === 'function') {
      dialog.showModal();
    } else {
      dialog.setAttribute('open', ''); // repli navigateurs sans <dialog>
    }

    var first = dialog.querySelector('input:not([type="hidden"]), select, button');
    if (first) first.focus();
  }

  function closeModal(dialog) {
    if (!dialog) return;
    if (typeof dialog.close === 'function') dialog.close();
    else dialog.removeAttribute('open');
  }

  function setText(scope, id, value) {
    var el = scope.querySelector('#' + id);
    if (el) el.textContent = (value && String(value).trim()) ? value : '—';
  }

  function fillView(dialog, opener) {
    if (!opener) return;
    var d = opener.dataset;

    setText(dialog, 'view-member', d.member);
    setText(dialog, 'view-activity', d.activity);
    setText(dialog, 'view-price', d.price);
    setText(dialog, 'view-plan', d.plan);

    var badge = dialog.querySelector('#view-status-badge');
    if (badge) {
      badge.textContent = d.status_label || '—';
      badge.className = 'badge ' + (d.status_class || 'badge--neutral');
    }
  }

  document.addEventListener('click', function (e) {
    var opener = e.target.closest('[data-modal-open]');
    if (opener) {
      if (opener.disabled) return;
      e.preventDefault();
      openModal(opener.getAttribute('data-modal-open'), opener);
      return;
    }

    var closer = e.target.closest('[data-modal-close]');
    if (closer) {
      e.preventDefault();
      closeModal(closer.closest('dialog'));
      return;
    }

    if (e.target.tagName === 'DIALOG' && e.target.classList.contains('modal')) {
      closeModal(e.target);
    }
  });

  document.querySelectorAll('dialog.modal').forEach(function (dialog) {
    dialog.addEventListener('close', function () {
      if (lastOpener && document.contains(lastOpener)) lastOpener.focus();
      lastOpener = null;
    });
  });

  /* --------- Recherche et filtre frontend --------- */

  var search   = document.getElementById('filter-search');
  var status   = document.getElementById('filter-status');
  var resetBtn = document.getElementById('filters-reset');
  var counter  = document.getElementById('result-count');
  var noMatch  = document.getElementById('no-match');
  var rows     = Array.prototype.slice.call(document.querySelectorAll('.rrow'));

  function applyFilters() {
    if (!rows.length) return;

    var term = (search && search.value ? search.value : '').trim().toLowerCase();
    var stat = status ? status.value : '';
    var shown = 0;

    rows.forEach(function (row) {
      var d = row.dataset;
      var haystack = ((d.member || '') + ' ' + (d.activity || '')).toLowerCase();
      var ok = (!term || haystack.indexOf(term) !== -1)
            && (!stat || d.status === stat);

      row.hidden = !ok;
      if (ok) shown++;
    });

    if (counter) counter.textContent = shown + ' inscription' + (shown > 1 ? 's' : '');
    if (noMatch) noMatch.hidden = shown !== 0;
  }

  [search, status].forEach(function (el) {
    if (!el) return;
    el.addEventListener('input', applyFilters);
    el.addEventListener('change', applyFilters);
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      if (search) search.value = '';
      if (status) status.value = '';
      applyFilters();
      if (search) search.focus();
    });
  }

  /* --------- Bandeau « mis en liste d'attente » --------- */
  /* Le contrôleur redirige vers /registrations?waiting=1 mais ne
     transmet pas ce drapeau à la vue : on le lit depuis l'URL. */

  var params = new URLSearchParams(window.location.search);
  if (params.get('waiting') === '1') {
    var banner = document.getElementById('waiting-banner');
    if (banner) banner.hidden = false;
  }

  var bannerClose = document.getElementById('waiting-banner-close');
  if (bannerClose) {
    bannerClose.addEventListener('click', function () {
      var banner = document.getElementById('waiting-banner');
      if (banner) banner.hidden = true;

      // Nettoie l'URL sans recharger la page, purement cosmétique.
      if (window.history && window.history.replaceState) {
        var url = new URL(window.location.href);
        url.searchParams.delete('waiting');
        window.history.replaceState({}, '', url);
      }
    });
  }
})();