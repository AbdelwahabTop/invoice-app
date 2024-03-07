CREATE TABLE customer (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL UNIQUE,
    customer_phone VARCHAR(20),
    customer_address VARCHAR(255)
);

CREATE TABLE invoice (
    id INT AUTO_INCREMENT PRIMARY KEY,
    invoice_number VARCHAR(50) NOT NULL,
    invoice_date DATE,
    customer_id INT,
    FOREIGN KEY (customer_id) REFERENCES customer(id)
);

CREATE TABLE items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    qty INT NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    invoice_id INT,
    FOREIGN KEY (invoice_id) REFERENCES invoice(id)
);