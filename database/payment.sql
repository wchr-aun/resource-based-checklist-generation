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
INSERT INTO models VALUES('Order', 'description');
INSERT INTO models VALUES('PaidOrder', 'description');
INSERT INTO models VALUES('Transaction', 'description');
INSERT INTO models VALUES('ShippingOrder', 'description');
INSERT INTO models VALUES('FullfilledOrder', 'description');
INSERT INTO models VALUES('CanceledOrder', 'description');

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

INSERT INTO datamodel VALUES('PaidOrder', 'transaction', 'id');
INSERT INTO datamodel VALUES('PaidOrder', 'transaction', 'order_id');
INSERT INTO datamodel VALUES('PaidOrder', 'transaction', 'payment_date');
INSERT INTO datamodel VALUES('PaidOrder', 'transaction', 'payment_amount');
INSERT INTO datamodel VALUES('PaidOrder', 'transaction', 'card_no');
INSERT INTO datamodel VALUES('PaidOrder', 'transaction', 'status');

INSERT INTO datamodel VALUES('ShippingOrder', 'transaction', 'id');
INSERT INTO datamodel VALUES('ShippingOrder', 'transaction', 'order_id');
INSERT INTO datamodel VALUES('ShippingOrder', 'transaction', 'payment_date');
INSERT INTO datamodel VALUES('ShippingOrder', 'transaction', 'payment_amount');
INSERT INTO datamodel VALUES('ShippingOrder', 'transaction', 'shipping_date');
INSERT INTO datamodel VALUES('ShippingOrder', 'transaction', 'card_no');
INSERT INTO datamodel VALUES('ShippingOrder', 'transaction', 'status');

INSERT INTO datamodel VALUES('CanceledOrder', 'transaction', 'id');
INSERT INTO datamodel VALUES('CanceledOrder', 'transaction', 'order_id');
INSERT INTO datamodel VALUES('CanceledOrder', 'transaction', 'status');

INSERT INTO datamodel VALUES('FullfilledOrder', 'transaction', 'id');
INSERT INTO datamodel VALUES('FullfilledOrder', 'transaction', 'order_id');
INSERT INTO datamodel VALUES('FullfilledOrder', 'transaction', 'payment_date');
INSERT INTO datamodel VALUES('FullfilledOrder', 'transaction', 'payment_amount');
INSERT INTO datamodel VALUES('FullfilledOrder', 'transaction', 'shipping_date');
INSERT INTO datamodel VALUES('FullfilledOrder', 'transaction', 'card_no');
INSERT INTO datamodel VALUES('FullfilledOrder', 'transaction', 'status');