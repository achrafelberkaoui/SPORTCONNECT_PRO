/* ============================================================
   SportConnect Pro — associations.js
   Interface uniquement :
     - ouverture / fermeture des <dialog>
     - remplissage des formulaires de modification, détail, suppression
     - recherche et compteur de résultats (frontend, aucune requête)
     - validation visuelle simple du champ obligatoire "name"
   Aucune logique métier, aucun fetch, aucune règle backend.
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

    var first = dialog.querySelector('input:not([type="hidden"]), textarea, button');
    if (first) first.focus();
  }

  function closeModal(dialog) {
    if (!dialog) return;
    if (typeof dialog.close === 'function') dialog.close();
    else dialog.removeAttribute('open');
    clearErrors(dialog);
  }

  /* ------------- Pré-remplissage ---------------- */

  function setValue(scope, id, value) {
    var el = scope.querySelector('#' + id);
    if (!el) return;
    el.value = (value === undefined || value === null || value === 'null' || value === 'undefined') ? '' : value;
  }

  function setText(scope, id, value, fallback) {
    var el = scope.querySelector('#' + id);
    if (el) el.textContent = (value && String(value).trim()) ? value : (fallback || '—');
  }

  function initialsOf(name) {
    if (!name) return '—';
    var words = String(name).trim().split(/\s+/).filter(Boolean);
    var letters = words.slice(0, 2).map(function (w) { return w[0]; });
    return letters.join('').toUpperCase() || '—';
  }

  function fillEdit(dialog, opener) {
    if (!opener) return;
    var d = opener.dataset;

    setValue(dialog, 'edit-id', d.id);
    setValue(dialog, 'edit-name', d.name);
    setValue(dialog, 'edit-description', d.description);

    var sub = dialog.querySelector('#modal-edit-sub');
    if (sub && d.name) sub.textContent = 'Fiche « ' + d.name + ' ».';
  }

  function fillDelete(dialog, opener) {
    if (!opener) return;
    setValue(dialog, 'delete-id', opener.dataset.id);
    var nameEl = dialog.querySelector('#delete-name');
    if (nameEl) nameEl.textContent = opener.dataset.name ? '« ' + opener.dataset.name + ' »' : 'Cette association';
  }

  function fillView(dialog, opener) {
    if (!opener) return;
    var d = opener.dataset;
    setText(dialog, 'view-name', d.name);
    setText(dialog, 'view-description', d.description, 'Aucune description renseignée.');

    var avatar = dialog.querySelector('#view-avatar');
    if (avatar) avatar.textContent = initialsOf(d.name);
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

    if (e.target.tagName === 'DIALOG' && e.target.classList.contains('modal')) {
      closeModal(e.target); // clic sur l'arrière-plan
    }
  });

  document.querySelectorAll('dialog.modal').forEach(function (dialog) {
    dialog.addEventListener('close', function () {
      if (lastOpener && document.contains(lastOpener)) lastOpener.focus();
      lastOpener = null;
    });
  });

  /* ------------- Validation visuelle simple ------------- */
  /* Ne remplace aucune validation serveur : affiche juste un
     message si le nom (obligatoire) est vide avant l'envoi. */

  function clearErrors(scope) {
    scope.querySelectorAll('.field.has-error').forEach(function (f) { f.classList.remove('has-error'); });
    scope.querySelectorAll('[data-error-for]').forEach(function (el) { el.hidden = true; });
  }

  function validateNameField(form) {
    var input = form.querySelector('input[name="name"]');
    if (!input) return true;

    var field = input.closest('.field');
    var error = form.querySelector('[data-error-for="' + input.id + '"]');
    var valid = input.value.trim().length > 0;

    if (field) field.classList.toggle('has-error', !valid);
    if (error) error.hidden = valid;

    return valid;
  }

  document.querySelectorAll('#modal-create form, #modal-edit form').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      if (!validateNameField(form)) {
        e.preventDefault();
        var input = form.querySelector('input[name="name"]');
        if (input) input.focus();
      }
    });

    var nameInput = form.querySelector('input[name="name"]');
    if (nameInput) {
      nameInput.addEventListener('input', function () { validateNameField(form); });
    }
  });

  /* --------- Recherche frontend (nom + description) ---------- */

  var search   = document.getElementById('filter-search');
  var resetBtn = document.getElementById('filters-reset');
  var counter  = document.getElementById('result-count');
  var noMatch  = document.getElementById('no-match');
  var rows     = Array.prototype.slice.call(document.querySelectorAll('.arow'));

  function applyFilters() {
    if (!rows.length) return;

    var term  = (search && search.value ? search.value : '').trim().toLowerCase();
    var shown = 0;

    rows.forEach(function (row) {
      var d = row.dataset;
      var haystack = ((d.name || '') + ' ' + (d.description || '')).toLowerCase();
      var ok = !term || haystack.indexOf(term) !== -1;

      row.hidden = !ok;
      if (ok) shown++;
    });

    if (counter) counter.textContent = shown + ' association' + (shown > 1 ? 's' : '');
    if (noMatch) noMatch.hidden = shown !== 0;
  }

  if (search) {
    search.addEventListener('input', applyFilters);
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      if (search) search.value = '';
      applyFilters();
      if (search) search.focus();
    });
  }
})();