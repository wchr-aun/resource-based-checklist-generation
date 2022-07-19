DROP TABLE IF EXISTS contracts, obstaclealerts, requestedservices, providers, patients, services, obstacles, staff, states;

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

CREATE TABLE IF NOT EXISTS requestedservices (idreqserv SERIAL UNIQUE, requesterid INTEGER NOT NULL REFERENCES staff(idstaff), serviceid INTEGER NOT NULL REFERENCES services(idservice), patientid INTEGER NOT NULL REFERENCES patients(idpatient), responsibleid INTEGER REFERENCES staff(idstaff), date VARCHAR NOT NULL, type VARCHAR NOT NULL, stateid INTEGER NOT NULL REFERENCES states(idstate), notes VARCHAR);
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

INSERT INTO models VALUES('AcceptedContract', 'description');
INSERT INTO models VALUES('ServiceProvider', 'description');
INSERT INTO models VALUES('OpenContract', 'description');
INSERT INTO models VALUES('ClosedContract', 'description');
INSERT INTO models VALUES('Patient', 'description');
INSERT INTO models VALUES('CheckedHealthcareService', 'description');
INSERT INTO models VALUES('HealthcareService', 'description');
INSERT INTO models VALUES('HealthcareActor', 'description');
INSERT INTO models VALUES('PendingHealthcareService', 'description');
INSERT INTO models VALUES('Obstacle', 'description');
INSERT INTO models VALUES('Delegation', 'description');
INSERT INTO models VALUES('ServiceRequester', 'description');
INSERT INTO models VALUES('RejectedContract', 'description');
INSERT INTO models VALUES('RequestedContract', 'description');
INSERT INTO models VALUES('CompletedHealthcareService', 'description');
INSERT INTO models VALUES('Assignment', 'description');

INSERT INTO datamodel VALUES('AcceptedContract', 'contracts', 'idcontract');
INSERT INTO datamodel VALUES('AcceptedContract', 'contracts', 'reqservid');
INSERT INTO datamodel VALUES('AcceptedContract', 'contracts', 'providerid');
INSERT INTO datamodel VALUES('AcceptedContract', 'contracts', 'time_requested');
INSERT INTO datamodel VALUES('AcceptedContract', 'contracts', 'stateid');

INSERT INTO datamodel VALUES('RequestedContract', 'contracts', 'idcontract');
INSERT INTO datamodel VALUES('RequestedContract', 'contracts', 'reqservid');
INSERT INTO datamodel VALUES('RequestedContract', 'contracts', 'time_requested');
INSERT INTO datamodel VALUES('RequestedContract', 'contracts', 'stateid');

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

INSERT INTO datamodel VALUES('RejectedContract', 'contracts', 'idcontract');
INSERT INTO datamodel VALUES('RejectedContract', 'contracts', 'reqservid');
INSERT INTO datamodel VALUES('RejectedContract', 'contracts', 'providerid');
INSERT INTO datamodel VALUES('RejectedContract', 'contracts', 'time_requested');
INSERT INTO datamodel VALUES('RejectedContract', 'contracts', 'time_opened');
INSERT INTO datamodel VALUES('RejectedContract', 'contracts', 'time_closed');
INSERT INTO datamodel VALUES('RejectedContract', 'contracts', 'stateid');

INSERT INTO datamodel VALUES('Patient', 'patients', 'idpatient');
INSERT INTO datamodel VALUES('Patient', 'patients', 'name');
INSERT INTO datamodel VALUES('Patient', 'patients', 'surname');
INSERT INTO datamodel VALUES('Patient', 'patients', 'dob');

INSERT INTO datamodel VALUES('CheckedHealthcareService', 'requestedservices', 'idreqserv');
INSERT INTO datamodel VALUES('CheckedHealthcareService', 'requestedservices', 'requesterid');
INSERT INTO datamodel VALUES('CheckedHealthcareService', 'requestedservices', 'serviceid');
INSERT INTO datamodel VALUES('CheckedHealthcareService', 'requestedservices', 'patientid');
INSERT INTO datamodel VALUES('CheckedHealthcareService', 'requestedservices', 'responsibleid');
INSERT INTO datamodel VALUES('CheckedHealthcareService', 'requestedservices', 'date');
INSERT INTO datamodel VALUES('CheckedHealthcareService', 'requestedservices', 'type');
INSERT INTO datamodel VALUES('CheckedHealthcareService', 'requestedservices', 'stateid');
INSERT INTO datamodel VALUES('CheckedHealthcareService', 'requestedservices', 'notes');

