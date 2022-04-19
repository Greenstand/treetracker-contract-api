CREATE TABLE agreement_region
(
    id uuid NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
    agreement_id uuid NOT NULL REFERENCES agreement(id),
    region_id uuid NOT NULL,
    name varchar NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    closed_at timestamptz,
    listed boolean NOT NULL DEFAULT true
);