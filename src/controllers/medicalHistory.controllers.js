import { pool } from "../db.js";

export const getMedicalHistories = async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM medical_history');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getMedicalHistory = async (req, res) => {
    try {
        const { id } = req.params;
        const { rows } = await pool.query('SELECT * FROM medical_history WHERE id = $1', [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Medical history not found" });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const createMedicalHistory = async (req, res) => {
    try {
        const { client_id, type_id, allergy_description } = req.body;

        const { rows } = await pool.query(
            'INSERT INTO medical_history (client_id, type_id, allergy_description) VALUES ($1, $2, $3) RETURNING *',
            [client_id, type_id, allergy_description]
        );

        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        if (error?.code === "23503") {
            return res.status(400).json({ message: "Invalid foreign key" });
        }
        res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteMedicalHistory = async (req, res) => {
    try {
        const { id } = req.params;
        const { rowCount } = await pool.query('DELETE FROM medical_history WHERE id = $1 RETURNING *', [id]);

        if (rowCount === 0) {
            return res.status(404).json({ message: "Medical history not found" });
        }

        res.sendStatus(204);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const updateMedicalHistory = async (req, res) => {
    try {
        const { id } = req.params;
        const { client_id, type_id, allergy_description } = req.body;

        const { rows } = await pool.query(
            'UPDATE medical_history SET client_id = $1, type_id = $2, allergy_description = $3 WHERE id = $4 RETURNING *',
            [client_id, type_id, allergy_description, id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "Medical history not found" });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
