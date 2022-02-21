import { gql } from 'apollo-angular';

export const BASIC_USER_FIELDS_FRAGMENT = gql`
fragment BasicUserFields on User {
 id fullName bio username image 
}`;
export const USER_FIELDS_FRAGMENT = gql`
fragment UserFields on User {
 id fullName bio email username image coverImage postsCount createdAt 
}`;
