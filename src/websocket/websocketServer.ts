import { Server, WebSocket } from 'ws';
import { RedisConnection } from '../redis/RedisConnection';

interface ClientMessage
{
    auctionID: string;
    username: string;
    message: string;
}

interface AuctionClients
{
    userName: string;
    websocket: WebSocket;
}

interface AuctionData
{
    chatLog: string[];
    auctionClients: AuctionClients[];
}

interface AuctionRoom
{
    [auctionID: string]: AuctionData;
}

class WebSocketServer
{
    private readonly port;
    private wsServer: Server<WebSocket> | undefined;
    private readonly auctionRooms = {} as AuctionRoom;

    constructor (port: number)
    {
        this.port = port;
        RedisConnection.redisConn.connect();
    }

    init ()
    {
        this.wsServer = new WebSocket.Server({ port: this.port, path: '/ws' });

        this.wsServer.on('connection', (ws, req) =>
        {
            const url = new URL(req.url as string, `http://${req.headers.host}`);
            const auctionID = url.searchParams.get('auctionID') as string;
            const userName = url.searchParams.get('userName') as string;

            this.updateAuctionRooms(auctionID, userName, ws);

            ws.on('message', (data) =>
            {
                const message = JSON.parse(data as any) as ClientMessage;
                this.broadCast(message);
            });
        });

        console.log(`Alpha Multi Websocket server is running on port ${this.port}`);
    }

    getAuctionData (auctionID: string)
    {
        if (Object.prototype.hasOwnProperty.call(this.auctionRooms, auctionID)) return this.auctionRooms[auctionID];
    }

    private updateAuctionRooms (auctionID: string, userName: string, ws: WebSocket)
    {
        if (Object.prototype.hasOwnProperty.call(this.auctionRooms, auctionID))
        {
            const existentUserIndex = this.auctionRooms[auctionID].auctionClients.findIndex((client) => client.userName === userName);

            if (existentUserIndex !== -1)
            {
                this.auctionRooms[auctionID].auctionClients[existentUserIndex] = { userName, websocket: ws };

                return;
            }

            this.auctionRooms[auctionID].auctionClients.push({ userName, websocket: ws });

            return;
        }

        const auctionData = { chatLog: [], auctionClients: [ { userName, websocket: ws } ] } as AuctionData;
        this.auctionRooms[auctionID] = auctionData;
    }

    private broadCast (clientMessage: ClientMessage)
    {
        const message = `${clientMessage.username} deu um lance de ${clientMessage.message}`;

        this.auctionRooms[clientMessage.auctionID].chatLog.push(message);
        const chatLog = this.auctionRooms[clientMessage.auctionID].chatLog.toString();

        RedisConnection.redisConn.set(clientMessage.auctionID, chatLog);

        for (const client of this.auctionRooms[clientMessage.auctionID].auctionClients) client.websocket.send(message);
    }
}

const websocketServer = new WebSocketServer(Number(process.env.PORT_WEBSOCKET) || 8080);
export { websocketServer };
