import { Server, WebSocket } from 'ws';
import { AuctionDTO } from '../models/DTOs/AuctionDTO';
import { RedisConnection } from '../redis/RedisConnection';
import { auctionsService } from '../services/auctionsService';

interface ClientMessage
{
    auctionID: string;
    username: string;
    message: string;
}

interface AuctionData
{
    chatLog: string[];
    auctionClients: WebSocket[];
}

interface AuctionRoom
{
    [auctionID: string]: AuctionData;
}

class WebSocketServer
{
    private readonly port;
    private ws: Server<WebSocket> | undefined;
    private readonly auctionRooms = {} as AuctionRoom;

    constructor (port: number)
    {
        this.port = port;
        RedisConnection.redisConn.connect();
    }

    init ()
    {
        this.ws = new WebSocket.Server({ port: this.port, path: '/ws' });

        this.ws.on('connection', async (ws, req) =>
        {
            const url = new URL(req.url as string, `http://${req.headers.host}`);
            const auctionID = url.searchParams.get('auctionID') as string;

            const isOpened = await this.isAuctionOpened(auctionID);

            if (!isOpened)
            {
                ws.close();

                return;
            }

            this.updateAuctionRooms(auctionID, ws);

            ws.on('message', async (data) =>
            {
                const message = JSON.parse(data as any) as ClientMessage;

                const isClosed = await this.isAuctionClosed(message.auctionID);

                if (isClosed)
                {
                    ws.close();

                    return;
                }

                this.broadCast(message);
            });
        });

        console.log(`Alpha Multi Websocket server is running on port ${this.port}`);
    }

    private async isAuctionOpened (auctionID: string)
    {
        let isOpened = false;

        try
        {
            const existentAuction = (await auctionsService.getAuctionByID(auctionID)).data as AuctionDTO;
            isOpened = (await auctionsService.isAuctionOpened(existentAuction.name)).data as string === 'true';
        }
        catch (error)
        {
            console.log(`Error when checking if auction ${auctionID} is opened: ${error}`);
        }

        return isOpened;
    }

    private async isAuctionClosed (auctionID: string)
    {
        let isClosed = false;

        try
        {
            const existentAuction = (await auctionsService.getAuctionByID(auctionID)).data as AuctionDTO;
            isClosed = (await auctionsService.isAuctionClosed(existentAuction.name)).data as string === 'true';
        }
        catch (error)
        {
            console.log(`Error when checking if auction ${auctionID} is closed: ${error}`);
        }

        return isClosed;
    }

    private updateAuctionRooms (auctionID: string, ws: WebSocket)
    {
        if (Object.prototype.hasOwnProperty.call(this.auctionRooms, auctionID))
        {
            this.auctionRooms[auctionID].auctionClients.push(ws);

            return;
        }

        const auctionData = { chatLog: [], auctionClients: [ ws ] } as AuctionData;
        this.auctionRooms[auctionID] = auctionData;
    }

    private broadCast (clientMessage: ClientMessage)
    {
        const message = `${clientMessage.username} deu um lance de ${clientMessage.message}`;

        this.auctionRooms[clientMessage.auctionID].chatLog.push(message);
        const chatLog = this.auctionRooms[clientMessage.auctionID].chatLog.toString();

        RedisConnection.redisConn.set(clientMessage.auctionID, chatLog);

        for (const client of this.auctionRooms[clientMessage.auctionID].auctionClients) client.send(message);
    }
}

const websocketServer = new WebSocketServer(Number(process.env.PORT_WEBSOCKET) || 8080);
export { websocketServer };
