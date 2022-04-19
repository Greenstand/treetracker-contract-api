CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE consolidation_rule
(
    id uuid NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id uuid NOT NULL,
    name varchar NOT NULL,
    lambda varchar NOT NULL,
    parameters jsonb,
    created_at timestamptz NOT NULL DEFAULT now(),
    listed boolean NOT NULL DEFAULT true
);

