CREATE TYPE species_type as ENUM ('other', 'any', 'specific', 'genus');

CREATE TABLE species_payout
(
    id uuid NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
    species_agreement_id uuid REFERENCES species_agreement(id),
    type species_type NOT NULL,
    scientific_name varchar NOT NULL,
    species_id uuid NOT NULL,
    payment numeric NOT NULL,
    payment_currency varchar NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    closed_at timestamptz,
    open boolean NOT NULL DEFAULT true
);
