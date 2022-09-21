import express, { Express } from 'express';
import { auctionsController } from '../controllers/auctionsController';
import { authToken } from '../middlewares/AuthToken';
import { usersController } from '../controllers/usersController';

class Routes
{
    initRoutes (app: Express)
    {
        app.use('/createLogin', this.createLoginRoutes());
        app.use('/changePassword', this.changePasswordRoutes());
        app.use('/authenticateLogin', this.authenticateLoginRoutes());
        app.use('/checkLogin', this.checkLoginRoutes());
        app.use('/logout', this.getLogoutRoutes());

        app.use('/allAuctions', this.getAllAuctions());
        app.use('/getAuction', this.getAuction());
        app.use('/createAuction', this.createAuction());
        app.use('/updateAuction', this.updateAuction());
        app.use('/deleteAuction', this.deleteAuction());
        app.use('/closeAuction', this.closeAuction());
    }

    private createLoginRoutes ()
    {
        const createLoginRoutes = express.Router();

        createLoginRoutes.post('/', usersController.createUser.bind(usersController));

        return createLoginRoutes;
    }

    private changePasswordRoutes ()
    {
        const changePasswordRoutes = express.Router();

        changePasswordRoutes.post('/', authToken.verifyTokenMiddleWare.bind(authToken), usersController.changePassword.bind(usersController));

        return changePasswordRoutes;
    }

    private authenticateLoginRoutes ()
    {
        const authenticateLoginRoutes = express.Router();

        authenticateLoginRoutes.post('/', usersController.authenticateUser.bind(usersController));

        return authenticateLoginRoutes;
    }

    private checkLoginRoutes ()
    {
        const checkLoginRoutes = express.Router();

        checkLoginRoutes.get('/', usersController.checkIfUserIsAuthenticated.bind(usersController));

        return checkLoginRoutes;
    }

    private getLogoutRoutes ()
    {
        const getLogoutRoutes = express.Router();

        getLogoutRoutes.get('/', authToken.verifyTokenMiddleWare.bind(authToken), usersController.logout.bind(usersController));

        return getLogoutRoutes;
    }

    private getAllAuctions ()
    {
        const getAllAuctionsRoute = express.Router();

        getAllAuctionsRoute.get('/', authToken.verifyTokenMiddleWare.bind(authToken), auctionsController.getAllAuctions.bind(auctionsController));

        return getAllAuctionsRoute;
    }

    private getAuction ()
    {
        const getAllAuctionsRoute = express.Router();

        getAllAuctionsRoute.get('/:id', authToken.verifyTokenMiddleWare.bind(authToken), auctionsController.getAuctionByID.bind(auctionsController));

        return getAllAuctionsRoute;
    }

    private createAuction ()
    {
        const createAuctionRoute = express.Router();

        createAuctionRoute.post('/', authToken.verifyTokenMiddleWare.bind(authToken), auctionsController.createAuction.bind(auctionsController));

        return createAuctionRoute;
    }

    private updateAuction ()
    {
        const updateAuctionRoute = express.Router();

        updateAuctionRoute.put('/', authToken.verifyTokenMiddleWare.bind(authToken), auctionsController.updateAuction.bind(auctionsController));

        return updateAuctionRoute;
    }

    private deleteAuction ()
    {
        const deleteAuctionRoute = express.Router();

        deleteAuctionRoute.delete('/:name', authToken.verifyTokenMiddleWare.bind(authToken), auctionsController.deleteAuction.bind(auctionsController));

        return deleteAuctionRoute;
    }

    private closeAuction ()
    {
        const closeAuctionRoute = express.Router();

        closeAuctionRoute.put('/', authToken.verifyTokenMiddleWare.bind(authToken), auctionsController.closeAuction.bind(auctionsController));

        return closeAuctionRoute;
    }
}

const routes = new Routes();
export { routes };
