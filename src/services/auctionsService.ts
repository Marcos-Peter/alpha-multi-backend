/* eslint-disable newline-per-chained-call */
import { AuctionDTO } from '../models/DTOs/AuctionDTO';
import { Service } from './Service';
import { UnauthorizedError } from '../errors/UnauthorizedError';
import { UserDTO } from '../models/DTOs/UserDTO';
import { ValidationError } from '../errors/ValidationError';
import { auctionsDAO } from '../repositories/DAOs/auctionsDAO';
import { auctionsPropertiesValidator } from '../validators/auctionsPropertiesValidator';
import { usersService } from './usersService';

class AuctionsService extends Service
{
    async getAuctionByID (auction_id: string)
    {
        const result = await auctionsDAO.getAuctionByID(auction_id);

        return this.serviceResponseBuilder(result, `Auction ${auction_id} does not exist.`);
    }

    async getAuctionByName (name: string)
    {
        auctionsPropertiesValidator.validateAuctionName(name);
        const result = await auctionsDAO.getAuctionByName(name);

        return this.serviceResponseBuilder(result, `Auction ${name} does not exist.`);
    }

    async getAllAuctions ()
    {
        const result = await auctionsDAO.getAllAuctions();
        if (typeof result === 'object') return this.serviceResponseBuilder([ result ], 'There are no auctions in database.');

        return this.serviceResponseBuilder(result, 'There are no auctions in database.');
    }

    async createAuction (auction: AuctionDTO)
    {
        auctionsPropertiesValidator.validateAll(auction);
        const existentAuction = await auctionsDAO.getAuctionByName(auction.name);

        if (existentAuction.length > 0) throw new UnauthorizedError('Auction already exists in database.');

        const result = await auctionsDAO.createAuction(auction);

        return this.serviceResponseBuilder(result, `Error when inserting auction ${auction.name} in database.`, 201);
    }

    async updateAuction (auction: AuctionDTO)
    {
        if (!auction.auction_id) throw new ValidationError('auction_id was not informed.');
        auctionsPropertiesValidator.validateAll(auction);

        const existentAuction = (await this.getAuctionByID(auction.auction_id)).data as AuctionDTO;

        if (existentAuction.closed_at) throw new UnauthorizedError('Closed auction cannot be updated.');
        if (new Date() >= new Date(existentAuction.open_at)) throw new UnauthorizedError('Auction is already opened, not allowed to update an already opened Auction.');

        const result = await auctionsDAO.updateAuction(auction);

        return this.serviceResponseBuilder(result, `Error when updating auction ${auction.auction_id} in database.`);
    }

    async deleteAuction (name: string)
    {
        const existentAuction = (await this.getAuctionByName(name)).data as AuctionDTO;

        if (existentAuction.closed_at) throw new UnauthorizedError('Closed auction cannot be deleted.');
        if (new Date() >= new Date(existentAuction.open_at)) throw new UnauthorizedError('Auction is already opened, not allowed to delete an already opened Auction.');

        const result = await auctionsDAO.deleteAuction(existentAuction.auction_id as string);

        return this.serviceResponseBuilder(result, `Error when deleting auction ${name} in database.`);
    }

    async closeAuction (param: { auctionName: string, winnerName: string, final_price: string })
    {
        auctionsPropertiesValidator.validateAuctionName(param.auctionName);
        auctionsPropertiesValidator.validateAuctionFinalPrice(param.final_price);

        const winner = (await usersService.getUserByUserName(param.winnerName)).data as UserDTO;
        const existentAuction = (await this.getAuctionByName(param.auctionName)).data as AuctionDTO;

        if (new Date() < new Date(existentAuction.open_at)) throw new UnauthorizedError('Only opened auctions can be closed.');
        if (existentAuction.closed_at) throw new UnauthorizedError('Closed auction cannot be closed again.');

        const result = await auctionsDAO.closeAuction(param.auctionName, winner.userid as string, param.final_price);

        return this.serviceResponseBuilder(result, `Error when closing auction ${param.auctionName} in database.`);
    }
}

const auctionsService = new AuctionsService();
export { auctionsService };
