import { pool } from '../db.js';
import bcrypt from 'bcryptjs';
import { createAccessToken } from '../libs/jwt.js';

export const register = async (req, res) => {
  const { document_number, first_name, last_name, email, address, password } =
    req.body;

  try {
    // Encriptar la contraseña
    const passwordHash = await bcrypt.hash(password, 10);

    // Insertar el usuario en la base de datos
    const result = await pool.query(
      `INSERT INTO users (document_number, first_name, last_name, email, address, password, role_id, status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING id, document_number, first_name, last_name, email, address, created_at`,
      [
        document_number,
        first_name,
        last_name,
        email,
        address,
        passwordHash,
        1,
        'active',
      ] // Asignar rol 1 y estado 'active'
    );

    const user = result.rows[0];

    // Crear el token de acceso
    const token = await createAccessToken({ id: user.id });

    // Configurar la cookie con el token
    res.cookie('token', token, { httpOnly: true });

    // Responder con el token y los datos del usuario
    res.status(201).json({
      token,
      user: {
        id: user.id,
        document_number: user.document_number,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        address: user.address,
        created_at: user.created_at,
      },
    });
  } catch (error) {
    // Manejo de errores
    if (error.code === '23505') {
      // Código de error para duplicados en PostgreSQL
      res.status(400).json({
        message: 'El número de documento o correo ya está registrado.',
      });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

export const login = async (req, res) => {
  const { document_number, password } = req.body;

  try {
    // Buscar al usuario por número de documento
    const result = await pool.query(
      `SELECT id, document_number, first_name, last_name, email, password 
       FROM users 
       WHERE document_number = $1`,
      [document_number]
    );

    const userFound = result.rows[0];

    // Verificar si el usuario existe
    if (!userFound) {
      return res.status(400).json({ message: 'Usuario no encontrado' });
    }

    // Comparar la contraseña proporcionada con la almacenada
    const isMatch = await bcrypt.compare(password, userFound.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Contraseña incorrecta' });
    }

    // Crear el token de acceso
    const token = await createAccessToken({
      id: userFound.id,
      document_number: userFound.document_number,
    });

    // Configurar la cookie con el token
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
    });

    // Responder con datos mínimos
    res.json({
      token,
      user: {
        id: userFound.id,
        document_number: userFound.document_number,
      },
    });
  } catch (error) {
    // Manejo de errores
    res.status(500).json({ message: error.message });
  }
};

export const logout = (req, res) => {
  res.cookie('token', '', {
    httpOnly: true, // Evita que el cliente acceda a la cookie desde JavaScript
    secure: process.env.NODE_ENV === 'production', // Solo en HTTPS en producción
    sameSite: 'none', // Permite cookies entre dominios
    expires: new Date(0), // Fecha de expiración en el pasado para eliminarla
  });
  res.status(200).json({ message: 'Successfully logged out' }); // Respuesta con código 200 (éxito)
};

export const profile = async (req, res) => {
  try {
    // Obtener el id del usuario desde el token (req.user.id)
    const userId = req.user.id;

    // Consultar al usuario en la base de datos por su id
    const result = await pool.query(
      `SELECT id, document_number, first_name, last_name, email, address, created_at
       FROM users
       WHERE id = $1`,
      [userId]
    );

    const userFound = result.rows[0];

    // Verificar si el usuario existe
    if (!userFound) {
      return res.status(400).json({ message: 'Usuario no encontrado' });
    }

    // Devolver los datos del usuario, sin incluir la contraseña
    return res.json({
      id: userFound.id,
      document_number: userFound.document_number,
      first_name: userFound.first_name,
      last_name: userFound.last_name,
      email: userFound.email,
      address: userFound.address,
      created_at: userFound.created_at,
    });
  } catch (error) {
    // Manejo de errores
    return res.status(500).json({ message: error.message });
  }
};
