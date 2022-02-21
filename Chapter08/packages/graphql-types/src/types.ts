export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Upload: any;
};

export type AuthPayload = {
  __typename?: 'AuthPayload';
  token: Scalars['String'];
  user: User;
};

export type Comment = {
  __typename?: 'Comment';
  author: User;
  comment: Scalars['String'];
  createdAt: Scalars['String'];
  id: Scalars['ID'];
  post: Post;
};

export type File = {
  __typename?: 'File';
  encoding?: Maybe<Scalars['String']>;
  filename?: Maybe<Scalars['String']>;
  mimetype?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
};

export type Like = {
  __typename?: 'Like';
  createdAt: Scalars['String'];
  id: Scalars['ID'];
  post: Post;
  user: User;
};

export type Mutation = {
  __typename?: 'Mutation';
  comment?: Maybe<Comment>;
  like?: Maybe<Like>;
  post?: Maybe<Post>;
  register: AuthPayload;
  removeComment?: Maybe<Comment>;
  removeLike?: Maybe<Like>;
  removeNotification?: Maybe<Scalars['ID']>;
  removePost?: Maybe<Scalars['ID']>;
  setUserBio?: Maybe<User>;
  setUserCover?: Maybe<User>;
  setUserPhoto?: Maybe<User>;
  signIn: AuthPayload;
  uploadFile?: Maybe<File>;
};


export type MutationCommentArgs = {
  comment: Scalars['String'];
  postId: Scalars['ID'];
};


export type MutationLikeArgs = {
  postId: Scalars['ID'];
};


export type MutationPostArgs = {
  image?: Maybe<Scalars['String']>;
  text?: Maybe<Scalars['String']>;
};


export type MutationRegisterArgs = {
  email: Scalars['String'];
  fullName: Scalars['String'];
  password: Scalars['String'];
  username: Scalars['String'];
};


export type MutationRemoveCommentArgs = {
  id: Scalars['ID'];
};


export type MutationRemoveLikeArgs = {
  postId: Scalars['ID'];
};


export type MutationRemoveNotificationArgs = {
  id: Scalars['ID'];
};


export type MutationRemovePostArgs = {
  id: Scalars['ID'];
};


export type MutationSetUserBioArgs = {
  bio: Scalars['String'];
};


export type MutationSetUserCoverArgs = {
  file: Scalars['Upload'];
};


export type MutationSetUserPhotoArgs = {
  file: Scalars['Upload'];
};


export type MutationSignInArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationUploadFileArgs = {
  file: Scalars['Upload'];
};

export type Notification = {
  __typename?: 'Notification';
  createdAt: Scalars['String'];
  id: Scalars['ID'];
  postId: Scalars['ID'];
  text: Scalars['String'];
};

export type Post = {
  __typename?: 'Post';
  author: User;
  commentsCount: Scalars['Int'];
  createdAt: Scalars['String'];
  id: Scalars['ID'];
  image?: Maybe<Scalars['String']>;
  latestComment?: Maybe<Comment>;
  latestLike?: Maybe<Scalars['String']>;
  likedByAuthUser?: Maybe<Scalars['Boolean']>;
  likesCount: Scalars['Int'];
  text?: Maybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  getCommentsByPostId?: Maybe<Array<Maybe<Comment>>>;
  getFeed?: Maybe<Array<Maybe<Post>>>;
  getLikesByPostId?: Maybe<Array<Maybe<Like>>>;
  getNotificationsByUserId?: Maybe<Array<Maybe<Notification>>>;
  getPostsByUserId?: Maybe<Array<Maybe<Post>>>;
  getUser?: Maybe<User>;
  message: Scalars['String'];
  searchUsers?: Maybe<Array<Maybe<User>>>;
};


export type QueryGetCommentsByPostIdArgs = {
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  postId: Scalars['ID'];
};


export type QueryGetFeedArgs = {
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
};


export type QueryGetLikesByPostIdArgs = {
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  postId: Scalars['ID'];
};


export type QueryGetNotificationsByUserIdArgs = {
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  userId: Scalars['ID'];
};


export type QueryGetPostsByUserIdArgs = {
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  userId: Scalars['ID'];
};


export type QueryGetUserArgs = {
  userId: Scalars['ID'];
};


export type QuerySearchUsersArgs = {
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  searchQuery?: Maybe<Scalars['String']>;
};

export type Subscription = {
  __typename?: 'Subscription';
  onPostCommented?: Maybe<Comment>;
  onPostLiked?: Maybe<Like>;
};

export type User = {
  __typename?: 'User';
  bio?: Maybe<Scalars['String']>;
  coverImage?: Maybe<Scalars['String']>;
  createdAt: Scalars['String'];
  email: Scalars['String'];
  fullName: Scalars['String'];
  id: Scalars['ID'];
  image?: Maybe<Scalars['String']>;
  password: Scalars['String'];
  postsCount: Scalars['Int'];
  username: Scalars['String'];
};
