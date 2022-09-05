import { Server, WebSocket } from 'ws';

interface ClientMessage
{
    auctionName: string;
    userName: string;
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

        this.ws.on('connection', (ws, req) =>
        {
            const url = new URL(req.url as string, `http://${req.headers.host}`);
            this.updateAuctionRooms(url.searchParams, ws);

            ws.on('message', (data) =>
            {
                this.broadCast(JSON.parse(data as any) as ClientMessage);
            });

            ws.on('close', () =>
            {
                console.log('Client has disconnected.');
            });

            ws.on('error', (err) =>
            {
                console.log(`Error occurred: ${err}`);
            });
        });

        console.log(`Websocket server is running on port ${this.port}`);
    }

    private updateAuctionRooms (params: URLSearchParams, ws: WebSocket)
    {
        const auctionName = params.get('auctionName') as string;

        if (Object.prototype.hasOwnProperty.call(this.auctionRooms, auctionName))
        {
            this.auctionRooms[auctionName].push(ws);

            return;
        }

        this.auctionRooms[auctionName] = [ ws ];
    }

    private broadCast (clientMessage: ClientMessage)
    {
        for (const client of this.auctionRooms[clientMessage.auctionName]) client.send(`${clientMessage.userName} deu um lance de ${clientMessage.message}`);
    }
}

export { WebSocketServer };