INSERT INTO datamodel VALUES('HealthcareService', 'requestedservices', 'idreqserv');
INSERT INTO datamodel VALUES('HealthcareService', 'requestedservices', 'requesterid');
INSERT INTO datamodel VALUES('HealthcareService', 'requestedservices', 'serviceid');
INSERT INTO datamodel VALUES('HealthcareService', 'requestedservices', 'patientid');
INSERT INTO datamodel VALUES('HealthcareService', 'requestedservices', 'responsibleid');
INSERT INTO datamodel VALUES('HealthcareService', 'requestedservices', 'date');
INSERT INTO datamodel VALUES('HealthcareService', 'requestedservices', 'type');
INSERT INTO datamodel VALUES('HealthcareService', 'requestedservices', 'stateid');
INSERT INTO datamodel VALUES('HealthcareService', 'requestedservices', 'notes');

INSERT INTO datamodel VALUES('Delegation', 'staff', 'idstaff');
INSERT INTO datamodel VALUES('Delegation', 'staff', 'name');
INSERT INTO datamodel VALUES('Delegation', 'staff', 'surname');

INSERT INTO datamodel VALUES('Assignment', 'staff', 'idstaff');
INSERT INTO datamodel VALUES('Assignment', 'staff', 'name');
INSERT INTO datamodel VALUES('Assignment', 'staff', 'surname');

INSERT INTO datamodel VALUES('HealthcareActor', 'staff', 'idstaff');
INSERT INTO datamodel VALUES('HealthcareActor', 'staff', 'name');
INSERT INTO datamodel VALUES('HealthcareActor', 'staff', 'surname');
INSERT INTO datamodel VALUES('HealthcareActor', 'staff', 'dob');
INSERT INTO datamodel VALUES('HealthcareActor', 'staff', 'title');

INSERT INTO datamodel VALUES('ServiceRequester', 'staff', 'idstaff');
INSERT INTO datamodel VALUES('ServiceRequester', 'staff', 'name');
INSERT INTO datamodel VALUES('ServiceRequester', 'staff', 'surname');
INSERT INTO datamodel VALUES('ServiceRequester', 'staff', 'dob');
INSERT INTO datamodel VALUES('ServiceRequester', 'staff', 'title');

INSERT INTO datamodel VALUES('Obstacle', 'obstacles', 'name');

INSERT INTO datamodel VALUES('PendingHealthcareService', 'requestedservices', 'idreqserv');
INSERT INTO datamodel VALUES('PendingHealthcareService', 'requestedservices', 'requesterid');
INSERT INTO datamodel VALUES('PendingHealthcareService', 'requestedservices', 'serviceid');
INSERT INTO datamodel VALUES('PendingHealthcareService', 'requestedservices', 'patientid');
INSERT INTO datamodel VALUES('PendingHealthcareService', 'requestedservices', 'responsibleid');
INSERT INTO datamodel VALUES('PendingHealthcareService', 'requestedservices', 'date');
INSERT INTO datamodel VALUES('PendingHealthcareService', 'requestedservices', 'type');
INSERT INTO datamodel VALUES('PendingHealthcareService', 'requestedservices', 'stateid');
INSERT INTO datamodel VALUES('PendingHealthcareService', 'requestedservices', 'notes');

