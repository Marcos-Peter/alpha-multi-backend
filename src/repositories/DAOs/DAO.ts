import { dbInstance } from '../database';

class DAO
{
    protected executeSQL<T> (sql: string, parameters: any[])
    {
        return new Promise<T[]>((resolve, reject) =>
        {
            try
            {
                resolve(dbInstance(sql, parameters).then((res) => res));
            }
            catch (err)
            {
                reject(err);
            }
        });
    }
}

export { DAO };
