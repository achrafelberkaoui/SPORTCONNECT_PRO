CREATE TABLE families (
    id SERIAL PRIMARY KEY,
    family_name VARCHAR(100) NOT NULL,
    quotient_familial NUMERIC(10,2) CHECK (quotient_familial >= 0)
);

CREATE TABLE members (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    is_resident BOOLEAN NOT NULL DEFAULT TRUE,
    family_id INTEGER REFERENCES families(id) ON DELETE SET NULL,
    medical_certificate_date DATE,
    pass_sport_code VARCHAR(100)
);


CREATE TABLE facilities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    type VARCHAR(100) NOT NULL,
    erp_capacity INTEGER NOT NULL CHECK (erp_capacity > 0)
);


CREATE TABLE associations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL UNIQUE,
    description TEXT
);


CREATE TABLE activities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    base_price NUMERIC(10,2) NOT NULL CHECK (base_price >= 0),
    max_capacity INTEGER NOT NULL CHECK (max_capacity > 0),
    activity_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    min_age INTEGER CHECK (min_age >= 0),
    max_age INTEGER CHECK (max_age >= min_age),
    all_publics BOOLEAN NOT NULL DEFAULT FALSE,
    association_id INTEGER NOT NULL REFERENCES associations(id) ON DELETE RESTRICT,
    facility_id INTEGER NOT NULL REFERENCES facilities(id) ON DELETE RESTRICT,
    CHECK (end_time > start_time)
);

CREATE TABLE registrations (
    id SERIAL PRIMARY KEY,
    member_id INTEGER NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    activity_id INTEGER NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
    final_price NUMERIC(10,2) NOT NULL CHECK (final_price >= 15.00),
    payment_plan VARCHAR(10) NOT NULL DEFAULT '1x' CHECK (payment_plan IN ('1x', '3x')),
    status VARCHAR(30) NOT NULL DEFAULT 'confirmed' CHECK (
            status IN (
                'confirmed',
                'cancelled',
                'medical_non_compliant'
            )
        ),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_member_activity UNIQUE (member_id, activity_id)
);



CREATE TABLE waiting_list (
    id SERIAL PRIMARY KEY,
    activity_id INTEGER NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
    member_id INTEGER NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    priority_score INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(30) NOT NULL DEFAULT 'waiting'
        CHECK (
            status IN (
                'waiting',
                'promoted_pending',
                'confirmed',
                'expired',
                'cancelled'
            )
        ),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deadline_confirmation TIMESTAMP, CONSTRAINT unique_waiting_member_activity UNIQUE (member_id, activity_id)
);

CREATE INDEX idx_registrations_activity
ON registrations(activity_id);

CREATE INDEX idx_registrations_member
ON registrations(member_id);

CREATE INDEX idx_registrations_activity_status
ON registrations(activity_id, status);


CREATE INDEX idx_waiting_activity
ON waiting_list(activity_id);

CREATE INDEX idx_waiting_priority
ON waiting_list(activity_id, status, priority_score, created_at);


CREATE INDEX idx_activities_facility
ON activities(facility_id);

CREATE INDEX idx_activities_schedule
ON activities(
    facility_id,
    activity_date,
    start_time,
    end_time
);

