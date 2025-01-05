import { pool } from "../db.js";

export const getMedicalNeedTypes = async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM medical_need_type');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getMedicalNeedType = async (req, res) => {
    try {
        const { id } = req.params;
        const { rows } = await pool.query('SELECT * FROM medical_need_type WHERE id = $1', [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Medical Need Type not found" });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const createMedicalNeedType = async (req, res) => {
    try {
        const { name } = req.body;
        const { rows } = await pool.query(
            'INSERT INTO medical_need_type (name) VALUES ($1) RETURNING *',
            [name]
        );
        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        if (error?.code === "23505") {
            return res.status(409).json({ message: "Medical Need Type already exists" });
        }
        res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteMedicalNeedType = async (req, res) => {
    try {
        const { id } = req.params;
        const { rowCount } = await pool.query('DELETE FROM medical_need_type WHERE id = $1 RETURNING *', [id]);

        if (rowCount === 0) {
            return res.status(404).json({ message: "Medical Need Type not found" });
        }

        res.sendStatus(204);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const updateMedicalNeedType = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        const { rows } = await pool.query(
            'UPDATE medical_need_type SET name = $1 WHERE id = $2 RETURNING *',
            [name, id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "Medical Need Type not found" });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
