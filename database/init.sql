DROP TABLE IF EXISTS datamodel, input_information_child_query, input_information_child, input_information_parent, components, templates, contracts, obstaclealerts, requestedservices, providers, patients, services, obstacles, staff, states;

CREATE TABLE IF NOT EXISTS states (idstate SERIAL UNIQUE, state VARCHAR NOT NULL, final INTEGER NOT NULL DEFAULT 0);
INSERT INTO states VALUES(0,'requested',0);
INSERT INTO states VALUES(1,'accepted',0);
INSERT INTO states VALUES(2,'rejected',1);
INSERT INTO states VALUES(3,'open/pending',0);
INSERT INTO states VALUES(4,'closed/completed',0);
INSERT INTO states VALUES(5,'checked/resolved',1);

CREATE TABLE IF NOT EXISTS staff (idstaff SERIAL UNIQUE, name VARCHAR NOT NULL, surname VARCHAR NOT NULL, dob VARCHAR NOT NULL, title VARCHAR);
INSERT INTO staff VALUES(1,'Petros','Papapa','25/03/1821','Dr.');
INSERT INTO staff VALUES(2,'John','Ophren','01/01/2012','Dr.');
INSERT INTO staff VALUES(3,'L','Ove','24/03/1821','Dr.');

CREATE TABLE IF NOT EXISTS obstacles (idobstacle SERIAL UNIQUE, name VARCHAR NOT NULL, description VARCHAR);
INSERT INTO obstacles VALUES(1,'Air Embolism','Description of an air embolism.');
INSERT INTO obstacles VALUES(2,'Heart Failure','Patient''s heart is failing.');

CREATE TABLE IF NOT EXISTS services (idservice SERIAL UNIQUE, name VARCHAR NOT NULL, description VARCHAR);
INSERT INTO services VALUES(1,'General Diagnosis','General diagnosis typically performed by a GP.');
INSERT INTO services VALUES(2,'Haemodialysis','Perform haemodialysis treatment to patient.');

CREATE TABLE IF NOT EXISTS patients (idpatient SERIAL UNIQUE, name VARCHAR NOT NULL, surname VARCHAR NOT NULL, dob VARCHAR NOT NULL);
INSERT INTO patients VALUES(1,'English','Patient','01/01/2012');
INSERT INTO patients VALUES(2,'French','Patient','13/11/2012');

CREATE TABLE IF NOT EXISTS providers (idprovider SERIAL UNIQUE, actorid INTEGER NOT NULL REFERENCES staff(idstaff), serviceid INTEGER NOT NULL REFERENCES services(idservice), level INTEGER NOT NULL default 0 );
INSERT INTO providers VALUES(1,1,1,8);
INSERT INTO providers VALUES(2,2,1,7);
INSERT INTO providers VALUES(3,3,1,6);
INSERT INTO providers VALUES(4,2,2,7);

CREATE TABLE IF NOT EXISTS requestedservices (idreqserv SERIAL UNIQUE, requesterid INTEGER NOT NULL REFERENCES staff(idstaff), serviceid INTEGER NOT NULL REFERENCES services(idservice), patientid INTEGER NOT NULL REFERENCES patients(idpatient), responsibleid INTEGER, date VARCHAR NOT NULL, type VARCHAR NOT NULL, stateid INTEGER NOT NULL, notes VARCHAR);
INSERT INTO requestedservices VALUES(21,1,1,1,2,'22/11/2012 11:09:34','ASSIGNMENT',5,'');
INSERT INTO requestedservices VALUES(22,1,1,1,2,'12/12/2012 16:18:24','ASSIGNMENT',5,'');
INSERT INTO requestedservices VALUES(23,1,1,1,NULL,'12/12/2012 17:19:52','ASSIGNMENT',4,'');

CREATE TABLE IF NOT EXISTS obstaclealerts (
	idalert SERIAL, 
	obstacleid INTEGER NOT NULL REFERENCES obstacles(idobstacle),
	reqservid INTEGER NOT NULL REFERENCES requestedservices(idreqserv), 
	providerid INTEGER NOT NULL REFERENCES providers(idprovider), 
	date VARCHAR NOT NULL, 
	stateid INTEGER NOT NULL REFERENCES states(idstate), 
	notes VARCHAR
	);
INSERT INTO obstaclealerts VALUES(1,2,21,2,'16/11/2012 18:11:19',3,'');

CREATE TABLE IF NOT EXISTS contracts (idcontract SERIAL UNIQUE, reqservid INTEGER NOT NULL REFERENCES requestedservices(idreqserv), providerid INTEGER REFERENCES providers(idprovider), time_requested VARCHAR NOT NULL, time_opened VARCHAR, time_closed VARCHAR, stateid INTEGER NOT NULL REFERENCES states(idstate));
INSERT INTO contracts VALUES(24,21,2,'22/11/2012 11:09:35','22/11/2012 12:03:53','22/11/2012 12:05:46',5);
INSERT INTO contracts VALUES(25,22,2,'12/12/2012 16:18:24','12/12/2012 16:19:16','12/12/2012 16:19:52',5);
INSERT INTO contracts VALUES(26,23,2,'12/12/2012 17:19:52','12/12/2012 17:24:43',NULL,3);

