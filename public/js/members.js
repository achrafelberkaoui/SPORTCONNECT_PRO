/* ============================================================
   SportConnect Pro — members.js
   Interface uniquement :
     - ouverture / fermeture des <dialog>
     - remplissage des formulaires de modification, détail, suppression
     - recherche + filtres (résidence, certificat médical, famille)
       réalisés dans le navigateur, aucune requête au serveur
     - fermeture des modales avec Échap (géré nativement par <dialog>,
       renforcé ici pour les navigateurs sans support natif)
   Aucune logique métier, aucun fetch, aucune règle d'éligibilité.
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

  function setText(scope, id, value, fallback) {
    var el = scope.querySelector('#' + id);
    if (el) el.textContent = (value && String(value).trim()) ? value : (fallback || '—');
  }

  function fillEdit(dialog, opener) {
    if (!opener) return;
    var d = opener.dataset;

    setValue(dialog, 'edit-id', d.id);
    setValue(dialog, 'edit-first_name', d.first_name);
    setValue(dialog, 'edit-last_name', d.last_name);
    setValue(dialog, 'edit-date_of_birth', d.date_of_birth);
    setValue(dialog, 'edit-family_id', d.family_id);
    setValue(dialog, 'edit-medical_certificate_date', d.medical_certificate_date);
    setValue(dialog, 'edit-pass_sport_code', d.pass_sport_code);

    var resident = dialog.querySelector('#edit-is_resident');
    if (resident) resident.checked = (d.is_resident === '1');

    var sub = dialog.querySelector('#modal-edit-sub');
    if (sub && d.first_name) sub.textContent = 'Fiche de ' + d.first_name + ' ' + d.last_name + '.';
  }

  function fillDelete(dialog, opener) {
    if (!opener) return;
    setValue(dialog, 'delete-id', opener.dataset.id);
    var nameEl = dialog.querySelector('#delete-name');
    if (nameEl) nameEl.textContent = opener.dataset.name ? '« ' + opener.dataset.name + ' »' : 'Ce membre';
  }

  function fillView(dialog, opener) {
    if (!opener) return;
    var d = opener.dataset;

    var full = (d.first_name || '') + ' ' + (d.last_name || '');
    setText(dialog, 'view-fullname', full.trim());
    setText(dialog, 'view-first_name', d.first_name);
    setText(dialog, 'view-last_name', d.last_name);
    setText(dialog, 'view-date_of_birth', d.date_of_birth);
    setText(dialog, 'view-age', d.age ? d.age + ' ans' : null, '—');
    setText(dialog, 'view-family', d.family_name, 'Sans famille');
    setText(dialog, 'view-pass_sport', d.pass_sport_code, '—');
    setText(dialog, 'view-medical_date', d.medical_certificate_date, 'Non renseignée');

    var residenceBadge = dialog.querySelector('#view-residence-badge');
    if (residenceBadge) {
      var isResident = d.is_resident === '1';
      residenceBadge.textContent = isResident ? 'Résident' : 'Non-résident';
      residenceBadge.className = 'badge ' + (isResident ? 'badge--resident' : 'badge--nonresident');
    }

    var medicalBadge = dialog.querySelector('#view-medical-badge');
    if (medicalBadge) {
      var hasCert = !!(d.medical_certificate_date && d.medical_certificate_date.trim());
      medicalBadge.textContent = hasCert ? 'Fourni' : 'Manquant';
      medicalBadge.className = 'badge ' + (hasCert ? 'badge--valid' : 'badge--missing');
    }
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

    // Renfort pour les navigateurs sans support natif de <dialog> :
    // Échap ferme la modale ouverte via l'attribut "open" du repli.
    dialog.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && typeof dialog.close !== 'function') {
        closeModal(dialog);
      }
    });
  });

  /* --------- Recherche et filtres frontend --------- */

  var search       = document.getElementById('filter-search');
  var residence     = document.getElementById('filter-residence');
  var medical       = document.getElementById('filter-medical');
  var family        = document.getElementById('filter-family');
  var resetBtn      = document.getElementById('filters-reset');
  var counter       = document.getElementById('result-count');
  var noMatch       = document.getElementById('no-match');
  var rows          = Array.prototype.slice.call(document.querySelectorAll('.mrow'));

  function applyFilters() {
    if (!rows.length) return;

    var term = (search && search.value ? search.value : '').trim().toLowerCase();
    var res  = residence ? residence.value : '';
    var med  = medical ? medical.value : '';
    var fam  = family ? family.value : '';
    var shown = 0;

    rows.forEach(function (row) {
      var d = row.dataset;
      var haystack = ((d.first_name || '') + ' ' + (d.last_name || '')).toLowerCase();

      var okTerm = !term || haystack.indexOf(term) !== -1;
      var okRes  = !res
        || (res === 'resident' && d.is_resident === '1')
        || (res === 'non-resident' && d.is_resident === '0');
      var okMed  = !med
        || (med === 'present' && d.has_certificate === '1')
        || (med === 'missing' && d.has_certificate === '0');
      var okFam  = !fam
        || (fam === 'none' && !d.family_id)
        || (fam !== 'none' && d.family_id === fam);

      var ok = okTerm && okRes && okMed && okFam;
      row.hidden = !ok;
      if (ok) shown++;
    });

    if (counter) counter.textContent = shown + ' membre' + (shown > 1 ? 's' : '');
    if (noMatch) noMatch.hidden = shown !== 0;
  }

  [search, residence, medical, family].forEach(function (el) {
    if (!el) return;
    el.addEventListener('input', applyFilters);
    el.addEventListener('change', applyFilters);
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      [search, residence, medical, family].forEach(function (el) {
        if (el) el.value = '';
      });
      applyFilters();
      if (search) search.focus();
    });
  }
})();