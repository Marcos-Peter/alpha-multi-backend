import { DAO } from './DAO';
import { UserDTO } from '../../models/DTOs/UserDTO';
import { passwordCryptography } from '../../utils/passwordCryptography';
import { v4 as uuiv4 } from 'uuid';

class UsersDAO extends DAO
{
    getUserByID (userID: string)
    {
        const sql = `SELECT userID,
                            userName,
                            password
                    FROM users WHERE userID = $1`;

        return this.executeSQL<UserDTO>(sql, [ userID ]);
    }

    getUserByUserName (userName: string)
    {
        const sql = `SELECT userID,
                            userName,
                            password
                    FROM users WHERE userName = $1`;

        return this.executeSQL<UserDTO>(sql, [ userName ]);
    }

    getAllUsers ()
    {
        const sql = `SELECT userID,
                            userName
                    FROM users`;

        return this.executeSQL<UserDTO>(sql, []);
    }

    createUser (user: UserDTO)
    {
        const sql = 'INSERT INTO users (userID, userName, password) VALUES ($1, $2, $3) RETURNING userID, userName';

        return this.executeSQL<UserDTO>(sql,
            [
                uuiv4(),
                user.userName,
                passwordCryptography.encryptPassword(user.password)
            ]);
    }

    updateUserPassword (userID: string, newPassword: string)
    {
        const sql = 'UPDATE users SET password = $1 WHERE userID = $2 RETURNING userID, userName';

        return this.executeSQL<UserDTO>(sql,
            [
                passwordCryptography.encryptPassword(newPassword),
                userID
            ]);
    }
}

const usersDAO = new UsersDAO();
export { usersDAO };
