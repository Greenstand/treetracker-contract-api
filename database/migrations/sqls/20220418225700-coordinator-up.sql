CREATE TABLE coordinator 
(
    id uuid NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
    stakeholder_id uuid NOT NULL,
    coordinator_team_id uuid NOT NULL REFERENCES coordination_team(id),
    coordinator_id uuid REFERENCES coordinator(id),
    role varchar NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    active boolean NOT NULL DEFAULT true
);

CREATE TRIGGER update_updated_at
BEFORE UPDATE ON coordinator
FOR EACH ROW EXECUTE PROCEDURE update_updated_at();