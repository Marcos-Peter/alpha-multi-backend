import { Pool } from 'pg';

async function dbInstance (query: string, parameters: any[])
{
    const pool = new Pool({ connectionString: process.env.POSTGRES });
    const client = await pool.connect();

    const req = await client.query(query, parameters);
    client.release();
    await pool.end();

    return req.rows;
}

export { dbInstance };
