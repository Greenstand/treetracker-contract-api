CREATE TABLE species_agreement
(
    id uuid NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id uuid NOT NULL,
    variable_species_payout boolean NOT NULL DEFAULT false,
    name varchar NOT NULL,
    description varchar,
    created_at timestamptz NOT NULL DEFAULT now(),
    listed boolean NOT NULL DEFAULT true
);
