import { pool } from '../db.js';

// Obtener todas las reservaciones
export const getBookings = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM bookings');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Obtener una reservación por ID
export const getBooking = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query('SELECT * FROM bookings WHERE id = $1', [
      id,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Crear una nueva reservación
export const createBooking = async (req, res) => {
  try {
    const { user_id, client_id, activity_id } = req.body;

    const { rows } = await pool.query(
      'INSERT INTO bookings (user_id, client_id, activity_id) VALUES ($1, $2, $3) RETURNING *',
      [user_id, client_id, activity_id]
    );

    res.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);

    if (error?.code === '23503') {
      return res.status(400).json({ message: 'Invalid foreign key' });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Eliminar una reservación
export const deleteBooking = async (req, res) => {
  const { id } = req.params;

  try {
    const { rowCount } = await pool.query(
      'DELETE FROM bookings WHERE id = $1 RETURNING *',
      [id]
    );

    if (rowCount === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.status(200).json({ message: 'Booking successfully deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
