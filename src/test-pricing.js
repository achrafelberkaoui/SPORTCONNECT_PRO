const {
    calculatePricing,
    calculatePaymentPlan
} = require('./services/pricingService');

const price = calculatePricing({
    basePrice: 100,
    isResident: true,
    familyRank: 2,
    quotientFamilial: 500,
    hasValidPassSport: true
});

console.log('Prix final :', price);

console.log(
    'Paiement 1x :',
    calculatePaymentPlan(price, '1x')
);

console.log(
    'Paiement 3x :',
    calculatePaymentPlan(price, '3x')
);