CREATE TABLE document 
(
    id uuid NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
    name varchar NOT NULL,
    description varchar,
    version integer NOT NULL DEFAULT 1,
    hardcopy_url varchar NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    listed boolean NOT NULL DEFAULT true
);