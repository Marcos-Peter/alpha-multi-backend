import { Request, Response } from 'express';
import { Controller } from './Controller';
import { auctionsService } from '../services/auctionsService';

class AuctionsController extends Controller
{
    async getAuctionByID (req: Request, res: Response)
    {
        this.callService(res, auctionsService.getAuctionByID.bind(auctionsService), req.params.id);
    }

    async getAuctionByName (req: Request, res: Response)
    {
        this.callService(res, auctionsService.getAuctionByName.bind(auctionsService), req.params.name);
    }

    async getAllAuctions (req: Request, res: Response)
    {
        this.callService(res, auctionsService.getAllAuctions.bind(auctionsService));
    }

    async createAuction (req: Request, res: Response)
    {
        this.callService(res, auctionsService.createAuction.bind(auctionsService), req.body);
    }

    async isAuctionOpened (req: Request, res: Response)
    {
        this.callService(res, auctionsService.isAuctionOpened.bind(auctionsService), req.params.name);
    }

    async isAuctionClosed (req: Request, res: Response)
    {
        this.callService(res, auctionsService.isAuctionClosed.bind(auctionsService), req.params.name);
    }

    async updateAuction (req: Request, res: Response)
    {
        this.callService(res, auctionsService.updateAuction.bind(auctionsService), req.body);
    }

    async deleteAuction (req: Request, res: Response)
    {
        this.callService(res, auctionsService.deleteAuction.bind(auctionsService), req.params.name);
    }

    async closeAuction (req: Request, res: Response)
    {
        this.callService(res, auctionsService.closeAuction.bind(auctionsService), req.body);
    }
}

const auctionsController = new AuctionsController();
export { auctionsController };
