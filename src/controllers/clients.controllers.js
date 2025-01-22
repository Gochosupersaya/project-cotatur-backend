import { pool } from '../db.js';

export const getClients = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM clients');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getClient = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query('SELECT * FROM clients WHERE id = $1', [
      id,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Client not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createClient = async (req, res) => {
  try {
    const {
      document_number,
      first_name,
      last_name,
      id_photo,
      birth_date,
      nationality,
      phone,
      address,
      representative_id,
    } = req.body;

    const { rows } = await pool.query(
      `INSERT INTO clients (document_number, first_name, last_name, id_photo, birth_date, nationality, phone, address, representative_id, created_at) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP) RETURNING *`,
      [
        document_number,
        first_name,
        last_name,
        id_photo,
        birth_date,
        nationality,
        phone,
        address,
        representative_id,
      ]
    );

    res.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);

    if (error?.code === '23505') {
      return res
        .status(409)
        .json({ message: 'Document Number already exists' });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteClient = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('BEGIN');

    await pool.query('DELETE FROM medical_history WHERE client_id = $1', [id]);

    await pool.query('DELETE FROM bookings WHERE client_id = $1', [id]);

    await pool.query(
      'UPDATE clients SET representative_id = NULL WHERE representative_id = $1',
      [id]
    );

    const { rowCount } = await pool.query(
      'DELETE FROM clients WHERE id = $1 RETURNING *',
      [id]
    );

    if (rowCount === 0) {
      await pool.query('ROLLBACK');
      return res.status(404).json({ message: 'Client not found' });
    }

    await pool.query('COMMIT');

    res.status(200).json({ message: 'Client successfully deleted' });
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateClient = async (req, res) => {
  const { id } = req.params;
  const {
    document_number,
    first_name,
    last_name,
    id_photo,
    birth_date,
    nationality,
    phone,
    address,
    representative_id,
  } = req.body;

  try {
    const { rows } = await pool.query(
      `UPDATE clients 
            SET document_number = $1, first_name = $2, last_name = $3, id_photo = $4, birth_date = $5, nationality = $6, 
                phone = $7, address = $8, representative_id = $9, updated_at = CURRENT_TIMESTAMP
            WHERE id = $10 RETURNING *`,
      [
        document_number,
        first_name,
        last_name,
        id_photo,
        birth_date,
        nationality,
        phone,
        address,
        representative_id,
        id,
      ]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Client not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
