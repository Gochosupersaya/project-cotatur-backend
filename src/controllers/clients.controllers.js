import { pool } from "../db.js";

export const getClients = async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM clients');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getClient = async (req, res) => {
    const { id } = req.params;
    try {
        const { rows } = await pool.query('SELECT * FROM clients WHERE id = $1', [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Client not found" });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
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
            `INSERT INTO clients (document_number, first_name, last_name, id_photo, birth_date, nationality, phone, address, representative_id) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
            [document_number, first_name, last_name, id_photo, birth_date, nationality, phone, address, representative_id]
        );

        res.status(201).json(rows[0]);
    } catch (error) {
        console.error(error);

        if (error?.code === "23505") {
            return res.status(409).json({ message: "Document Number already exists" });
        }
        res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteClient = async (req, res) => {
    const { id } = req.params;
    try {
        const { rowCount } = await pool.query('DELETE FROM clients WHERE id = $1 RETURNING *', [id]);

        if (rowCount === 0) {
            return res.status(404).json({ message: "Client not found" });
        }

        res.sendStatus(204);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
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
                phone = $7, address = $8, representative_id = $9 
            WHERE id = $10 RETURNING *`,
            [document_number, first_name, last_name, id_photo, birth_date, nationality, phone, address, representative_id, id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "Client not found" });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
