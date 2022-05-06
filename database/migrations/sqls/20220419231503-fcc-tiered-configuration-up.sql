CREATE TABLE fcc_tiered_configuration 
(
    id uuid NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
    start_date timestamptz NOT NULL,
    end_date timestamptz NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    active boolean NOT NULL DEFAULT true
);