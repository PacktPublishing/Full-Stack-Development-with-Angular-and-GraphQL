import { Context } from '..';
import { Resolvers, User, Post, Comment, Like, Notification } from '@ngsocial/graphql';
import { ApolloError } from 'apollo-server-errors';
import { 
  Post as PostEntity, 
  Comment as CommentEntity,
  Like as LikeEntity } from '../entity'; 
import { DeleteResult, QueryFailedError, UpdateResult } from 'typeorm';
import jsonwebtoken from 'jsonwebtoken';
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();
import { GraphQLUpload } from 'graphql-upload'; 
import AWS from 'aws-sdk';
const spacesEndpoint = new AWS.Endpoint(process.env.S3_ENDPOINT as string);
const s3 = new AWS.S3({
  endpoint: spacesEndpoint,
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
});

const hashPassword = async (plainPassword: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString("hex");
    crypto.scrypt(plainPassword, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      resolve(`${salt}:${derivedKey.toString('hex')}`);
    });
  })
};
const compareToHash = async (plainPassword: string, hash: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const [salt, key] = hash.split(":");
    crypto.scrypt(plainPassword, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      resolve(key == derivedKey.toString('hex'));
    });
  })
};


const resolvers: Resolvers = {
  Upload: GraphQLUpload,
  Query: {
    message: () => 'It works!',
    getUser: async (_, args, ctx: Context) => {
      const orm = ctx.orm;
      const user = await orm.userRepository.findOne({ where: { id: args.userId } });
      if (!user) {
        throw new ApolloError("No user found", "USER_NOT_FOUND");
      }
      return user as unknown as User;
    },
    getPostsByUserId: async (_, args, ctx: Context) => {
      const posts = await ctx.orm.postRepository
        .createQueryBuilder("post")
        .where({ author: { id: args.userId } })
        .leftJoinAndSelect("post.author", "post_author")
        .leftJoinAndSelect("post.latestComment", "latestComment")
        .leftJoinAndSelect("latestComment.author", "latestComment_author")
        .leftJoinAndSelect("post.likes", "likes")
        .leftJoinAndSelect("likes.user", "likes_user")
        .orderBy("post.createdAt", "DESC").skip(args.offset as number).take(args.limit as number)
        .getMany();
      posts.forEach((post: PostEntity) => {
        if (post.likes?.find((like: LikeEntity) => { return like.user.id == ctx.authUser?.id })) {
          post.likedByAuthUser = true;
        }
      });
      return posts as unknown as Post[];
    },
    getFeed: async (_, args, ctx: Context) => {
      const feed = await ctx.orm.postRepository
        .createQueryBuilder("post")
        .leftJoinAndSelect("post.author", "post_author")
        .leftJoinAndSelect("post.latestComment", "latestComment")
        .leftJoinAndSelect("latestComment.author", "latestComment_author")
        .leftJoinAndSelect("post.likes", "likes")
        .leftJoinAndSelect("likes.user", "likes_user")
        .orderBy("post.createdAt", "DESC").skip(args.offset as number).take(args.limit as number)
        .getMany();
      feed.forEach((post: PostEntity) => {
        if (post.likes?.find((like: LikeEntity) => { return like.user.id == ctx.authUser?.id })) {
          post.likedByAuthUser = true;
        }
      });
      return feed as unknown as Post[];
    },
    getNotificationsByUserId: async (_, args, ctx: Context) => {
      const notifications = await ctx.orm.notificationRepository
        .createQueryBuilder("notification")
        .innerJoinAndSelect("notification.user", "user")
        .where("user.id = :userId", { userId: args.userId })
        .orderBy("notification.createdAt", "DESC").skip(args.offset as number).take(args.limit as number)
        .getMany();
      return notifications as unknown as Notification[];
    },
    getCommentsByPostId: async (_, args, ctx: Context) => {
      return await ctx.orm.commentRepository
        .createQueryBuilder("comment")
        .innerJoinAndSelect("comment.author", "author")
        .innerJoinAndSelect("comment.post", "post")
        .where("post.id = :id", { id: args.postId as string })
        .orderBy("comment.createdAt", "DESC").skip(args.offset as number).take(args.limit as number)
        .getMany() as unknown as Comment[];
    },
    getLikesByPostId: async (_, args, ctx: Context) => {
      return await ctx.orm.likeRepository
        .createQueryBuilder("like")
        .innerJoinAndSelect("like.user", "user")
        .innerJoinAndSelect("like.post", "post")
        .where("post.id = :id", { id: args.postId })
        .orderBy("like.createdAt", "DESC").skip(args.offset as number).take(args.limit as number)
        .getMany() as unknown as Like[];
    },
    searchUsers: async (_, args, ctx: Context) => {
      const users = await ctx.orm.userRepository.createQueryBuilder("user")
        .where(`user.fullName Like '%${args.searchQuery}%'`)
        .orWhere(`user.username Like '%${args.searchQuery}%'`)
        .getMany();
      return users as unknown as User[];
    }
  },
  Mutation: {
    post: async (_, args, { orm, authUser }: Context) => {
      const post = orm.postRepository.create(
        {
          text: args.text,
          image: args.image,
          author: await orm.userRepository.findOne(authUser?.id)
        } as unknown as PostEntity
      );
      const savedPost = await orm.postRepository.save(post);
      await orm.userRepository.update({ id: authUser?.id }, { postsCount: post.author.postsCount + 1 });
      return savedPost as unknown as Post;
    },
    comment: async (_, args, { orm, authUser }: Context) => {
      const comment = orm.commentRepository.create({
        comment: args.comment,
        post: await orm.postRepository.findOne(args.postId),
        author: await orm.userRepository.findOne(authUser?.id)
      } as CommentEntity);

      const savedComment = await orm.commentRepository.save(comment);
      await orm.postRepository.update(args.postId, {
        commentsCount: savedComment.post.commentsCount + 1,
        latestComment: savedComment
      });
      savedComment.post = await orm.postRepository.findOne(args.postId) as PostEntity;
      return savedComment as unknown as Comment;
    },
    like: async (_, args, { orm, authUser }: Context) => {
      const like = orm.likeRepository.create({
        user: await orm.userRepository.findOne(authUser?.id),
        post: await orm.postRepository.findOne(args.postId)
      } as LikeEntity);
      const savedLike = await orm.likeRepository.save(like);
      await orm.postRepository.update(args.postId, {
        likesCount: savedLike.post.likesCount + 1
      });

      savedLike.post = await orm.postRepository.findOne(args.postId) as PostEntity;
      return savedLike as unknown as Like;
    },
    removeLike: async (_, args, { orm, authUser }: Context) => {
      const like = await orm.likeRepository.createQueryBuilder("like")
        .innerJoinAndSelect("like.user", "user")
        .innerJoinAndSelect("like.post", "post")
        .where("post.id = :postId", { postId: args.postId })
        .andWhere("user.id = :userId", { userId: authUser?.id })
        .getOne();
      if (like && like.id) {
        const result: DeleteResult = await orm.likeRepository.delete(like.id);
        if (result.affected && result.affected <= 0) {
          throw new ApolloError("Like not deleted", "LIKE_NOT_DELETED");
        }
      }
      if (like && like.post && like.post.likesCount >= 1) {
        await orm.postRepository.update(like.post.id, {
          likesCount: like.post.likesCount - 1
        });
      }
      return like as unknown as Like;
    },
    removePost: async (_, args, { orm }: Context) => {
      const post = await orm.postRepository.findOne(args.id, { relations: ['author'] });
      if (!post) {
        throw new ApolloError("Post not found", "POST_NOT_FOUND");
      }
      const result: DeleteResult = await orm.postRepository.createQueryBuilder()
        .delete().from(PostEntity).where("id = :id", { id: args.id }).execute();
      const postsCount = post?.author?.postsCount;
      if (postsCount && postsCount >= 1) {
        await orm.userRepository.update({ id: post?.author.id }, { postsCount: postsCount - 1 });
      }
      if (result.affected && result.affected <= 0) {
        throw new ApolloError("Post not deleted", "POST_NOT_DELETED");
      }
      return args.id;
    },
    removeComment: async (_, args, { orm }: Context) => {
      const comment = await orm.commentRepository.findOne(args.id, { relations: ['author', 'post'] });
      if (!comment) {
        throw new ApolloError("Comment not found", "COMMENT_NOT_FOUND");
      }
      const result: DeleteResult = await orm.commentRepository.delete(args.id);
      if (result.affected && result.affected <= 0) {
        throw new ApolloError("Comment not deleted", "COMMENT_NOT_DELETED");
      }
      const commentsCount = comment?.post?.commentsCount;
      if (commentsCount && commentsCount >= 1) {
        await orm.postRepository.update(comment.post.id, { commentsCount: commentsCount - 1 });
      }
      return comment as unknown as Comment;
    },
    removeNotification: async (_, args, { orm }: Context) => {
      const notificationRepository = orm.notificationRepository;
      const notification = await notificationRepository.findOne(args.id, { relations: ['user'] });
      if (!notification) {
        throw new ApolloError("Notification not found", "NOTIFICATION_NOT_FOUND");
      }
      const result: DeleteResult = await notificationRepository.delete(args.id);
      if (result.affected && result.affected <= 0) {
        throw new ApolloError("Notification not deleted", "NOTIFICATION_NOT_DELETED");
      }
      return args.id;
    },
    register: async (_, args, { orm }) => {
      const { fullName, username, email, password } = args;
      let user = orm.userRepository.create({
        fullName: fullName,
        username: username,
        email: email,
        password: await hashPassword(password),
        postsCount: 0,
        image: 'https://i.imgur.com/nzTFnsM.png'
      });
      const savedUser = await orm.userRepository.save(user)
        .catch((error: unknown) => {
          if (error instanceof QueryFailedError && error.driverError.code == "ER_DUP_ENTRY") {
            throw new ApolloError("A user with this email/username already exists", "USER_ALREADY_EXISTS");
          }
        });
      console.log("saved user", savedUser.id);
      const token = jsonwebtoken.sign(
        { id: savedUser.id, email: user.email },
        process.env.JWT_SECRET as string,
        { expiresIn: '1y' }
      );
      return { token: token, user: savedUser };
    },
    signIn: async (_, args, { orm }) => {
      const { email, password } = args;
      const user = await orm.userRepository.findOne({ where: { email: email } });
      if (!user) {
        throw new ApolloError('No user found with this email!', 'NO_USER_FOUND');
      }
      if (!await compareToHash(password, user.password)) {
        throw new ApolloError('Incorrect password!', 'INCORRECT_PASSWORD');
      }
      const token = jsonwebtoken.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET as string,
        { expiresIn: '1d' }
      );
      return { token, user };
    },
    uploadFile: async (_, { file }) => {
      const { createReadStream, filename, mimetype, encoding } = await file;
      const fileStream = createReadStream();
      const uploadParams = { Bucket: process.env.S3_BUCKET as string, Key: filename, Body: fileStream, ACL: "public-read" };
      const result = await s3.upload(uploadParams).promise();
      console.log(result);
      const url = result.Location;
      return { url, filename, mimetype, encoding };
    },
    setUserPhoto: async (_, args, { orm, authUser }: Context) => {
      const { createReadStream, filename } = await args.file;
      const fileStream = createReadStream();
      const uploadParams = {
        Bucket: process.env.S3_BUCKET as string,
        Key: filename, Body: fileStream,
        ACL: "public-read"
      };
      let fileUrl = '';
      try {
        const uploadResult = await s3.upload(uploadParams).promise();
        fileUrl = uploadResult.Location;
      } catch (err) {
        throw new ApolloError("Setting user photo failed", "SET_USER_PHOTO_FAILED");
      }
      if (fileUrl != '') {
        const updateResult: UpdateResult = await orm.userRepository.update(
          { id: authUser?.id },
          { image: fileUrl });
        if (updateResult.affected && updateResult.affected <= 0) {
          throw new ApolloError("Setting user photo failed", "SET_USER_PHOTO_FAILED");
        }
      }
      return await orm.userRepository.findOne(authUser?.id) as unknown as User;
    },
    setUserCover: async (_, args, { orm, authUser }: Context) => {
      const { createReadStream, filename } = await args.file;
      const fileStream = createReadStream();
      const uploadParams = {
        Bucket: process.env.S3_BUCKET as string,
        Key: filename, Body: fileStream,
        ACL: "public-read"
      };
      let fileUrl = '';
      try {
        const uploadResult = await s3.upload(uploadParams).promise();
        fileUrl = uploadResult.Location;
      } catch (err) {
        throw new ApolloError("Setting user cover failed", "SET_USER_COVER_FAILED");
      }
      if (fileUrl != '') {
        const updateResult: UpdateResult = await orm.userRepository.update(
          { id: authUser?.id },
          { coverImage: fileUrl });
        if (updateResult.affected && updateResult.affected <= 0) {
          throw new ApolloError("Setting user cover failed", "SET_USER_COVER_FAILED");
        }
      }
      return await orm.userRepository.findOne(authUser?.id) as unknown as User;
    },
    setUserBio: async (_, args, { orm, authUser }: Context) => {
      const updateResult: UpdateResult = await orm.userRepository.update(
        { id: authUser?.id }, 
        { bio: args.bio }); 
        if(updateResult.affected && updateResult.affected == 0){
          throw new ApolloError("User bio update failed", "USER_BIO_UPDATE_FAILED");
        }     
      return await orm.userRepository.findOne(authUser?.id) as unknown as User;      
    }
  }
};
export default resolvers;
