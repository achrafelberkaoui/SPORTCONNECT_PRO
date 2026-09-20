const eligibility = require('./services/eligibilityService');

const today = new Date('2026-09-20');
const seasonEnd = new Date('2026-12-31');

console.log('--- TEST ÂGE ---');

console.log(
    '2010-05-10 :',
    eligibility.calculateAge(
        '2010-05-10',
        seasonEnd
    )
);

console.log(
    'Catégorie :',
    eligibility.getAgeCategory(
        '2010-05-10',
        seasonEnd
    )
);


console.log('\n--- TEST CERTIFICAT ---');

console.log(
    'Football - certificat récent :',
    eligibility.isMedicalCertificateValid(
        '2025-09-20',
        'Football',
        today
    )
);

console.log(
    'Football - certificat ancien :',
    eligibility.isMedicalCertificateValid(
        '2022-01-01',
        'Football',
        today
    )
);

console.log(
    'Boxing - certificat récent :',
    eligibility.isMedicalCertificateValid(
        '2026-01-01',
        'Boxing',
        today
    )
);

console.log(
    'Boxing - certificat ancien :',
    eligibility.isMedicalCertificateValid(
        '2024-01-01',
        'Boxing',
        today
    )
);


console.log('\n--- TEST MEDICAL COMPLIANCE ---');

console.log(
    eligibility.checkMedicalCompliance(
        '2025-09-20',
        'Football',
        today
    )
);

console.log(
    eligibility.checkMedicalCompliance(
        null,
        'Football',
        today
    )
);


console.log('\n--- TEST ÂGE ACTIVITÉ ---');

console.log(
    '16 ans / activité 15-17 :',
    eligibility.checkAgeEligibility(
        '2010-05-10',
        15,
        17,
        false,
        seasonEnd
    )
);

console.log(
    '16 ans / activité 18-39 :',
    eligibility.checkAgeEligibility(
        '2010-05-10',
        18,
        39,
        false,
        seasonEnd
    )
);

console.log(
    '16 ans / Tous publics :',
    eligibility.checkAgeEligibility(
        '2010-05-10',
        18,
        39,
        true,
        seasonEnd
    )
);