import { pool } from '../db.js';

export const getActivities = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM activity');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getActivity = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query('SELECT * FROM activity WHERE id = $1', [
      id,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Activity not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createActivity = async (req, res) => {
  try {
    const {
      type_id,
      activity_date,
      activity_time,
      price_per_person,
      description,
    } = req.body;

    const { rows } = await pool.query(
      `INSERT INTO activity (type_id, activity_date, activity_time, price_per_person, description, created_at) 
       VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP) RETURNING *`,
      [type_id, activity_date, activity_time, price_per_person, description]
    );

    res.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);
    if (error?.code === '23503') {
      return res.status(400).json({ message: 'Invalid foreign key: type_id' });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateActivity = async (req, res) => {
  const { id } = req.params;
  const {
    type_id,
    activity_date,
    activity_time,
    price_per_person,
    description,
  } = req.body;

  try {
    const { rows } = await pool.query(
      `UPDATE activity 
       SET type_id = $1, activity_date = $2, activity_time = $3, price_per_person = $4, 
           description = $5, updated_at = CURRENT_TIMESTAMP
       WHERE id = $6 RETURNING *`,
      [type_id, activity_date, activity_time, price_per_person, description, id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteActivity = async (req, res) => {
  const { id } = req.params;

  try {
    const { rowCount } = await pool.query(
      'DELETE FROM activity WHERE id = $1 RETURNING *',
      [id]
    );

    if (rowCount === 0) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    res.status(200).json({ message: 'Activity successfully deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
