import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { TimerController } from './controllers/TimerController';
import { routes } from './routes/routesList';
import { websocketServer } from './websocket/websocketServer';

dotenv.config();

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

routes.initRoutes(app);

const port = process.env.PORT || 3000;

app.listen(port, () =>
{
    console.log(`Alpha Multi Server is running at https://localhost:${port}`);
});

websocketServer.init();

const timerController = new TimerController(() =>
{
    console.log('Test');
}, 1000);
