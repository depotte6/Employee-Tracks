DROP DATABASE IF EXISTS tracking_db;
CREATE DATABASE tracking_db;

USE tracking_db;

DROP TABLE IF EXISTS department;
CREATE TABLE department (
    id INT NOT NULL PRIMARY KEY,
    department_name VARCHAR(30) NOT NULL,
);

DROP TABLE IF EXISTS roles;
CREATE TABLE roles (
    id INT PRIMARY KEY NOT NULL,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INT NOT NULL,
    FOREIGN KEY deparetment_id,
    REFERENCES department(id)
);

DROP TABLE IF EXISTS employee;
CREATE TABLE employee (
    id INT PRIMARY KEY NOT NULL ,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT,
    FOREIGN KEY roles_id,
    REFERENCES roles(id)
);