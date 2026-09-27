/* ============================================================
   SportConnect Pro — facilities.js
   Interface uniquement :
     - ouverture / fermeture des <dialog>
     - remplissage des formulaires de modification, détail, suppression
     - recherche (nom + type) et filtre par type, réalisés dans le
       navigateur, aucune requête au serveur
     - fermeture avec le bouton X, clic à l'extérieur, ou Échap
   Aucune logique métier, aucun fetch.
   ============================================================ */

(function () {
  'use strict';

  var lastOpener = null;

  /* ------------------ Modales ------------------ */

  function openModal(id, opener) {
    var dialog = document.getElementById(id);
    if (!dialog) return;

    if (id === 'modal-edit')   fillEdit(dialog, opener);
    if (id === 'modal-delete') fillDelete(dialog, opener);
    if (id === 'modal-view')   fillView(dialog, opener);

    lastOpener = opener || null;

    if (typeof dialog.showModal === 'function') {
      dialog.showModal();
    } else {
      dialog.setAttribute('open', ''); // repli navigateurs sans <dialog>
    }

    var first = dialog.querySelector('input:not([type="hidden"]), button');
    if (first) first.focus();
  }

  function closeModal(dialog) {
    if (!dialog) return;
    if (typeof dialog.close === 'function') dialog.close();
    else dialog.removeAttribute('open');
  }

  function setValue(scope, id, value) {
    var el = scope.querySelector('#' + id);
    if (!el) return;
    el.value = (value === undefined || value === null || value === 'null' || value === 'undefined') ? '' : value;
  }

  function setText(scope, id, value, fallback) {
    var el = scope.querySelector('#' + id);
    if (el) el.textContent = (value !== undefined && value !== null && String(value).trim()) ? value : (fallback || '—');
  }

  function fillEdit(dialog, opener) {
    if (!opener) return;
    var d = opener.dataset;

    setValue(dialog, 'edit-id', d.id);
    setValue(dialog, 'edit-name', d.name);
    setValue(dialog, 'edit-type', d.type);
    setValue(dialog, 'edit-erp_capacity', d.erp_capacity);

    var sub = dialog.querySelector('#modal-edit-sub');
    if (sub && d.name) sub.textContent = 'Infrastructure « ' + d.name + ' ».';
  }

  function fillDelete(dialog, opener) {
    if (!opener) return;
    setValue(dialog, 'delete-id', opener.dataset.id);
    var nameEl = dialog.querySelector('#delete-name');
    if (nameEl) nameEl.textContent = opener.dataset.name ? '« ' + opener.dataset.name + ' »' : 'Cette infrastructure';
  }

  function fillView(dialog, opener) {
    if (!opener) return;
    var d = opener.dataset;
    setText(dialog, 'view-id', d.id ? '#' + d.id : null);
    setText(dialog, 'view-name', d.name);
    setText(dialog, 'view-type', d.type, 'Non renseigné');
    setText(dialog, 'view-capacity', d.erp_capacity, 'Non renseignée');
  }

  /* ------------------ Écouteurs de modales ------------------ */

  document.addEventListener('click', function (e) {
    var opener = e.target.closest('[data-modal-open]');
    if (opener) {
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

    // Clic sur l'arrière-plan (backdrop) de la modale.
    if (e.target.tagName === 'DIALOG' && e.target.classList.contains('modal')) {
      closeModal(e.target);
    }
  });

  document.querySelectorAll('dialog.modal').forEach(function (dialog) {
    dialog.addEventListener('close', function () {
      if (lastOpener && document.contains(lastOpener)) lastOpener.focus();
      lastOpener = null;
    });

    // <dialog> ferme déjà avec Échap nativement ; ce renfort ne sert
    // que pour le repli sans support natif (attribut "open" manuel).
    dialog.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && typeof dialog.close !== 'function') {
        closeModal(dialog);
      }
    });
  });

  /* --------- Recherche et filtre frontend --------- */

  var search   = document.getElementById('filter-search');
  var type     = document.getElementById('filter-type');
  var resetBtn = document.getElementById('filters-reset');
  var counter  = document.getElementById('result-count');
  var noMatch  = document.getElementById('no-match');
  var rows     = Array.prototype.slice.call(document.querySelectorAll('.frow'));

  function applyFilters() {
    if (!rows.length) return;

    var term = (search && search.value ? search.value : '').trim().toLowerCase();
    var t    = type ? type.value : '';
    var shown = 0;

    rows.forEach(function (row) {
      var d = row.dataset;
      var haystack = ((d.name || '') + ' ' + (d.type || '')).toLowerCase();

      var okTerm = !term || haystack.indexOf(term) !== -1;
      var okType = !t || d.type === t;

      var ok = okTerm && okType;
      row.hidden = !ok;
      if (ok) shown++;
    });

    if (counter) counter.textContent = shown + ' infrastructure' + (shown > 1 ? 's' : '');
    if (noMatch) noMatch.hidden = shown !== 0;
  }

  [search, type].forEach(function (el) {
    if (!el) return;
    el.addEventListener('input', applyFilters);
    el.addEventListener('change', applyFilters);
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      if (search) search.value = '';
      if (type) type.value = '';
      applyFilters();
      if (search) search.focus();
    });
  }
})();