import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import swaggerUI from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

import cookieParser from 'cookie-parser';

import { IdeaRouter } from './routes/ideaRouter.js';
import { AuthRouter } from './routes/authRouter.js';
import { enforceAuthentication } from './middleware/auth.js';


dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({origin: "http://localhost:4200",
  credentials: true}));



app.use((err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') {
    res.status(403).json({ error: 'Token CSRF non valido' });
  } else {
    res.status(500).json({ error: 'Something gone wrong '});
    next(err);
  }
});

//genera specifiche da annotazioni con swagger
const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'HiveMind REST API',
      version: '1.0.0',
    },
  },
  apis: ['./routes/*Router.js'], // i file che contengono le annotazioni sono tutti quelli che finiscono per Router nella cartella routes
});

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec)); //servi le specifiche appena generate a swaggerUI

app.use(AuthRouter);
app.use(enforceAuthentication)
app.use(IdeaRouter);




app.listen(process.env.PORT, () => {
  console.log("listen on port " + process.env.PORT);
})