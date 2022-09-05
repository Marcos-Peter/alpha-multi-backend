import { Request, Response } from 'express';
import { Controller } from './Controller';
import { usersService } from '../services/usersService';

class UsersController extends Controller
{
    async getUserByID (req: Request, res: Response)
    {
        this.callService(res, usersService.getUserByID.bind(usersService), req.params.id);
    }

    async getUserByUserName (req: Request, res: Response)
    {
        this.callService(res, usersService.getUserByUserName.bind(usersService), req.params.username);
    }

    async getAllUsers (req: Request, res: Response)
    {
        this.callService(res, usersService.getAllUsers.bind(usersService));
    }

    async createUser (req: Request, res: Response)
    {
        this.callService(res, usersService.createUser.bind(usersService), req.body);
    }

    async changePassword (req: Request, res: Response)
    {
        this.callService(res, usersService.changePassword.bind(usersService), req.body);
    }

    async authenticateUser (req: Request, res: Response)
    {
        this.callService(res, usersService.authenticateUser.bind(usersService), { req, res, user: req.body } );
    }

    async checkIfUserIsAuthenticated (req: Request, res: Response)
    {
        this.callService(res, usersService.checkIfUserIsAuthenticated.bind(usersService), { req, res } );
    }

    async logout (req: Request, res: Response)
    {
        this.callService(res, usersService.logout.bind(usersService), res);
    }
}

const usersController = new UsersController();
export { usersController };
