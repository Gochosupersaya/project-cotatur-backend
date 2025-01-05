import { pool } from "../db.js";

export const getUsers = async (req, res) => {
    const { rows } = await pool.query('SELECT * FROM users');
    res.json(rows);
};

export const getUser = async (req, res) => {
    const { id } = req.params;
    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id]);

    if (rows.length === 0) {
        return res.status(404).json({ message: "User not found" });
    }
    res.json(rows[0]);
};

export const createUser = async (req, res) => {
    try{
        const data = req.body;
        console.log(data);
        const {rows} = await pool.query('INSERT INTO users (document_number, first_name, last_name, email, address, password, role_id, last_signin, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
        [data.document_number, data.first_name, data.last_name, data.email, data.address, data.password, data.role_id, data.last_signin, data.status]
        );
        return res.json(rows[0]);
    }catch (error){
        console.log(error);

        if (error?.code === "23505"){
            return res.status(409).json({message: "Document Number already exists"});
        }
        return res.status(500).json({ message: "Internal server error"});
    }
    
        
};

export const deleteUser = async (req, res) => {
    const { id } = req.params;
    const { rowCount } = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);

    if (rowCount === 0) {
        return res.status(404).json({ message: "User not found" });
    }

    return res.sendStatus(204);
};

export const updateUser =  async (req, res) => {
    const { id } = req.params;
    const data = req.body;

    const {rows} = await pool.query('UPDATE users SET document_number = $1, first_name = $2, last_name = $3, email = $4, address = $5, password = $6, role_id = $7, last_signin = $8, status = $9 WHERE id = $10 RETURNING *',
    [data.document_number, data.first_name, data.last_name, data.email, data.address, data.password, data.role_id, data.last_signin, data.status, id]);

   return res.json(rows[0]);
};