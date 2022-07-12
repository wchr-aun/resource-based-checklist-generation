DROP TABLE IF EXISTS datamodel, models, input_information_child_query, input_information_child, input_information_parent, components, templates, transactions, item_list, orders, customers, items;

CREATE TABLE items (id SERIAL UNIQUE, name VARCHAR NOT NULL, description TEXT);
INSERT INTO items (name, description) VALUES('item 1', 'desc');
INSERT INTO items (name, description) VALUES('item 2', 'desc');
INSERT INTO items (name, description) VALUES('item 3', 'desc');

CREATE TABLE customers (id SERIAL UNIQUE, name VARCHAR, surname VARCHAR, address VARCHAR);
INSERT INTO customers (name, surname, address) VALUES('Aun', 'Sirinaovakul', 'World');

CREATE TABLE orders (id SERIAL UNIQUE, customer_id INTEGER REFERENCES customers(id), total_price INTEGER);
INSERT INTO orders (customer_id, total_price) VALUES(1, 140), (1, 30);

CREATE TABLE item_list (itemlistid SERIAL UNIQUE, item_id INTEGER REFERENCES items(id), price INTEGER NOT NULL, quantity INTEGER NOT NULL, order_id INTEGER REFERENCES orders(id));
INSERT INTO item_list (item_id, price, quantity, order_id) VALUES(1, 10, 1, 1), (2, 20, 2, 1), (3, 30, 3, 1);
INSERT INTO item_list (item_id, price, quantity, order_id) VALUES(1, 10, 3, 1);

CREATE TABLE transactions (id SERIAL UNIQUE, order_id INTEGER REFERENCES orders(id), payment_date TIMESTAMP NOT NULL, shipping_date TIMESTAMP, payment_amount INTEGER NOT NULL, card_no VARCHAR NOT NULL);
INSERT INTO transactions (order_id, payment_date, shipping_date, payment_amount, card_no) VALUES(1, '2022-01-01', '2022-01-01', 140, '1234');
INSERT INTO transactions (order_id, payment_date, shipping_date, payment_amount, card_no) VALUES(1, '2022-01-02', NULL, 0, '1234');

CREATE TABLE IF NOT EXISTS models (name VARCHAR UNIQUE NOT NULL, "desc" VARCHAR NOT NULL);

INSERT INTO models VALUES('Item', 'description');
INSERT INTO models VALUES('Customer', 'description');
INSERT INTO models VALUES('Order', 'description');
INSERT INTO models VALUES('Payment', 'description');
INSERT INTO models VALUES('Transaction', 'description');
INSERT INTO models VALUES('FullfilledOrder', 'description');

CREATE TABLE IF NOT EXISTS datamodel (name VARCHAR NOT NULL REFERENCES models(name), "table" VARCHAR NOT NULL, field VARCHAR NOT NULL, PRIMARY KEY (name, "table", field));

INSERT INTO datamodel VALUES('Item', 'items', 'id');
INSERT INTO datamodel VALUES('Item', 'items', 'name');
INSERT INTO datamodel VALUES('Item', 'items', 'description');

INSERT INTO datamodel VALUES('Customer', 'customers', 'id');
INSERT INTO datamodel VALUES('Customer', 'customers', 'name');
INSERT INTO datamodel VALUES('Customer', 'customers', 'surname');
INSERT INTO datamodel VALUES('Customer', 'customers', 'address');

INSERT INTO datamodel VALUES('Order', 'orders', 'id');
INSERT INTO datamodel VALUES('Order', 'orders', 'customer_id');
INSERT INTO datamodel VALUES('Order', 'orders', 'total_price');

INSERT INTO datamodel VALUES('Payment', 'transaction', 'order_id');
INSERT INTO datamodel VALUES('Payment', 'transaction', 'payment_date');
INSERT INTO datamodel VALUES('Payment', 'transaction', 'payment_amount');
INSERT INTO datamodel VALUES('Payment', 'transaction', 'card_no');

CREATE TABLE templates (id SERIAL UNIQUE, name VARCHAR NOT NULL, created TIMESTAMP NOT NULL, updated TIMESTAMP NOT NULL, process_name VARCHAR NOT NULL);

CREATE TABLE components (id SERIAL UNIQUE, template_id INTEGER REFERENCES templates(id) ON DELETE CASCADE NOT NULL, input_dep VARCHAR, input_dep_field VARCHAR, output_dep VARCHAR, output_dep_field VARCHAR, "order" INTEGER NOT NULL, "name" VARCHAR NOT NULL, type VARCHAR NOT NULL, required BOOLEAN DEFAULT true, hide BOOLEAN DEFAULT false, validation VARCHAR, function VARCHAR, parent INTEGER REFERENCES components(id) ON DELETE CASCADE);

CREATE TABLE input_information_parent (id SERIAL UNIQUE, name VARCHAR NOT NULL, "order" INTEGER NOT NULL, input_dep VARCHAR REFERENCES models(name), template_id INTEGER NOT NULL REFERENCES templates(id) ON DELETE CASCADE);

CREATE TABLE input_information_child (id SERIAL UNIQUE, name VARCHAR NOT NULL, "order" INTEGER NOT NULL, input_dep_field VARCHAR, hide BOOLEAN DEFAULT false, parent_id INTEGER NOT NULL REFERENCES input_information_parent(id) ON DELETE CASCADE);

CREATE TABLE input_information_child_query (id SERIAL UNIQUE, foreign_table VARCHAR NOT NULL, foreign_key VARCHAR NOT NULL, query_table VARCHAR NOT NULL, query_field VARCHAR NOT NULL, details_id INTEGER NOT NULL REFERENCES input_information_child(id) ON DELETE CASCADE);