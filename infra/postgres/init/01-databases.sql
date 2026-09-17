-- Local development only
CREATE ROLE auth_user LOGIN PASSWORD 'auth_local';
CREATE DATABASE auth_db OWNER auth_user;
REVOKE CONNECT ON DATABASE auth_db FROM PUBLIC;

CREATE ROLE product_user LOGIN PASSWORD 'product_local';
CREATE DATABASE product_db OWNER product_user;
REVOKE CONNECT ON DATABASE product_db FROM PUBLIC;

CREATE ROLE order_user LOGIN PASSWORD 'order_local';
CREATE DATABASE order_db OWNER order_user;
REVOKE CONNECT ON DATABASE order_db FROM PUBLIC;

CREATE ROLE inventory_user LOGIN PASSWORD 'inventory_local';
CREATE DATABASE inventory_db OWNER inventory_user;
REVOKE CONNECT ON DATABASE inventory_db FROM PUBLIC;

CREATE ROLE payment_user LOGIN PASSWORD 'payment_local';
CREATE DATABASE payment_db OWNER payment_user;
REVOKE CONNECT ON DATABASE payment_db FROM PUBLIC;