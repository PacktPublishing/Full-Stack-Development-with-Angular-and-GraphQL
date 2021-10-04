import { gql } from 'apollo-angular';
import { USER_FIELDS_FRAGMENT } from './user.fragments';

export const ACCESS_TOKEN: string = 'accessToken';
export const AUTH_USER: string = 'authUser';

export const REGISTER_MUTATION = gql`
 ${USER_FIELDS_FRAGMENT}
 mutation register($fullName: String!, $username: String!, $email: String!, $password: String!){  
  register(fullName:$fullName, username:$username, email:$email, password:$password){  
   token, user { ...UserFields }  
  }  
 }  
`;
export const LOGIN_MUTATION = gql`
 ${USER_FIELDS_FRAGMENT} 
 mutation signIn($email: String!, $password: String!){  
  signIn(email:$email, password:$password){  
   token, user { ...UserFields }  
  }  
 }  
`;