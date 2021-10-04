import { gql } from 'apollo-angular';
import {
  USER_FIELDS_FRAGMENT,
  BASIC_USER_FIELDS_FRAGMENT
} from './user.fragments';

export const USER_QUERY = gql`
 ${USER_FIELDS_FRAGMENT}
 query getUser($userId: ID!){  
  getUser(userId:$userId){ ...UserFields }
 } 
`;
export const SEARCH_USERS_QUERY = gql` 
 ${BASIC_USER_FIELDS_FRAGMENT}
 query searchUsers($searchQuery: String!){  
  searchUsers(searchQuery:$searchQuery){ ...BasicUserFields }  
 }  
`;