INSERT INTO datamodel VALUES('CompletedHealthcareService', 'requestedservices', 'idreqserv');
INSERT INTO datamodel VALUES('CompletedHealthcareService', 'requestedservices', 'requesterid');
INSERT INTO datamodel VALUES('CompletedHealthcareService', 'requestedservices', 'serviceid');
INSERT INTO datamodel VALUES('CompletedHealthcareService', 'requestedservices', 'patientid');
INSERT INTO datamodel VALUES('CompletedHealthcareService', 'requestedservices', 'responsibleid');
INSERT INTO datamodel VALUES('CompletedHealthcareService', 'requestedservices', 'date');
INSERT INTO datamodel VALUES('CompletedHealthcareService', 'requestedservices', 'type');
INSERT INTO datamodel VALUES('CompletedHealthcareService', 'requestedservices', 'stateid');
INSERT INTO datamodel VALUES('CompletedHealthcareService', 'requestedservices', 'notes');

INSERT INTO templates ("name",created,updated,process_name) VALUES
	 ('AwardContract','2022-07-19 08:20:32.757513','2022-07-19 08:20:32.757513','AwardContract'),
	 ('ProvideService','2022-07-19 14:14:06.838553','2022-07-19 14:14:06.838553','ProvideService');

INSERT INTO components (template_id,input_dep,input_dep_field,output_dep,output_dep_field,"order","name","type",required,hide,validation,"function",parent) VALUES
	 (1,'','','','',0,'1 - OpenContract','HEADER',false,false,'','',NULL),
	 (1,'AcceptedContract','idcontract','OpenContract','idcontract',0,'idcontract','INPUT',true,true,'','',1),
	 (1,'AcceptedContract','reqservid','OpenContract','reqservid',1,'reqservid','INPUT',true,true,'','',1),
	 (1,'AcceptedContract','providerid','OpenContract','providerid',2,'providerid','INPUT',true,true,'','',1),
	 (1,'AcceptedContract','time_requested','OpenContract','time_requested',3,'time_requested','INPUT',true,true,'','',1),
	 (1,'','','OpenContract','time_opened',4,'time_opened','INPUT',true,false,'','',1),
	 (1,'AcceptedContract','stateid','OpenContract','stateid',5,'stateid','INPUT',true,true,'','',1),
	 (2,'','','','',0,'PLUS(CompletedHealthcareService, )','TAB',false,false,'','',NULL),
	 (2,'','','','',0,'1 - CompletedHealthcareService','HEADER',false,false,'','',8),
	 (2,'PendingHealthcareService','idreqserv','CompletedHealthcareService','idreqserv',0,'idreqserv','INPUT',true,true,'','',9);
INSERT INTO components (template_id,input_dep,input_dep_field,output_dep,output_dep_field,"order","name","type",required,hide,validation,"function",parent) VALUES
	 (2,'PendingHealthcareService','requesterid','CompletedHealthcareService','requesterid',1,'requesterid','INPUT',true,true,'','',9),
	 (2,'PendingHealthcareService','serviceid','CompletedHealthcareService','serviceid',2,'serviceid','INPUT',true,true,'','',9),
	 (2,'PendingHealthcareService','patientid','CompletedHealthcareService','patientid',3,'patientid','INPUT',true,true,'','',9),
	 (2,'PendingHealthcareService','responsibleid','CompletedHealthcareService','responsibleid',4,'responsibleid','INPUT',true,true,'','',9),
	 (2,'PendingHealthcareService','date','CompletedHealthcareService','date',5,'date','INPUT',true,true,'','',9),
	 (2,'PendingHealthcareService','type','CompletedHealthcareService','type',6,'type','INPUT',true,true,'','',9),
	 (2,'PendingHealthcareService','stateid','CompletedHealthcareService','stateid',7,'stateid','INPUT',true,true,'','',9),
	 (2,'PendingHealthcareService','notes','CompletedHealthcareService','notes',8,'notes','INPUT',true,true,'','',9),
	 (2,'','','','',1,'TIMES(Obstacle, PendingHealthcareService)','HEADER',false,false,'','',8),
	 (2,'','','','',0,'1 - Obstacle','HEADER',false,false,'','',19);
