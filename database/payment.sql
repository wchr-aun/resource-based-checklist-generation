DROP TABLE IF EXISTS transactions, transaction_status, item_list, orders, customers, items;

CREATE TABLE items (id SERIAL UNIQUE, name VARCHAR NOT NULL, description TEXT);
INSERT INTO items (name, description) VALUES('item 1', 'desc');
INSERT INTO items (name, description) VALUES('item 2', 'desc');
INSERT INTO items (name, description) VALUES('item 3', 'desc');

CREATE TABLE customers (id SERIAL UNIQUE, name VARCHAR, surname VARCHAR, address VARCHAR);
INSERT INTO customers (name, surname, address) VALUES('Aun', 'Sirinaovakul', 'World');

CREATE TABLE orders (id SERIAL UNIQUE, customer_id INTEGER REFERENCES customers(id), total_price INTEGER);
INSERT INTO orders (customer_id, total_price) VALUES(1, 140), (1, 30);

CREATE TABLE item_list (order_id INTEGER REFERENCES orders(id), item_id INTEGER REFERENCES items(id), price INTEGER NOT NULL, quantity INTEGER NOT NULL, PRIMARY KEY(order_id, item_id));
INSERT INTO item_list (item_id, price, quantity, order_id) VALUES(1, 10, 1, 1), (2, 20, 2, 1), (3, 30, 3, 1);
INSERT INTO item_list (item_id, price, quantity, order_id) VALUES(1, 10, 3, 2);

CREATE TABLE transaction_status (id SERIAL UNIQUE, name VARCHAR NOT NULL);
INSERT INTO transaction_status (id, name) VALUES(1, 'pending payment'), (2, 'pending shipping'), (3, 'shipping'), (4, 'received'), (5, 'canceled');

CREATE TABLE transactions (id SERIAL UNIQUE, order_id INTEGER REFERENCES orders(id), payment_date TIMESTAMP NOT NULL, shipping_date TIMESTAMP, payment_amount INTEGER NOT NULL, card_no VARCHAR NOT NULL, status INTEGER NOT NULL REFERENCES transaction_status(id));
INSERT INTO transactions (order_id, payment_date, shipping_date, payment_amount, card_no, status) VALUES(1, '2022-01-01', '2022-01-01', 140, '1234', 4);
INSERT INTO transactions (order_id, payment_date, shipping_date, payment_amount, card_no, status) VALUES(1, '2022-01-02', NULL, 0, '1234', 1);

INSERT INTO models VALUES('Item', 'description');
INSERT INTO models VALUES('Customer', 'description');
INSERT INTO models VALUES('OrderTransaction', 'description');
INSERT INTO models VALUES('NewTransaction', 'description');
INSERT INTO models VALUES('PaidTransaction', 'description');
INSERT INTO models VALUES('Transaction', 'description');
INSERT INTO models VALUES('ShippingTransaction', 'description');
INSERT INTO models VALUES('CanceledTransaction', 'description');
INSERT INTO models VALUES('FullfilledTransaction', 'description');
INSERT INTO models VALUES('CardDetails', 'description');

INSERT INTO datamodel VALUES('Item', 'items', 'id');
INSERT INTO datamodel VALUES('Item', 'items', 'name');
INSERT INTO datamodel VALUES('Item', 'items', 'description');

INSERT INTO datamodel VALUES('Customer', 'customers', 'id');
INSERT INTO datamodel VALUES('Customer', 'customers', 'name');
INSERT INTO datamodel VALUES('Customer', 'customers', 'surname');
INSERT INTO datamodel VALUES('Customer', 'customers', 'address');

INSERT INTO datamodel VALUES('OrderTransaction', 'orders', 'id');
INSERT INTO datamodel VALUES('OrderTransaction', 'orders', 'customer_id');
INSERT INTO datamodel VALUES('OrderTransaction', 'orders', 'total_price');

INSERT INTO datamodel VALUES('CardDetails', 'transactions', 'card_no');
INSERT INTO datamodel VALUES('CardDetails', 'transactions', 'expire');
INSERT INTO datamodel VALUES('CardDetails', 'transactions', 'code');

INSERT INTO templates (name,created,updated,process_name) VALUES ('CardInput','2022-07-19 11:24:13.100664','2022-07-19 11:24:13.100664','CardInput');

INSERT INTO components (template_id,input_dep,input_dep_field,output_dep,output_dep_field,"order",name,"type",required,hide,validation,"function",parent) VALUES
	 (1,'','','','',0,'1 - CardDetails','HEADER',false,false,'','',NULL),
	 (1,'','','CardDetails','card_no',0,'card_no','INPUT',true,false,'','',1),
	 (1,'','','CardDetails','expire',1,'expire','INPUT',true,false,'','',1),
	 (1,'','','CardDetails','code',2,'code','INPUT',true,false,'','',1);

INSERT INTO input_information_parent (name,"order",input_dep,template_id) VALUES ('OrderTransaction',0,'OrderTransaction',1);

INSERT INTO input_information_child (name,"order",input_dep_field,hide,parent_id) VALUES
	 ('id',0,'id',true,1),
	 ('transaction id',1,'id',false,1),
	 ('item id',2,'id',false,1),
	 ('price',3,'id',false,1),
	 ('quantity',4,'id',false,1),
	 ('customer_id',5,'customer_id',true,1),
	 ('total_price',6,'total_price',false,1);

INSERT INTO input_information_child_query (foreign_table,foreign_key,query_table,query_field,is_array,details_id) VALUES
	 ('OrderTransaction','id','transactions','id',true,2),
	 ('OrderTransaction','id','item_list','item_id',true,3),
	 ('OrderTransaction','id','item_list','price',true,4),
	 ('OrderTransaction','id','item_list','quantity',true,5);