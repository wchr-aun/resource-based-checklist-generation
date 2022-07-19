DROP TABLE IF EXISTS evaluation, datamodel, models, input_information_child_query, input_information_child, input_information_parent, components, templates;

CREATE TABLE IF NOT EXISTS evaluation (id VARCHAR NOT NULL, result JSON NOT NULL, task VARCHAR NOT NULL, time TIMESTAMP NOT NULL, PRIMARY KEY (id, task));

CREATE TABLE IF NOT EXISTS models (name VARCHAR UNIQUE NOT NULL, "desc" VARCHAR NOT NULL);

CREATE TABLE IF NOT EXISTS datamodel (name VARCHAR NOT NULL REFERENCES models(name), "table" VARCHAR NOT NULL, field VARCHAR NOT NULL, PRIMARY KEY (name, "table", field));

CREATE TABLE templates (id SERIAL UNIQUE, name VARCHAR NOT NULL, created TIMESTAMP NOT NULL, updated TIMESTAMP NOT NULL, process_name VARCHAR NOT NULL);

CREATE TABLE components (id SERIAL UNIQUE, template_id INTEGER REFERENCES templates(id) ON DELETE CASCADE NOT NULL, input_dep VARCHAR, input_dep_field VARCHAR, output_dep VARCHAR, output_dep_field VARCHAR, "order" INTEGER NOT NULL, "name" VARCHAR NOT NULL, type VARCHAR NOT NULL, required BOOLEAN DEFAULT true, hide BOOLEAN DEFAULT false, validation VARCHAR, function VARCHAR, parent INTEGER REFERENCES components(id) ON DELETE CASCADE);

CREATE TABLE input_information_parent (id SERIAL UNIQUE, name VARCHAR NOT NULL, "order" INTEGER NOT NULL, input_dep VARCHAR REFERENCES models(name), template_id INTEGER NOT NULL REFERENCES templates(id) ON DELETE CASCADE);

CREATE TABLE input_information_child (id SERIAL UNIQUE, name VARCHAR NOT NULL, "order" INTEGER NOT NULL, input_dep_field VARCHAR, hide BOOLEAN DEFAULT false, parent_id INTEGER NOT NULL REFERENCES input_information_parent(id) ON DELETE CASCADE);

CREATE TABLE input_information_child_query (id SERIAL UNIQUE, foreign_table VARCHAR NOT NULL, foreign_key VARCHAR NOT NULL, query_table VARCHAR NOT NULL, query_field VARCHAR NOT NULL, is_array BOOLEAN DEFAULT false, details_id INTEGER NOT NULL REFERENCES input_information_child(id) ON DELETE CASCADE);