INSERT INTO components (template_id,input_dep,input_dep_field,output_dep,output_dep_field,"order","name","type",required,hide,validation,"function",parent) VALUES
	 (2,'','','Obstacle','name',0,'name','INPUT',true,false,'','',20),
	 (2,'','','','',1,'2 - PendingHealthcareService','HEADER',false,false,'','',19),
	 (2,'PendingHealthcareService','idreqserv','PendingHealthcareService','idreqserv',0,'idreqserv','INPUT',true,true,'','',22),
	 (2,'PendingHealthcareService','requesterid','PendingHealthcareService','requesterid',1,'requesterid','INPUT',true,true,'','',22),
	 (2,'PendingHealthcareService','serviceid','PendingHealthcareService','serviceid',2,'serviceid','INPUT',true,true,'','',22),
	 (2,'PendingHealthcareService','patientid','PendingHealthcareService','patientid',3,'patientid','INPUT',true,true,'','',22),
	 (2,'PendingHealthcareService','responsibleid','PendingHealthcareService','responsibleid',4,'responsibleid','INPUT',true,true,'','',22),
	 (2,'PendingHealthcareService','date','PendingHealthcareService','date',5,'date','INPUT',true,true,'','',22),
	 (2,'PendingHealthcareService','type','PendingHealthcareService','type',6,'type','INPUT',true,true,'','',22),
	 (2,'PendingHealthcareService','stateid','PendingHealthcareService','stateid',7,'stateid','INPUT',true,true,'','',22);
INSERT INTO components (template_id,input_dep,input_dep_field,output_dep,output_dep_field,"order","name","type",required,hide,validation,"function",parent) VALUES
	 (2,'PendingHealthcareService','notes','PendingHealthcareService','notes',8,'notes','INPUT',true,true,'','',22);

INSERT INTO input_information_parent ("name","order",input_dep,template_id) VALUES
	 ('ServiceProvider',0,'ServiceProvider',1),
	 ('AcceptedContract',1,'AcceptedContract',1),
	 ('Healthcare Service',0,'PendingHealthcareService',2),
	 ('OpenContract',1,'OpenContract',2);

INSERT INTO input_information_child ("name","order",input_dep_field,hide,parent_id) VALUES
	 ('idprovider',0,'idprovider',false,1),
	 ('actorid',1,'actorid',false,1),
	 ('name',2,'actorid',false,1),
	 ('surname',3,'actorid',false,1),
	 ('serviceid',4,'serviceid',false,1),
	 ('level',5,'level',false,1),
	 ('idcontract',0,'idcontract',false,2),
	 ('reqservid',1,'reqservid',false,2),
	 ('providerid',2,'providerid',false,2),
	 ('time_requested',3,'time_requested',false,2);
INSERT INTO input_information_child ("name","order",input_dep_field,hide,parent_id) VALUES
	 ('stateid',4,'stateid',false,2),
	 ('idreqserv',0,'idreqserv',true,3),
	 ('requesterid',1,'requesterid',true,3),
	 ('serviceid',2,'serviceid',true,3),
	 ('Service Name',3,'serviceid',false,3),
	 ('patientid',4,'patientid',true,3),
	 ('Patient Name',5,'patientid',false,3),
	 ('Patient Surname',6,'patientid',false,3),
	 ('responsibleid',7,'responsibleid',true,3),
	 ('date',8,'date',true,3);
INSERT INTO input_information_child ("name","order",input_dep_field,hide,parent_id) VALUES
	 ('type',9,'type',true,3),
	 ('stateid',10,'stateid',true,3),
	 ('notes',11,'notes',false,3),
	 ('idcontract',0,'idcontract',true,4),
	 ('reqservid',1,'reqservid',true,4),
	 ('providerid',2,'providerid',true,4),
	 ('time_requested',3,'time_requested',true,4),
	 ('time_opened',4,'time_opened',true,4),
	 ('stateid',5,'stateid',true,4);

INSERT INTO input_information_child_query (foreign_table,foreign_key,query_table,query_field,is_array,details_id) VALUES
	 ('ServiceProvider','actorid','staff','name',false,3),
	 ('ServiceProvider','actorid','staff','surname',false,4),
	 ('PendingHealthcareService','serviceid','services','name',false,15),
	 ('PendingHealthcareService','patientid','patients','name',false,17),
	 ('PendingHealthcareService','patientid','patients','surname',false,18);