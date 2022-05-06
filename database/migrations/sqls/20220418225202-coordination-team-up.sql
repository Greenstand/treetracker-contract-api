CREATE TABLE coordination_team 
(
    id uuid NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id uuid NOT NULL,
    name varchar NOT NULL,
    description varchar,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    listed boolean NOT NULL DEFAULT true
);


CREATE TRIGGER update_updated_at
BEFORE UPDATE ON coordination_team
FOR EACH ROW EXECUTE PROCEDURE update_updated_at();