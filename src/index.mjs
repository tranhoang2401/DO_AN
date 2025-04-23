import express, { json, urlencoded } from 'express';
import connectDB from '../src/config/database/database.mjs';
import cors from 'cors';
import route from './routes/index.mjs';
import setUpSocket from './setUpSocket.mjs';

const app = express();
const port = process.env.PORT || 3000;

await connectDB();

app.use(json({ limit: '100mb' }));
app.use(urlencoded({ limit: '100mb', extended: true }));

const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};
app.use(cors(corsOptions));
app.options('*', cors());

app.get('/', (req, res) => {
  res.send('Hello, this is your server!');
});

route(app);

const server = app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// Thiết lập WebSocket
setUpSocket(server);
