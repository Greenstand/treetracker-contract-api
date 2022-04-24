CREATE TABLE contract 
(
    id uuid NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
    agreement_id uuid NOT NULL REFERENCES agreement(id),
    worker_id uuid NOT NULL,
    status varchar NOT NULL DEFAULT 'unsigned',
    notes varchar,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    signed_at timestamptz,
    closed_at timestamptz,
    listed boolean NOT NULL DEFAULT true
);

CREATE TRIGGER update_updated_at
BEFORE UPDATE ON contract
FOR EACH ROW EXECUTE PROCEDURE update_updated_at();