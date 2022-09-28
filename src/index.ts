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
const appAdmin = express();

const privateKey  = fs.readFileSync('certificate.key', 'utf8');
const certificate = fs.readFileSync('certificate.crt', 'utf8');

const credentials = { key: privateKey, cert: certificate };

app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

appAdmin.use(cors({ origin: true, credentials: true }));
appAdmin.use(cookieParser());
appAdmin.use(express.urlencoded({ extended: false }));
appAdmin.use(express.json());

app.use(express.static('/root/osArrematadores/alpha-multi-frontend/dist'));
appAdmin.use(express.static('/root/osArrematadores/alpha-multi-frontend-admin/dist'));

routes.initRoutes(app);
routes.initRoutes(appAdmin);

const port = process.env.PORT || 3000;

const httpsServer = https.createServer(credentials, app);
const httpsServerAdmin = https.createServer(credentials, appAdmin);

httpsServer.listen(port, () =>
{
    console.log(`Alpha Multi Server is running at port ${port}`);
});

httpsServerAdmin.listen(3334, () =>
{
    console.log(`Alpha Multi Server Admin is running at port ${3334}`);
});

websocketServer.init();
