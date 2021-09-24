import express, { Application } from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import { IResolvers } from '@graphql-tools/utils';
import schema from './graphql/schema'; 

const typeDefs = gql` 
    type Query { 
        message: String! 
    } 
`
const resolvers: IResolvers = {
  Query: {
    message: () => 'It works!'
  }
};


async function startApolloServer() {
  const PORT = 8080;
  const app: Application = express();
  const server: ApolloServer = new ApolloServer({schema});
  await server.start();
  server.applyMiddleware({
    app,
    path: '/graphql'
  });
  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}

startApolloServer(config);


