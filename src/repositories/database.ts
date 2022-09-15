import { Pool } from 'pg';

async function dbInstance (query: string, parameters: any[])
{
    const pool = new Pool({ connectionString: 'postgresql://postgres:1998@localhost:5432/alpha-multi?schema=public' });
    const client = await pool.connect();

    const req = await client.query(query, parameters);
    client.release();
    pool.end();

    return req.rows;
}

export { dbInstance };
