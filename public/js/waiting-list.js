/* =========================================================
   WAITING LIST JS
========================================================= */

document.addEventListener('DOMContentLoaded', () => {

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const searchInput =
        document.getElementById('searchInput');

    const statusFilter =
        document.getElementById('statusFilter');

    const visibleCount =
        document.getElementById('visibleCount');

    const rows =
        document.querySelectorAll('.waiting-row');

    const refreshBtn =
        document.getElementById('refreshBtn');

    const refreshPageBtn =
        document.getElementById('refreshPageBtn');


    /* =====================================================
       FILTER
    ===================================================== */

    function filterRows() {

        const search =
            searchInput
                ? searchInput.value
                    .trim()
                    .toLowerCase()
                : '';

        const selectedStatus =
            statusFilter
                ? statusFilter.value
                : 'all';


        let count = 0;


        rows.forEach(row => {

            const member =
                row.dataset.member || '';

            const status =
                row.dataset.status || '';


            const matchesSearch =
                member.includes(search);


            const matchesStatus =
                selectedStatus === 'all'
                || status === selectedStatus;


            if (
                matchesSearch
                && matchesStatus
            ) {

                row.style.display = '';

                count++;

            } else {

                row.style.display = 'none';

            }

        });


        if (visibleCount) {

            visibleCount.textContent = count;

        }

    }


    if (searchInput) {

        searchInput.addEventListener(
            'input',
            filterRows
        );

    }


    if (statusFilter) {

        statusFilter.addEventListener(
            'change',
            filterRows
        );

    }


    /* =====================================================
       REFRESH
    ===================================================== */

    function refreshPage() {

        window.location.reload();

    }


    if (refreshBtn) {

        refreshBtn.addEventListener(
            'click',
            refreshPage
        );

    }


    if (refreshPageBtn) {

        refreshPageBtn.addEventListener(
            'click',
            refreshPage
        );

    }


    /* =====================================================
       COUNTDOWN 48H
    ===================================================== */

    const deadlines =
        document.querySelectorAll(
            '.deadline[data-deadline]'
        );


    function updateCountdown() {

        deadlines.forEach(deadline => {

            const deadlineDate =
                new Date(
                    deadline.dataset.deadline
                );


            const now =
                new Date();


            const difference =
                deadlineDate.getTime()
                - now.getTime();


            const countdown =
                deadline.querySelector(
                    '.countdown'
                );


            if (!countdown) {
                return;
            }


            if (difference <= 0) {

                countdown.textContent =
                    'Délai expiré';

                deadline.classList.add(
                    'expired'
                );

                return;

            }


            const totalSeconds =
                Math.floor(
                    difference / 1000
                );


            const days =
                Math.floor(
                    totalSeconds / 86400
                );


            const hours =
                Math.floor(
                    (totalSeconds % 86400)
                    / 3600
                );


            const minutes =
                Math.floor(
                    (totalSeconds % 3600)
                    / 60
                );


            const seconds =
                totalSeconds % 60;


            let text = '';


            if (days > 0) {

                text += `${days}j `;

            }


            text +=
                `${String(hours).padStart(2, '0')}:` +
                `${String(minutes).padStart(2, '0')}:` +
                `${String(seconds).padStart(2, '0')}`;


            countdown.textContent =
                text;

        });

    }


    updateCountdown();


    setInterval(
        updateCountdown,
        1000
    );


    /* =====================================================
       CONFIRMATION FORM
    ===================================================== */

    const confirmForms =
        document.querySelectorAll(
            '.confirm-form'
        );


    confirmForms.forEach(form => {

        form.addEventListener(
            'submit',
            event => {

                const confirmed =
                    window.confirm(
                        'Voulez-vous confirmer la promotion de ce membre ?'
                    );


                if (!confirmed) {

                    event.preventDefault();

                }

            }
        );

    });


    /* =====================================================
       MODAL
    ===================================================== */

    const modal =
        document.getElementById(
            'detailsModal'
        );

    const closeModal =
        document.getElementById(
            'closeModal'
        );

    const closeModalBtn =
        document.getElementById(
            'closeModalBtn'
        );


    const modalAvatar =
        document.getElementById(
            'modalAvatar'
        );

    const modalMemberName =
        document.getElementById(
            'modalMemberName'
        );

    const modalMemberId =
        document.getElementById(
            'modalMemberId'
        );

    const modalActivity =
        document.getElementById(
            'modalActivity'
        );

    const modalPriority =
        document.getElementById(
            'modalPriority'
        );

    const modalStatus =
        document.getElementById(
            'modalStatus'
        );

    const modalCreated =
        document.getElementById(
            'modalCreated'
        );


    const detailButtons =
        document.querySelectorAll(
            '.details-btn'
        );


    detailButtons.forEach(button => {

        button.addEventListener(
            'click',
            () => {

                const member =
                    button.dataset.member || 'Membre';

                const memberId =
                    button.dataset.memberId || '-';

                const activityId =
                    button.dataset.activityId || '-';

                const priority =
                    button.dataset.priority || '0';

                const status =
                    button.dataset.status || '-';

                const created =
                    button.dataset.created || '-';


                modalMemberName.textContent =
                    member;

                modalMemberId.textContent =
                    `ID membre #${memberId}`;

                modalActivity.textContent =
                    `#${activityId}`;

                modalPriority.textContent =
                    priority;

                modalStatus.textContent =
                    status;

                modalCreated.textContent =
                    created;


                modalAvatar.textContent =
                    member
                        .charAt(0)
                        .toUpperCase();


                modal.classList.add(
                    'show'
                );

            }
        );

    });


    /* =====================================================
       CLOSE MODAL
    ===================================================== */

    function closeDetailsModal() {

        modal.classList.remove(
            'show'
        );

    }


    if (closeModal) {

        closeModal.addEventListener(
            'click',
            closeDetailsModal
        );

    }


    if (closeModalBtn) {

        closeModalBtn.addEventListener(
            'click',
            closeDetailsModal
        );

    }


    if (modal) {

        modal.addEventListener(
            'click',
            event => {

                if (
                    event.target === modal
                ) {

                    closeDetailsModal();

                }

            }
        );

    }


    document.addEventListener(
        'keydown',
        event => {

            if (
                event.key === 'Escape'
                && modal
                && modal.classList.contains('show')
            ) {

                closeDetailsModal();

            }

        }
    );


    /* =====================================================
       INITIAL FILTER
    ===================================================== */

    filterRows();

});