CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
	id INT NOT NULL AUTO_INCREMENT,
    product VARCHAR(50),
    department VARCHAR(50),
    price DECIMAL (5,2) DEFAULT 0,
    quantity INT DEFAULT 0,
    PRIMARY KEY (id)
    );