import { gql } from 'apollo-angular';
export const ACCESS_TOKEN: string = 'accessToken';
export const AUTH_USER: string = 'authUser';

export const REGISTER_MUTATION = gql`
 mutation register($fullName: String!, $username: String!, $email: String!, $password: String!){  
  register(fullName:$fullName, username:$username, email:$email, password:$password){  
   token, user { id fullName bio email username image coverImage postsCount createdAt }  
  }  
 }  
`;
export const LOGIN_MUTATION = gql` 
 mutation signIn($email: String!, $password: String!){  
  signIn(email:$email, password:$password){  
   token, user { id fullName bio email username image coverImage postsCount createdAt }  
  }  
 }  
`;