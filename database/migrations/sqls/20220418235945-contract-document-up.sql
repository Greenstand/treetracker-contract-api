CREATE TABLE contract_document
(
    id uuid NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
    contract_id uuid NOT NULL REFERENCES contract(id),
    document_id uuid NOT NULL REFERENCES document(id),
    created_at timestamptz NOT NULL DEFAULT now(),
    listed boolean NOT NULL DEFAULT true
);