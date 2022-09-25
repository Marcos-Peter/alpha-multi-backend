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
        app.use('/getAuctionData', this.getAuctionData());
        app.use('/getAuctionsUserWon', this.getAuctionsUserWon());
        app.use('/isAuctionOpened', this.isAuctionOpened());
        app.use('/isAuctionClosed', this.isAuctionClosed());
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

        closeAuctionRoute.put('/:name', authToken.verifyTokenMiddleWare.bind(authToken), auctionsController.closeAuction.bind(auctionsController));

        return closeAuctionRoute;
    }

    private isAuctionOpened ()
    {
        const isAuctionOpenedRoute = express.Router();

        isAuctionOpenedRoute.get('/:name', authToken.verifyTokenMiddleWare.bind(authToken), auctionsController.isAuctionOpened.bind(auctionsController));

        return isAuctionOpenedRoute;
    }

    private isAuctionClosed ()
    {
        const isAuctionClosedRoute = express.Router();

        isAuctionClosedRoute.get('/:name', authToken.verifyTokenMiddleWare.bind(authToken), auctionsController.isAuctionClosed.bind(auctionsController));

        return isAuctionClosedRoute;
    }

    private getAuctionData ()
    {
        const getAuctionData = express.Router();

        getAuctionData.get('/:name', authToken.verifyTokenMiddleWare.bind(authToken), auctionsController.getAuctionData.bind(auctionsController));

        return getAuctionData;
    }

    private getAuctionsUserWon ()
    {
        const getAuctionsUserWon = express.Router();

        getAuctionsUserWon.get('/', authToken.verifyTokenMiddleWare.bind(authToken), auctionsController.getAuctionsUserWon.bind(auctionsController));

        return getAuctionsUserWon;
    }
}

const routes = new Routes();
export { routes };
