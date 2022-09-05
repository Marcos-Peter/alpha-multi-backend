import sqlite3 from 'sqlite3';

class DatabaseInstance
{
    private readonly database: sqlite3.Database;
    private readonly DBNAME = './src/repositories/database.db';

    private readonly SQL_TABLES_SCRIPT =
        `
            CREATE TABLE IF NOT EXISTS users (
                userID TEXT PRIMARY KEY,
                userName TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS auctions (
                auctionID TEXT PRIMARY KEY,
                winnerID TEXT NOT NULL,
                name TEXT NOT NULL UNIQUE,
                description TEXT NOT NULL,
                photo TEXT NOT NULL,
                initialPrice TEXT NOT NULL,
                finalPrice TEXT NOT NULL,
                type TEXT NOT NULL,
                duration INT NOT NULL,
                openAt DATE NOT NULL,
                createdAt DATE NOT NULL,
                updatedAt DATE NOT NULL,
                deletedAt DATE NOT NULL,
                FOREIGN KEY (winnerID) REFERENCES users (userID)
            );
        `;

    constructor ()
    {
        this.database = new sqlite3.Database(this.DBNAME, (err) =>
        {
            if (err)
            {
                console.log(err.message);
                throw err;
            }
            else
            {
                this.database.exec(this.SQL_TABLES_SCRIPT);
                console.log(`'${this.DBNAME}' created successfully.`);
            }
        });
    }

    getDatabase ()
    {
        return this.database;
    }
}

const databaseInstance = new DatabaseInstance();
export { databaseInstance };
