import { Server, WebSocket } from 'ws';
import { auctionsService } from '../services/auctionsService';

interface ClientMessage
{
    auctionName: string;
    username: string;
    message: string;
}

interface AuctionRoom
{
    [auctionName: string]: WebSocket[];
}

class WebSocketServer
{
    private readonly port;
    private ws: Server<WebSocket> | undefined;
    private readonly auctionRooms = {} as AuctionRoom;

    constructor (port: number)
    {
        this.port = port;
    }

    init ()
    {
        this.ws = new WebSocket.Server({ port: this.port, path: '/ws' });

        this.ws.on('connection', async (ws, req) =>
        {
            const url = new URL(req.url as string, `http://${req.headers.host}`);
            const auctionName = url.searchParams.get('auctionName') as string;

            const isOpened = await this.isAuctionOpened(auctionName);

            if (!isOpened)
            {
                ws.close();

                return;
            }

            this.updateAuctionRooms(auctionName, ws);

            ws.on('message', async (data) =>
            {
                const message = JSON.parse(data as any) as ClientMessage;

                const isClosed = await this.isAuctionClosed(message.auctionName);

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

    private async isAuctionOpened (auctionName: string)
    {
        let isOpened = false;

        try
        {
            isOpened = (await auctionsService.isAuctionOpened(auctionName)).data as boolean;
        }
        catch (error)
        {
            console.log(`Error when checking if auction ${auctionName} is opened: ${error}`);
        }

        return isOpened;
    }

    private async isAuctionClosed (auctionName: string)
    {
        let isClosed = false;

        try
        {
            isClosed = (await auctionsService.isAuctionClosed(auctionName)).data as boolean;
        }
        catch (error)
        {
            console.log(`Error when checking if auction ${auctionName} is closed: ${error}`);
        }

        return isClosed;
    }

    private updateAuctionRooms (auctionName: string, ws: WebSocket)
    {
        if (Object.prototype.hasOwnProperty.call(this.auctionRooms, auctionName))
        {
            this.auctionRooms[auctionName].push(ws);

            return;
        }

        this.auctionRooms[auctionName] = [ ws ];
    }

    private broadCast (clientMessage: ClientMessage)
    {
        for (const client of this.auctionRooms[clientMessage.auctionName]) client.send(`${clientMessage.username} deu um lance de ${clientMessage.message}`);
    }
}

const websocketServer = new WebSocketServer(Number(process.env.PORT_WEBSOCKET) || 8080);
export { websocketServer };
