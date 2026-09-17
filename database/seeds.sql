-- =========================================================
-- SPORTCONNECT PRO
-- Données de test - seeds.sql
-- =========================================================

-- =========================================================
-- 1. FAMILLES
-- =========================================================

INSERT INTO families (family_name, quotient_familial) VALUES
('Famille Benali', 450.00),
('Famille El Amrani', 650.00),
('Famille Alaoui', 850.00),
('Famille Idrissi', 1100.00),
('Famille Haddad', 580.00);


-- =========================================================
-- 2. MEMBRES
-- =========================================================

INSERT INTO members (
    first_name,
    last_name,
    date_of_birth,
    is_resident,
    family_id,
    medical_certificate_date,
    pass_sport_code
) VALUES

-- Famille Benali
(
    'Yassine',
    'Benali',
    '2015-04-12',
    TRUE,
    1,
    '2026-01-15',
    'PASS-2026-YASSINE'
),
(
    'Adam',
    'Benali',
    '2012-08-20',
    TRUE,
    1,
    '2025-09-10',
    NULL
),
(
    'Sara',
    'Benali',
    '2008-02-15',
    TRUE,
    1,
    '2026-02-20',
    NULL
),

-- Famille El Amrani
(
    'Omar',
    'El Amrani',
    '2014-06-10',
    TRUE,
    2,
    '2025-10-05',
    'PASS-2026-OMAR'
),
(
    'Lina',
    'El Amrani',
    '2017-11-03',
    TRUE,
    2,
    '2026-03-12',
    NULL
),

-- Famille Alaoui
(
    'Mehdi',
    'Alaoui',
    '2004-05-18',
    TRUE,
    3,
    '2026-01-25',
    NULL
),
(
    'Nora',
    'Alaoui',
    '1985-09-22',
    TRUE,
    3,
    '2024-11-10',
    NULL
),

-- Famille Idrissi
(
    'Karim',
    'Idrissi',
    '1998-03-14',
    FALSE,
    4,
    '2026-02-01',
    NULL
),
(
    'Imane',
    'Idrissi',
    '2006-12-09',
    FALSE,
    4,
    '2025-12-15',
    'PASS-2026-IMANE'
),

-- Famille Haddad
(
    'Rayan',
    'Haddad',
    '2010-07-25',
    TRUE,
    5,
    '2026-04-05',
    NULL
);


-- =========================================================
-- 3. INFRASTRUCTURES
-- =========================================================

INSERT INTO facilities (
    name,
    type,
    erp_capacity
) VALUES
(
    'Complexe Sportif Municipal',
    'Gymnase',
    100
),
(
    'Piscine Municipale',
    'Piscine',
    80
),
(
    'Stade Municipal',
    'Stade',
    300
),
(
    'Salle de Boxe',
    'Salle spécialisée',
    40
),
(
    'Dojo Municipal',
    'Salle spécialisée',
    50
);


-- =========================================================
-- 4. ASSOCIATIONS
-- =========================================================

INSERT INTO associations (
    name,
    description
) VALUES
(
    'Club Sportif Municipal',
    'Association partenaire proposant plusieurs activités sportives.'
),
(
    'Association Natation Plus',
    'Association spécialisée dans les activités aquatiques.'
),
(
    'Rugby Club Municipal',
    'Club de rugby partenaire de la Direction des Sports.'
),
(
    'Boxing Club',
    'Association spécialisée dans la boxe.'
),
(
    'Judo Association',
    'Association sportive spécialisée dans le judo.'
);


-- =========================================================
-- 5. ACTIVITÉS
-- =========================================================

INSERT INTO activities (
    name,
    base_price,
    max_capacity,
    activity_date,
    start_time,
    end_time,
    min_age,
    max_age,
    all_publics,
    association_id,
    facility_id
) VALUES

-- Complexe Sportif Municipal
(
    'Football U11',
    120.00,
    20,
    '2026-09-16',
    '14:00',
    '15:30',
    9,
    10,
    FALSE,
    1,
    1
),
(
    'Basketball U15',
    150.00,
    25,
    '2026-09-16',
    '16:00',
    '17:30',
    13,
    14,
    FALSE,
    1,
    1
),
(
    'Fitness Adultes',
    100.00,
    30,
    '2026-09-17',
    '18:00',
    '19:00',
    18,
    39,
    FALSE,
    1,
    1
),

-- Piscine
(
    'Natation Enfants',
    130.00,
    15,
    '2026-09-17',
    '14:00',
    '15:00',
    7,
    12,
    FALSE,
    2,
    2
),
(
    'Natation Tous Publics',
    100.00,
    40,
    '2026-09-18',
    '18:00',
    '19:00',
    NULL,
    NULL,
    TRUE,
    2,
    2
),

-- Stade
(
    'Rugby U18',
    180.00,
    30,
    '2026-09-19',
    '10:00',
    '12:00',
    15,
    17,
    FALSE,
    3,
    3
),

-- Salle de Boxe
(
    'Boxe Jeunes',
    160.00,
    20,
    '2026-09-19',
    '14:00',
    '15:30',
    13,
    17,
    FALSE,
    4,
    4
),

-- Dojo
(
    'Judo U13',
    140.00,
    20,
    '2026-09-20',
    '10:00',
    '11:30',
    11,
    12,
    FALSE,
    5,
    5
);


-- =========================================================
-- 6. INSCRIPTIONS
-- =========================================================

INSERT INTO registrations (
    member_id,
    activity_id,
    final_price,
    payment_plan,
    status
) VALUES

-- Football U11
(
    1,
    1,
    72.00,
    '1x',
    'confirmed'
),
(
    4,
    1,
    72.00,
    '3x',
    'confirmed'
),

-- Basketball U15
(
    3,
    2,
    127.50,
    '1x',
    'confirmed'
),

-- Fitness Adultes
(
    6,
    3,
    100.00,
    '1x',
    'confirmed'
),

-- Natation enfants
(
    2,
    4,
    110.50,
    '3x',
    'confirmed'
),

-- Rugby
(
    9,
    6,
    180.00,
    '1x',
    'confirmed'
);


-- =========================================================
-- 7. LISTE D'ATTENTE
-- =========================================================

INSERT INTO waiting_list (
    activity_id,
    member_id,
    priority_score,
    status,
    deadline_confirmation
) VALUES

(
    1,
    5,
    10,
    'waiting',
    NULL
),
(
    1,
    7,
    0,
    'waiting',
    NULL
),
(
    2,
    10,
    10,
    'waiting',
    NULL
);


-- =========================================================
-- FIN DES SEEDS
-- =========================================================