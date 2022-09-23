/* eslint-disable newline-per-chained-call */
import { AuctionDTO } from '../../models/DTOs/AuctionDTO';
import { DAO } from './DAO';
import { getDateWithoutTimeZone } from '../../utils/getDateWithoutTimeZone';
import { v4 as uuiv4 } from 'uuid';

class AuctionsDAO extends DAO
{
    getAuctionByID (auctionID: string)
    {
        const sql = `SELECT *
                    FROM auctions WHERE auction_id = $1`;

        return this.executeSQL<AuctionDTO>(sql, [ auctionID ]);
    }

    getAuctionByName (name: string)
    {
        const sql = `SELECT *
                    FROM auctions WHERE name = $1`;

        return this.executeSQL<AuctionDTO>(sql, [ name ]);
    }

    getAllAuctions ()
    {
        const sql = `SELECT *
                    FROM auctions`;

        return this.executeSQL<AuctionDTO>(sql, []);
    }

    createAuction (auction: AuctionDTO)
    {
        const sql = `INSERT INTO auctions (
                                    auction_id, 
                                    name, 
                                    description, 
                                    photo, 
                                    initial_price, 
                                    open_at,
                                    created_at,
                                    close_at
                                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`;

        const now = getDateWithoutTimeZone();
        const date = now.toISOString().split('T');
        const createdAt = `${date[0]} ${date[1].split('.')[0]}`;

        return this.executeSQL<AuctionDTO>(sql,
            [
                uuiv4(),
                auction.name,
                auction.description,
                auction.photo,
                auction.initial_price,
                auction.open_at,
                createdAt,
                auction.close_at
            ]);
    }

    updateAuction (auction: AuctionDTO)
    {
        const sql = `UPDATE auctions SET (
                                    name, 
                                    description, 
                                    photo, 
                                    initial_price, 
                                    open_at,
                                    updated_at,
                                    close_at
                                ) = ($1, $2, $3, $4, $5, $6, $7)
                                WHERE auction_id = $8 
                                RETURNING *`;

        const now = getDateWithoutTimeZone();
        const date = now.toISOString().split('T');
        const updatedAt = `${date[0]} ${date[1].split('.')[0]}`;

        return this.executeSQL<AuctionDTO>(sql,
            [
                auction.name,
                auction.description,
                auction.photo,
                auction.initial_price,
                auction.open_at,
                updatedAt,
                auction.close_at,
                auction.auction_id
            ]);
    }

    deleteAuction (auctionID: string)
    {
        const sql = 'DELETE FROM auctions WHERE auction_id = $1 RETURNING *';

        return this.executeSQL<AuctionDTO>(sql, [ auctionID ]);
    }

    closeAuction (auctionName: string, winnerID: string, winnerPrice: string)
    {
        const sql = 'UPDATE auctions SET (winner_id, winner_price) = ($1, $2) WHERE name = $3 RETURNING *';

        return this.executeSQL<AuctionDTO>(sql,
            [
                winnerID,
                winnerPrice,
                auctionName
            ]);
    }
}

const auctionsDAO = new AuctionsDAO();
export { auctionsDAO };
