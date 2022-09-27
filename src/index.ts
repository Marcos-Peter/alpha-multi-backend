import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { routes } from './routes/routesList';
import { websocketServer } from './websocket/websocketServer';

dotenv.config();

const app = express();
const appAdmin = express();

app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static(`${__dirname}/../alpha-multi-frontend/dist`));
appAdmin.use(express.static(`${__dirname}/../alpha-multi-frontend-admin/dist`));

routes.initRoutes(app);

const port = process.env.PORT || 3000;
const portAdmin = 3334;

app.listen(port, () =>
{
    console.log(`Alpha Multi Server is running at https://localhost:${port}`);
});

appAdmin.listen(portAdmin, () =>
{
    console.log(`Alpha Multi FrontEnd Admin is running at https://localhost:${portAdmin}`);
});

websocketServer.init();
