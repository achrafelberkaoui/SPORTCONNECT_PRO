function calculatePricing({
    basePrice,
    isResident,
    familyRank = 1,
    quotientFamilial = null,
    hasValidPassSport = false
}) {
    let price = Number(basePrice);

    if (!isResident) {
        price *= 1.35;
    }

    if (familyRank === 2) {
        price *= 0.85;
    } else if (familyRank >= 3) {
        price *= 0.70;
    }

    if (quotientFamilial !== null) {
        if (quotientFamilial < 600) {
            price *= 0.60;
        } else if (quotientFamilial <= 900) {
            price *= 0.80;
        }
    }

    if (hasValidPassSport) {
        price -= 50;
    }

    price = Math.max(price, 15);

    price = Math.round(price * 100) / 100;

    return price;
}

function calculatePaymentPlan(price, plan = '1x') {
    if (plan === '1x') {
        return {
            firstPayment: price,
            secondPayment: null,
            thirdPayment: null
        };
    }

    if (plan === '3x') {
        const firstPayment =
            Math.round((price * 0.40) * 100) / 100;

        const secondPayment =
            Math.round((price * 0.30) * 100) / 100;

        const thirdPayment = Math.round((price - firstPayment - secondPayment) * 100 ) / 100;

        return {
            firstPayment,
            secondPayment,
            thirdPayment
        };
    }

    throw new Error('Plan de paiement invalide');
}

async function getPricingData(memberId, activityId) {
    const pool = require('../config/db');

    const result = await pool.query(
        `SELECT
            members.id AS member_id,
            members.is_resident,
            members.family_id,
            members.pass_sport_code,
            activities.base_price,
            families.quotient_familial
         FROM members
         JOIN activities
            ON activities.id = $2
         LEFT JOIN families
            ON families.id = members.family_id
         WHERE members.id = $1`,
        [memberId, activityId]
    );

    if (result.rows.length === 0) {
        throw new Error('Membre introuvable');
    }

    return result.rows[0];
}

module.exports = {
    calculatePricing,
    calculatePaymentPlan,
    getPricingData
};