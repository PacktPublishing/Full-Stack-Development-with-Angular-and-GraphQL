import express, { Application } from 'express';
import { ApolloServer } from 'apollo-server-express';
import schema from './graphql/schema';
import cors from 'cors';
import 'reflect-metadata';
import { createConnection, Connection, Repository, getRepository } from 'typeorm';
import { User, Post, Comment, Like, Notification } from './entity';

export type Context = {
  orm: {
    userRepository: Repository<User>;
    postRepository: Repository<Post>;
    commentRepository: Repository<Comment>;
    likeRepository: Repository<Like>;
    notificationRepository: Repository<Notification>;
  };
};



const connection: Promise<Connection> = createConnection();

connection.then(() => {

  startApolloServer();
}).catch(error => console.log("Database connection error: ", error));

async function startApolloServer() {
  const PORT = 8080;
  const app: Application = express();
  app.use(cors());
  const userRepository: Repository<User> = getRepository(User);
  const postRepository: Repository<Post> = getRepository(Post);
  const commentRepository: Repository<Comment> = getRepository(Comment);
  const likeRepository: Repository<Like> = getRepository(Like);
  const notificationRepository: Repository<Notification> = getRepository(Notification);

  const context: Context = {
    orm: {
      userRepository: userRepository,
      postRepository: postRepository,
      commentRepository: commentRepository,
      likeRepository: likeRepository,
      notificationRepository: notificationRepository
    }
  };
  const server: ApolloServer = new ApolloServer({ schema, context });

  await server.start();
  server.applyMiddleware({
    app,
    path: '/graphql'
  });
  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}




