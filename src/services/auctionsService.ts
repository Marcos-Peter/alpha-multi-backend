/* eslint-disable newline-per-chained-call */
import { AuctionDTO } from '../models/DTOs/AuctionDTO';
import { RedisConnection } from '../redis/RedisConnection';
import { Service } from './Service';
import { UnauthorizedError } from '../errors/UnauthorizedError';
import { UserDTO } from '../models/DTOs/UserDTO';
import { ValidationError } from '../errors/ValidationError';
import { auctionsDAO } from '../repositories/DAOs/auctionsDAO';
import { auctionsPropertiesValidator } from '../validators/auctionsPropertiesValidator';
import { getDateWithoutTimeZone } from '../utils/getDateWithoutTimeZone';
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

        if (existentAuction.length > 0) throw new UnauthorizedError(`Auction ${auction.name} already exists in database.`);
        if (getDateWithoutTimeZone(auction.open_at) >= getDateWithoutTimeZone(auction.close_at)) throw new UnauthorizedError('Auction must have close date higher than open date.');

        const result = await auctionsDAO.createAuction(auction);

        return this.serviceResponseBuilder(result, `Error when inserting auction ${auction.name} in database.`, 201);
    }

    async isAuctionOpened (name: string)
    {
        const existentAuction = (await this.getAuctionByName(name)).data as AuctionDTO;

        const now = getDateWithoutTimeZone();
        const result = now >= getDateWithoutTimeZone(existentAuction.open_at) && now < getDateWithoutTimeZone(existentAuction.close_at);

        return this.serviceResponseBuilder([ String(result) ], '');
    }

    async isAuctionClosed (name: string)
    {
        const existentAuction = (await this.getAuctionByName(name)).data as AuctionDTO;

        const now = getDateWithoutTimeZone();
        const result = now >= getDateWithoutTimeZone(existentAuction.close_at);

        return this.serviceResponseBuilder([ String(result) ], '');
    }

    async updateAuction (auction: AuctionDTO)
    {
        if (!auction.auction_id) throw new ValidationError('auction_id was not informed.');
        auctionsPropertiesValidator.validateAll(auction);

        const existentAuction = (await this.getAuctionByID(auction.auction_id)).data as AuctionDTO;

        if (existentAuction.winner_id) throw new UnauthorizedError('Closed auction cannot be updated.');

        const now = getDateWithoutTimeZone();
        if (now >= getDateWithoutTimeZone(existentAuction.open_at)) throw new UnauthorizedError('Auction is already opened, not allowed to update an already opened Auction.');

        const result = await auctionsDAO.updateAuction(auction);

        return this.serviceResponseBuilder(result, `Error when updating auction ${auction.auction_id} in database.`);
    }

    async deleteAuction (name: string)
    {
        const existentAuction = (await this.getAuctionByName(name)).data as AuctionDTO;

        if (existentAuction.winner_id) throw new UnauthorizedError('Closed auction cannot be deleted.');

        const now = getDateWithoutTimeZone();
        if (now >= getDateWithoutTimeZone(existentAuction.open_at)) throw new UnauthorizedError('Auction is already opened, not allowed to delete an already opened Auction.');

        const result = await auctionsDAO.deleteAuction(existentAuction.auction_id as string);

        return this.serviceResponseBuilder(result, `Error when deleting auction ${name} in database.`);
    }

    async closeAuction (auctionName: string)
    {
        auctionsPropertiesValidator.validateAuctionName(auctionName);

        const existentAuction = (await this.getAuctionByName(auctionName)).data as AuctionDTO;

        if (existentAuction.winner_id) throw new UnauthorizedError('Closed auction cannot be closed again.');

        const now = getDateWithoutTimeZone();
        if (now < getDateWithoutTimeZone(existentAuction.close_at)) throw new UnauthorizedError('Auctions can be closed only after time has passed due close_at date.');

        const winnerData = await this.getWinnerData(existentAuction.auction_id as string);

        const result = await auctionsDAO.closeAuction(auctionName, winnerData?.winnerID as string, winnerData?.winnerPrice as string);

        return this.serviceResponseBuilder(result, `Error when closing auction ${auctionName} in database.`);
    }

    private async getWinnerData (auctionID: string)
    {
        const lastOffer = (await RedisConnection.redisConn.get(auctionID))?.split(',').pop()?.split(' ');

        if (!lastOffer) return undefined;

        const winnerName = lastOffer[0];
        const winnerPrice = lastOffer.pop();

        const winner = (await usersService.getUserByUserName(winnerName)).data as UserDTO;

        const result =
        {
            winnerID: winner.userid,
            winnerPrice
        };

        return result;
    }
}

const auctionsService = new AuctionsService();
export { auctionsService };
