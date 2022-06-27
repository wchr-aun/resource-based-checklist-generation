CREATE TABLE IF NOT EXISTS states (idstate SERIAL, state TEXT NOT NULL, final INTEGER NOT NULL DEFAULT 0);
INSERT INTO states VALUES(0,'requested',0);
INSERT INTO states VALUES(1,'accepted',0);
INSERT INTO states VALUES(2,'rejected',1);
INSERT INTO states VALUES(3,'open/pending',0);
INSERT INTO states VALUES(4,'closed/completed',0);
INSERT INTO states VALUES(5,'checked/resolved',1);
CREATE TABLE IF NOT EXISTS providers (idprovider SERIAL, actorid INTEGER NOT NULL, serviceid INTEGER NOT NULL, level INTEGER NOT NULL default 0 );
INSERT INTO providers VALUES(1,1,1,8);
INSERT INTO providers VALUES(2,2,1,7);
INSERT INTO providers VALUES(3,3,1,6);
INSERT INTO providers VALUES(4,2,2,7);
CREATE TABLE IF NOT EXISTS contracts (idcontract SERIAL, reqservid INTEGER NOT NULL, providerid INTEGER, time_requested TEXT NOT NULL, time_opened TEXT, time_closed TEXT, stateid INTEGER NOT NULL);
INSERT INTO contracts VALUES(24,21,2,'22/11/2012 11:09:35','22/11/2012 12:03:53','22/11/2012 12:05:46',5);
INSERT INTO contracts VALUES(25,22,2,'12/12/2012 16:18:24','12/12/2012 16:19:16','12/12/2012 16:19:52',5);
INSERT INTO contracts VALUES(26,23,2,'12/12/2012 17:19:52','12/12/2012 17:24:43',NULL,3);
CREATE TABLE IF NOT EXISTS staff (idstaff SERIAL, name TEXT NOT NULL, surname TEXT NOT NULL, dob TEXT NOT NULL, title TEXT);
INSERT INTO staff VALUES(1,'Petros','Papapa','25/03/1821','Dr.');
INSERT INTO staff VALUES(2,'John','Ophren','01/01/2012','Dr.');
INSERT INTO staff VALUES(3,'L','Ove','24/03/1821','Dr.');
CREATE TABLE IF NOT EXISTS obstacles (idobstacle SERIAL, name TEXT NOT NULL, description TEXT);
INSERT INTO obstacles VALUES(1,'Air Embolism','Description of an air embolism.');
INSERT INTO obstacles VALUES(2,'Heart Failure','Patient''s heart is failing.');
CREATE TABLE IF NOT EXISTS services (idservice SERIAL, name TEXT NOT NULL, description TEXT);
INSERT INTO services VALUES(1,'General Diagnosis','General diagnosis typically performed by a GP.');
INSERT INTO services VALUES(2,'Haemodialysis','Perform haemodialysis treatment to patient.');
CREATE TABLE IF NOT EXISTS patients (idpatient SERIAL, name TEXT NOT NULL, surname TEXT NOT NULL, dob TEXT NOT NULL);
INSERT INTO patients VALUES(1,'English','Patient','01/01/2012');
INSERT INTO patients VALUES(2,'French','Patient','13/11/2012');
CREATE TABLE IF NOT EXISTS obstaclealerts (
	idalert SERIAL, 
	obstacleid INTEGER NOT NULL,
	reqservid INTEGER NOT NULL, 
	providerid INTEGER NOT NULL, 
	date TEXT NOT NULL, 
	stateid INTEGER NOT NULL, 
	notes TEXT
	);
INSERT INTO obstaclealerts VALUES(1,2,15,2,'16/11/2012 18:11:19',3,'');
CREATE TABLE IF NOT EXISTS requestedservices (idreqserv SERIAL, requesterid INTEGER NOT NULL, serviceid INTEGER NOT NULL, patientid INTEGER NOT NULL, responsibleid INTEGER, date TEXT NOT NULL, type TEXT NOT NULL, stateid INTEGER NOT NULL, notes TEXT);
INSERT INTO requestedservices VALUES(21,1,1,1,2,'22/11/2012 11:09:34','ASSIGNMENT',5,'');
INSERT INTO requestedservices VALUES(22,1,1,1,2,'12/12/2012 16:18:24','ASSIGNMENT',5,'');
INSERT INTO requestedservices VALUES(23,1,1,1,NULL,'12/12/2012 17:19:52','ASSIGNMENT',4,'');

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