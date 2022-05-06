CREATE TABLE species_payout
(
    id uuid NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
    species_agreement_id uuid NOT NULL REFERENCES species_agreement(id),
    type varchar NOT NULL,
    scientific_name varchar NOT NULL,
    species_id uuid NOT NULL,
    payment numeric NOT NULL,
    payment_currency varchar NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    closed_at timestamptz,
    open boolean NOT NULL DEFAULT true
);
