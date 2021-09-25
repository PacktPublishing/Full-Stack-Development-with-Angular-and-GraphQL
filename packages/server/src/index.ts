import express, { Application } from 'express';
import { ApolloServer } from 'apollo-server-express';
import schema from './graphql/schema';
import cors from 'cors';
import 'reflect-metadata';
import { createConnection, Connection } from 'typeorm';


const connection: Promise<Connection> = createConnection();

connection.then(() => {
  startApolloServer();
}).catch(error => console.log("Database connection error: ", error));

async function startApolloServer() {
  const PORT = 8080;
  const app: Application = express();
  app.use(cors());
  const server: ApolloServer = new ApolloServer({ schema });
  await server.start();
  server.applyMiddleware({
    app,
    path: '/graphql'
  });
  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}




