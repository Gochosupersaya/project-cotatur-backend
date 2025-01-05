-- Create table for roles
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50)
);

INSERT INTO roles (name)
    VALUES ('employee'),
    ('administrator');

-- Create table for users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    document_number VARCHAR(50) UNIQUE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(100),
    address VARCHAR(255),
    password VARCHAR(255),
    role_id INT NOT NULL,
    last_signin TIMESTAMP,
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id)
);

INSERT INTO users (document_number, first_name, last_name, email, address, password, role_id, last_signin, status)
VALUES
('V12345678', 'Carlos', 'Perez', 'carlos.perez@gmail.com', 'Francisco de Miranda Avenue, Caracas', '1111', 1, '2023-12-01 14:30:00', 'active'),
('V87654321', 'Maria', 'Gomez', 'maria.gomez@gmail.com', 'Bolivar Street, Maracaibo', '2222', 2, '2023-12-05 09:15:00', 'active'),
('V45612378', 'Jose', 'Rodriguez', 'jose.rodriguez@gmail.com', 'Libertador Avenue, Valencia', '3333', 1, '2023-11-28 18:45:00', 'inactive'),
('V32165487', 'Ana', 'Martinez', 'ana.martinez@gmail.com', 'Sucre Street, Barquisimeto', '4444', 2, '2023-12-10 12:00:00', 'active'),
('V65498732', 'Luis', 'Hernandez', 'luis.hernandez@gmail.com', 'Las Delicias Avenue, Maracay', '5555', 2, '2023-11-30 16:20:00', 'inactive');

SELECT * FROM users;

-- Create table for clients
CREATE TABLE clients (
    id SERIAL PRIMARY KEY,
    document_number VARCHAR(50) UNIQUE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    id_photo BYTEA,
    birth_date DATE,
    nationality VARCHAR(50),
    phone VARCHAR(15),
    address VARCHAR(255),
    representative_id INT NULL,
    FOREIGN KEY (representative_id) REFERENCES clients(id)
);

-- Insert sample clients data
INSERT INTO clients (document_number, first_name, last_name, id_photo, birth_date, nationality, phone, address, representative_id)
VALUES 

('V12345678', 'Carlos', 'Perez', NULL, '1990-05-10', 'Venezuelan', '+584121234567', 'Avenue Bolívar, Caracas, Venezuela', NULL),
('V23456789', 'Maria', 'Gonzalez', NULL, '1985-08-20', 'Venezuelan', '+584141234567', 'Street Los Mangos, Valencia, Carabobo, Venezuela', NULL),
('V34567890', 'Luis', 'Rodriguez', NULL, '2010-03-15', 'Venezuelan', '+584161234567', 'Street Falcón, Maracaibo, Zulia, Venezuela', 1),  -- Luis is a minor, represented by Carlos Perez
('V45678901', 'Sofia', 'Martinez', NULL, '2008-12-30', 'Venezuelan', '+584171234567', 'Avenue Panteón, Caracas, Venezuela', 2); -- Sofia is a minor, represented by Maria Gonzalez

-- Create table for medical_need_type
CREATE TABLE medical_need_type (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100)
);

INSERT INTO medical_need_type (name)
    VALUES ('Medicine'),
    ('Disability'),
    ('Allergy'),
    ('Disease');

-- Create table for medical_history
CREATE TABLE medical_history (
    id SERIAL PRIMARY KEY,
    client_id INT NOT NULL,
    type_id INT NOT NULL,
    allergy_description VARCHAR(255),
    FOREIGN KEY (client_id) REFERENCES clients(id),
    FOREIGN KEY (type_id) REFERENCES medical_need_type(id)
);
