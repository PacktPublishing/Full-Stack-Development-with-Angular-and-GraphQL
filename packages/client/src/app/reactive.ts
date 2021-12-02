import { makeVar } from '@apollo/client/cache';
import { gql } from '@apollo/client/core';
import { AuthState } from './shared';

export const authState = makeVar<AuthState>(
  {
    accessToken: '',
    currentUser: null,
    isLoggedIn: false
  } as AuthState
);

export const GET_AUTH_STATE = gql`
  query getAuthState {
    authState @client
  }
`;

export const commentsShownState = makeVar<boolean>(false);