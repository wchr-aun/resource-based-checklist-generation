DROP TABLE IF EXISTS evaluation;

CREATE TABLE IF NOT EXISTS evaluation (id VARCHAR NOT NULL, result JSON NOT NULL, task VARCHAR NOT NULL, time TIMESTAMP NOT NULL, PRIMARY KEY (id, task));