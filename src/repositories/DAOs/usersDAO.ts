import { DAO } from './DAO';
import { UserDTO } from '../../models/DTOs/UserDTO';
import { passwordCryptography } from '../../utils/passwordCryptography';
import { v4 as uuiv4 } from 'uuid';

class UsersDAO extends DAO
{
    getUserByID (userid: string)
    {
        const sql = `SELECT userid,
                            username,
                            password
                    FROM users WHERE userid = $1`;

        return this.executeSQL<UserDTO>(sql, [ userid ]);
    }

    getUserByUserName (username: string)
    {
        const sql = `SELECT userid,
                            username,
                            password
                    FROM users WHERE username = $1`;

        return this.executeSQL<UserDTO>(sql, [ username ]);
    }

    getAllUsers ()
    {
        const sql = `SELECT userid,
                            username
                    FROM users`;

        return this.executeSQL<UserDTO>(sql, []);
    }

    createUser (user: UserDTO)
    {
        const sql = 'INSERT INTO users (userid, username, password) VALUES ($1, $2, $3) RETURNING userid, username';

        return this.executeSQL<UserDTO>(sql,
            [
                uuiv4(),
                user.username,
                passwordCryptography.encryptPassword(user.password)
            ]);
    }

    updateUserPassword (userid: string, newPassword: string)
    {
        const sql = 'UPDATE users SET password = $1 WHERE userid = $2 RETURNING userid, username';

        return this.executeSQL<UserDTO>(sql,
            [
                passwordCryptography.encryptPassword(newPassword),
                userid
            ]);
    }
}

const usersDAO = new UsersDAO();
export { usersDAO };
