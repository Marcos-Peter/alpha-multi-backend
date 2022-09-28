import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import fs from 'fs';
import https from 'https';
import { routes } from './routes/routesList';
import { websocketServer } from './websocket/websocketServer';

dotenv.config();

const app = express();

// const privateKey  = fs.readFileSync('certificate.key', 'utf8');
// const certificate = fs.readFileSync('certificate.crt', 'utf8');

// const credentials = { key: privateKey, cert: certificate };

app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

routes.initRoutes(app);

const port = process.env.PORT || 3000;

const httpsServer = https.createServer(app);

httpsServer.listen(port, () =>
{
    console.log(`Alpha Multi Server is running at port ${port}`);
});

websocketServer.init();
