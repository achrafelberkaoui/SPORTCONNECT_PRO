document.addEventListener('DOMContentLoaded', () => {

    const moduleCards = document.querySelectorAll('.module-card');

    moduleCards.forEach(card => {

        card.addEventListener('mouseenter', () => {
            card.classList.add('hovered');
        });

        card.addEventListener('mouseleave', () => {
            card.classList.remove('hovered');
        });

    });

});