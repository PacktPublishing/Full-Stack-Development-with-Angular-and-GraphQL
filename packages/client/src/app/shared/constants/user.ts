import { gql } from 'apollo-angular';

export const USER_QUERY = gql`
 query getUser($userId: ID!){  
  getUser(userId:$userId){
   id fullName bio email username image coverImage postsCount createdAt }
 } 
`; 
export const SEARCH_USERS_QUERY = gql` 
 query searchUsers($searchQuery: String!){  
  searchUsers(searchQuery:$searchQuery){         
   id fullName bio username image  
  }  
 }  
`; 
