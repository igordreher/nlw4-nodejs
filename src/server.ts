import 'reflect-metadata';
import express from 'express';
import './database';

const app = express();
const port = process.env.PORT || 3333;

app.listen(port, () => console.log(`Server is running on port ${port}`));