CREATE TABLE IF NOT EXISTS datamodel (name VARCHAR NOT NULL, "table" VARCHAR NOT NULL, field VARCHAR NOT NULL, PRIMARY KEY (name, "table", field));

INSERT INTO datamodel VALUES('AcceptedContract', 'contracts', 'idcontract');
INSERT INTO datamodel VALUES('AcceptedContract', 'contracts', 'reqservid');
INSERT INTO datamodel VALUES('AcceptedContract', 'contracts', 'providerid');
INSERT INTO datamodel VALUES('AcceptedContract', 'contracts', 'time_requested');
INSERT INTO datamodel VALUES('AcceptedContract', 'contracts', 'stateid');

INSERT INTO datamodel VALUES('ServiceProvider', 'providers', 'idprovider');
INSERT INTO datamodel VALUES('ServiceProvider', 'providers', 'actorid');
INSERT INTO datamodel VALUES('ServiceProvider', 'providers', 'serviceid');
INSERT INTO datamodel VALUES('ServiceProvider', 'providers', 'level');

INSERT INTO datamodel VALUES('OpenContract', 'contracts', 'idcontract');
INSERT INTO datamodel VALUES('OpenContract', 'contracts', 'reqservid');
INSERT INTO datamodel VALUES('OpenContract', 'contracts', 'providerid');
INSERT INTO datamodel VALUES('OpenContract', 'contracts', 'time_requested');
INSERT INTO datamodel VALUES('OpenContract', 'contracts', 'time_opened');
INSERT INTO datamodel VALUES('OpenContract', 'contracts', 'stateid');

INSERT INTO datamodel VALUES('ClosedContract', 'contracts', 'idcontract');
INSERT INTO datamodel VALUES('ClosedContract', 'contracts', 'reqservid');
INSERT INTO datamodel VALUES('ClosedContract', 'contracts', 'providerid');
INSERT INTO datamodel VALUES('ClosedContract', 'contracts', 'time_requested');
INSERT INTO datamodel VALUES('ClosedContract', 'contracts', 'time_opened');
INSERT INTO datamodel VALUES('ClosedContract', 'contracts', 'time_closed');
INSERT INTO datamodel VALUES('ClosedContract', 'contracts', 'stateid');

INSERT INTO datamodel VALUES('Patient', 'patients', 'idpatient');
INSERT INTO datamodel VALUES('Patient', 'patients', 'name');
INSERT INTO datamodel VALUES('Patient', 'patients', 'surname');
INSERT INTO datamodel VALUES('Patient', 'patients', 'dob');

INSERT INTO datamodel VALUES('CheckedHealthcareService', 'services', 'idservice');
INSERT INTO datamodel VALUES('CheckedHealthcareService', 'services', 'name');
INSERT INTO datamodel VALUES('CheckedHealthcareService', 'services', 'description');

INSERT INTO datamodel VALUES('HealthcareService', 'services', 'idservice');
INSERT INTO datamodel VALUES('HealthcareService', 'services', 'name');
INSERT INTO datamodel VALUES('HealthcareService', 'services', 'description');

INSERT INTO datamodel VALUES('HealthcareActor', 'services', 'idstaff');
INSERT INTO datamodel VALUES('HealthcareActor', 'services', 'name');
INSERT INTO datamodel VALUES('HealthcareActor', 'services', 'surname');
INSERT INTO datamodel VALUES('HealthcareActor', 'services', 'dob');
INSERT INTO datamodel VALUES('HealthcareActor', 'services', 'title');

CREATE TABLE templates (id SERIAL UNIQUE, "name" VARCHAR NOT NULL, created TIMESTAMP NOT NULL, updated TIMESTAMP NOT NULL);

CREATE TABLE components (id SERIAL UNIQUE, template_id INTEGER REFERENCES templates(id) NOT NULL, input_dep VARCHAR, input_dep_field VARCHAR, output_dep VARCHAR, output_dep_field VARCHAR, "order" INTEGER NOT NULL, "name" VARCHAR NOT NULL, type VARCHAR NOT NULL, required BOOLEAN DEFAULT true, hide BOOLEAN DEFAULT false, validation VARCHAR, function VARCHAR, parent INTEGER REFERENCES components(id));

CREATE TABLE input_information_parent (id SERIAL UNIQUE, name VARCHAR NOT NULL, "order" INTEGER NOT NULL, template_id INTEGER NOT NULL REFERENCES templates(id));

CREATE TABLE input_information_child (id SERIAL UNIQUE, name VARCHAR NOT NULL, "order" INTEGER NOT NULL, input_dep VARCHAR, input_dep_field VARCHAR, hide BOOLEAN DEFAULT false, parent_id INTEGER NOT NULL REFERENCES input_information_parent(id));

CREATE TABLE input_information_child_query (id SERIAL UNIQUE, foreign_key VARCHAR NOT NULL, query_table VARCHAR NOT NULL, query_field VARCHAR NOT NULL, details_id INTEGER NOT NULL REFERENCES input_information_child(id));