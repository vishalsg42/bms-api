CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(50) NOT NULL UNIQUE KEY,
    password VARCHAR(255),
    ph_number VARCHAR(50),
    primary_address VARCHAR(255),
    state VARCHAR(100),
    city VARCHAR(100),
    zipcode VARCHAR(10),
    country VARCHAR(30),
    INDEX(id,email,password)
)
