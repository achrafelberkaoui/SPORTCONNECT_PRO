function calculateAge(dateOfBirth, referenceDate = new Date()) {
    const birthDate = new Date(dateOfBirth);

    let age = referenceDate.getFullYear() - birthDate.getFullYear();

    const monthDifference =
        referenceDate.getMonth() - birthDate.getMonth();

    if(monthDifference < 0 || (monthDifference === 0 && referenceDate.getDate() < birthDate.getDate())) {
        age--;
    }

    return age;
}

function getAgeCategory(dateOfBirth, seasonEndDate) {
    const age = calculateAge(dateOfBirth,seasonEndDate);

    if (age < 6) {
        return 'Éveil / Baby-Sport';
    }

    if (age <= 8) {
        return 'U9';
    }

    if (age <= 10) {
        return 'U11';
    }

    if (age <= 12) {
        return 'U13';
    }

    if (age <= 14) {
        return 'U15';
    }

    if (age <= 17) {
        return 'U18';
    }

    if (age <= 39) {
        return 'Senior';
    }

    return 'Vétéran / Master';
}

function isMedicalCertificateValid(certificateDate,activityName,referenceDate = new Date()) {
    if (!certificateDate) {
        return false;
    }

    const certificate = new Date(certificateDate);

const validityYears =/boxe|plongée|rugby/i.test(activityName) ? 1 : 3;

const expirationDate = new Date(certificate);

expirationDate.setFullYear(
    expirationDate.getFullYear() + validityYears
);
console.log(expirationDate);
console.log(referenceDate);

    return referenceDate <= expirationDate;
}


function checkAgeEligibility(
    dateOfBirth,
    minAge,
    maxAge,
    allPublics,
    seasonEndDate
) {
    if (allPublics) {
        return true;
    }

    const age = calculateAge(
        dateOfBirth,
        seasonEndDate
    );

    return age >= minAge && age <= maxAge;
}

function checkMedicalCompliance(
    certificateDate,
    activityName,
    referenceDate = new Date()
) {
    if (!certificateDate) {
        return {
            valid: false,
            status: 'medical_non_compliant'
        };
    }

    const valid = isMedicalCertificateValid(
        certificateDate,
        activityName,
        referenceDate
    );

    return {
        valid,
        status: valid
            ? 'compliant'
            : 'medical_non_compliant'
    };
}

module.exports = {
    calculateAge,
    getAgeCategory,
    isMedicalCertificateValid,
    checkAgeEligibility,
    checkMedicalCompliance
};