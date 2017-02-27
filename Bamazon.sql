CREATE DATABASE Bamazon;

USE Bamazon;

CREATE TABLE products (
	item_id INTEGER(11) AUTO_INCREMENT NOT NULL,
	product_name VARCHAR(25) NOT NULL, /* A varchar is a string of varying length; the parameter dictates how many characters.  NOT NULL means you have to have a value */
    department_name VARCHAR(20) NOT NULL, /*has_bug is a BOOLEAN and is NOT NULL(want to find out if the chicken has a bug)*/
    price INTEGER(4),
    stock_quantity INTEGER(3), /*indicates number of DIGITS it could be (how many spaces to reserve for this data*/
    PRIMARY KEY (item_id)/*We are saying here that the PRIMARY KEY is the primary id!  additional argument about our table NOT AN ARGUMENT*/
);

USE Bamazon;
INSERT INTO products
	(product_name, department_name, price, stock_quantity)
    VALUES ("Red Bull Pack", "grocery", 15, 100),
		   ("Lion King", "entertainment", 20, 50),
           ("Zebra", "pets", 1000, 5),
           ("Roller Blades", "recreational", 45, 200),
           ("Ostrich", "pets", 800, 3),
           ("Orange Juice", "grocery", 4, 200),
           ("Fountain", "outdoor", 700, 1),
           ("Ipad", "technology", 900, 300),
           ("Tic Tacs", "convenience", 2, 400),
           ("Mason Jar Pack", "kitchen", 12, 38);
           
SELECT * FROM products;
           