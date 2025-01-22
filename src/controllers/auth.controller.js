import { pool } from '../db.js';
import bcrypt from 'bcryptjs';
import { createAccessToken } from '../libs/jwt.js';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

export const register = async (req, res) => {
  const { document_number, first_name, last_name, email, address, password } =
    req.body;

  try {
    const passwordHash = await bcrypt.hash(password, 10);

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
      ]
    );

    const user = result.rows[0];

    const token = await createAccessToken({ id: user.id });

    res.cookie('token', token, { httpOnly: true });

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
    if (error.code === '23505') {
      res.status(400).json({
        message: 'The document or email number is already registered.',
      });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

export const login = async (req, res) => {
  const { document_number, password } = req.body;

  try {
    const result = await pool.query(
      `SELECT id, document_number, first_name, last_name, email, password 
       FROM users 
       WHERE document_number = $1`,
      [document_number]
    );

    const userFound = result.rows[0];

    if (!userFound) {
      return res.status(400).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, userFound.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect password' });
    }

    const token = await createAccessToken({
      id: userFound.id,
      document_number: userFound.document_number,
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
    });

    res.json({
      token,
      user: {
        id: userFound.id,
        document_number: userFound.document_number,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logout = (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none',
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Successfully logged out' });
};

export const profile = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT id, document_number, first_name, last_name, email, address, created_at
       FROM users
       WHERE id = $1`,
      [userId]
    );

    const userFound = result.rows[0];

    if (!userFound) {
      return res.status(400).json({ message: 'User not found' });
    }

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
    return res.status(500).json({ message: error.message });
  }
};

export const requestPasswordReset = async (req, res) => {
  const { document_number, email } = req.body;

  try {
    const result = await pool.query(
      'SELECT id, email FROM users WHERE document_number = $1 AND email = $2',
      [document_number, email]
    );

    const user = result.rows[0];
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const resetCode = crypto.randomBytes(4).toString('hex');

    await pool.query(
      "UPDATE users SET reset_code = $1, reset_code_expiration = NOW() + INTERVAL '15 minutes' WHERE id = $2",
      [resetCode, user.id]
    );

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Password recovery code',
      text: `Your recovery code is: ${resetCode}. This code will expire in 15 minutes.`,
    });

    res.json({
      message: 'Recovery code sent to email',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  const { document_number, reset_code, new_password } = req.body;

  try {
    const result = await pool.query(
      'SELECT id FROM users WHERE document_number = $1 AND reset_code = $2 AND reset_code_expiration > NOW()',
      [document_number, reset_code]
    );

    const user = result.rows[0];
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired code' });
    }

    const hashedPassword = await bcrypt.hash(new_password, 10);
    await pool.query(
      'UPDATE users SET password = $1, reset_code = NULL, reset_code_expiration = NULL WHERE id = $2',
      [hashedPassword, user.id]
    );

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
