import 'reflect-metadata';
import express from 'express';
import './database';
import routes from './routes';

const port = process.env.PORT || 3333;
const app = express();

app.use(express.json());
app.use(routes);

app.listen(port, () => console.log(`Server is running on port ${port}`));
