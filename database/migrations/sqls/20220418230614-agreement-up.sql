CREATE TABLE agreement
(
    id uuid NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
    type varchar NOT NULL,
    owner_id uuid NOT NULL,
    funder_id uuid NOT NULL,
    growing_organization_id uuid,
    coordination_team_id uuid REFERENCES coordination_team(id),
    species_agreement_id uuid REFERENCES species_agreement(id),
    consolidation_rule_id uuid NOT NULL REFERENCES consolidation_rule(id),
    name varchar NOT NULL,
    description varchar,
    capture_payment numeric,
    capture_payment_currency varchar,
    max_captures integer,
    status varchar NOT NULL DEFAULT 'planning',
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    opened_at timestamptz,
    closed_at timestamptz,
    listed boolean NOT NULL DEFAULT true
);

CREATE TRIGGER update_updated_at
BEFORE UPDATE ON agreement
FOR EACH ROW EXECUTE PROCEDURE update_updated_at();