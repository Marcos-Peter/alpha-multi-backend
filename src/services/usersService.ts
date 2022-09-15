import { Request, Response } from 'express';
import { Service } from './Service';
import { UnauthorizedError } from '../errors/UnauthorizedError';
import { UserDTO } from '../models/DTOs/UserDTO';
import { authToken } from '../middlewares/AuthToken';
import { passwordCryptography } from '../utils/passwordCryptography';
import { usersDAO } from '../repositories/DAOs/usersDAO';
import { usersPropertiesValidator } from '../validators/usersPropertiesValidator';

class UsersService extends Service
{
    async getUserByID (userid: string)
    {
        const result = await usersDAO.getUserByID(userid);

        return this.serviceResponseBuilder(result, `User ${userid} does not exist.`);
    }

    async getUserByUserName (username: string)
    {
        usersPropertiesValidator.validateUserName(username);
        const result = await usersDAO.getUserByUserName(username);

        return this.serviceResponseBuilder(result, `User ${username} does not exist.`);
    }

    async getAllUsers ()
    {
        const result = await usersDAO.getAllUsers();

        return this.serviceResponseBuilder(result, 'There are no users in database.');
    }

    async createUser (user: UserDTO)
    {
        usersPropertiesValidator.validateAll(user);
        const existentUser = await usersDAO.getUserByUserName(user.username);

        if (existentUser.length > 0) throw new UnauthorizedError('User already exists in database.');

        const result = await usersDAO.createUser(user);

        return this.serviceResponseBuilder(result, `Error when inserting user ${user.username} in database.`, 201);
    }

    async changePassword (user: { username: string, currentPassword: string, newPassword: string })
    {
        usersPropertiesValidator.validateUserName(user.username);
        usersPropertiesValidator.validatePassword(user.currentPassword);
        usersPropertiesValidator.validatePassword(user.newPassword);

        const { userid, password } = (await this.getUserByUserName(user.username)).data as UserDTO;

        if (!passwordCryptography.comparePassword(user.currentPassword, password)) throw new UnauthorizedError('Password incorrect.');

        const result = await usersDAO.updateUserPassword(userid as string, user.newPassword);

        return this.serviceResponseBuilder(result, `Error when updating ${user.username}'s password.`);
    }

    async authenticateUser (param: { req: Request, res: Response, user: UserDTO })
    {
        usersPropertiesValidator.validateAll(param.user);
        const { username, password } = (await this.getUserByUserName(param.user.username)).data as UserDTO;

        if (!passwordCryptography.comparePassword(param.user.password, password)) throw new UnauthorizedError('Password incorrect.');

        const token = authToken.generateToken(username);
        // TODO change to secure true
        param.res.cookie('bearer', token, { secure: false, sameSite: true, httpOnly: true, maxAge: authToken.tokenExpirationTime * 1000 });

        return this.serviceResponseBuilder([ { username } ], '');
    }

    async checkIfUserIsAuthenticated (param: { req: Request, res: Response })
    {
        const result = authToken.verifyToken(param.req.cookies.bearer);

        return this.serviceResponseBuilder([ result ], '');
    }

    async logout (res: Response)
    {
        res.clearCookie('bearer');

        return this.serviceResponseBuilder([ 'Done' ], '');
    }
}

const usersService = new UsersService();
export { usersService };
