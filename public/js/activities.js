/* ============================================================
   SportConnect Pro — activities-ui.js
   Interface uniquement :
     - ouverture / fermeture des <dialog>
     - remplissage des formulaires de modification et de suppression
     - modale de détail en lecture seule
     - filtrage visuel des lignes déjà affichées (aucune requête réseau)
   Aucune logique métier, aucun fetch, aucun calcul de prix ou de place.
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

    var first = dialog.querySelector('input:not([type="hidden"]), select, button');
    if (first) first.focus();
  }

  function closeModal(dialog) {
    if (!dialog) return;
    if (typeof dialog.close === 'function') dialog.close();
    else dialog.removeAttribute('open');
  }

  /* ------------- Pré-remplissage ---------------- */

  function setValue(scope, id, value) {
    var el = scope.querySelector('#' + id);
    if (!el) return;
    el.value = (value === undefined || value === null || value === 'null' || value === 'undefined') ? '' : value;
  }

  function setText(scope, id, value) {
    var el = scope.querySelector('#' + id);
    if (el) el.textContent = value || '—';
  }

  function fillEdit(dialog, opener) {
    if (!opener) return;
    var d = opener.dataset;

    setValue(dialog, 'edit-id', d.id);
    setValue(dialog, 'edit-name', d.name);
    setValue(dialog, 'edit-base_price', d.base_price);
    setValue(dialog, 'edit-max_capacity', d.max_capacity);
    setValue(dialog, 'edit-activity_date', d.activity_date);
    setValue(dialog, 'edit-start_time', d.start_time);
    setValue(dialog, 'edit-end_time', d.end_time);
    setValue(dialog, 'edit-min_age', d.min_age);
    setValue(dialog, 'edit-max_age', d.max_age);
    setValue(dialog, 'edit-association_id', d.association_id);
    setValue(dialog, 'edit-facility_id', d.facility_id);

    var box = dialog.querySelector('#edit-all_publics');
    if (box) box.checked = (d.all_publics === '1');

    var sub = dialog.querySelector('#modal-edit-sub');
    if (sub && d.name) sub.textContent = 'Créneau « ' + d.name + ' ».';
  }

  function fillDelete(dialog, opener) {
    if (!opener) return;
    setValue(dialog, 'delete-id', opener.dataset.id);
    var nameEl = dialog.querySelector('#delete-name');
    if (nameEl) nameEl.textContent = opener.dataset.name ? '« ' + opener.dataset.name + ' »' : 'Cette activité';
  }

  function fillView(dialog, opener) {
    if (!opener) return;
    var d = opener.dataset;
    setText(dialog, 'view-name', d.name);
    setText(dialog, 'view-association', d.association_name);
    setText(dialog, 'view-facility', d.facility_name);
    setText(dialog, 'view-date', d.date_label);
    setText(dialog, 'view-time', d.time_label);
    setText(dialog, 'view-capacity', d.capacity_label);
    setText(dialog, 'view-age', d.age_label);
    setText(dialog, 'view-price', d.price_label);
  }

  /* ------------------ Écouteurs ------------------ */

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

  /* --------- Filtrage visuel du tableau ---------- */

  var search      = document.getElementById('filter-search');
  var facility    = document.getElementById('filter-facility');
  var association = document.getElementById('filter-association');
  var dateInput   = document.getElementById('filter-date');
  var publicInput = document.getElementById('filter-public');
  var resetBtn    = document.getElementById('filters-reset');
  var counter     = document.getElementById('result-count');
  var noMatch     = document.getElementById('no-match');
  var rows        = Array.prototype.slice.call(document.querySelectorAll('.arow'));

  function applyFilters() {
    if (!rows.length) return;

    var term  = (search && search.value ? search.value : '').trim().toLowerCase();
    var fac   = facility ? facility.value : '';
    var asso  = association ? association.value : '';
    var date  = dateInput ? dateInput.value : '';
    var pub   = publicInput ? publicInput.value : '';
    var shown = 0;

    rows.forEach(function (row) {
      var d = row.dataset;
      var ok = (!term || (d.name || '').toLowerCase().indexOf(term) !== -1)
            && (!fac  || d.facility === fac)
            && (!asso || d.association === asso)
            && (!date || d.date === date)
            && (!pub  || d.public === pub);

      row.hidden = !ok;
      if (ok) shown++;
    });

    if (counter) counter.textContent = shown + ' activité' + (shown > 1 ? 's' : '');
    if (noMatch) noMatch.hidden = shown !== 0;
  }

  [search, facility, association, dateInput, publicInput].forEach(function (el) {
    if (!el) return;
    el.addEventListener('input', applyFilters);
    el.addEventListener('change', applyFilters);
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      [search, facility, association, dateInput, publicInput].forEach(function (el) {
        if (el) el.value = '';
      });
      applyFilters();
      if (search) search.focus();
    });
  }
    /* --------- Validation âge création ---------- */

  var createForm = document.querySelector('#modal-create form');

  if (createForm) {
    createForm.addEventListener('submit', function (event) {
      var minAge = Number(document.getElementById('create-min_age').value);
      var maxAge = Number(document.getElementById('create-max_age').value);

      if (maxAge < minAge) {
        event.preventDefault();

        alert(
          "L'âge maximum doit être supérieur ou égal à l'âge minimum."
        );
      }
    });
  }
})();