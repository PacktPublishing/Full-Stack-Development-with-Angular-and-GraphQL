import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import {
  User,
  RegisterResponse,
  LoginResponse,
  AuthState,
  UserResponse,
  UsersResponse,
  SearchUsersResponse,
  SEARCH_USERS_QUERY,
  ACCESS_TOKEN,
  AUTH_USER
} from 'src/app/shared';
import { GetUserGQL } from './graphql/getuser.service';
import { LoginGQL } from './graphql/login.service';
import { RegisterGQL } from './graphql/register.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authState: Observable<AuthState>;
  isLoggedInAsync: Observable<boolean>;
  private readonly authSubject: BehaviorSubject<AuthState>;
  constructor(
    private apollo: Apollo,
    private registerGQL: RegisterGQL,
    private loginGQL: LoginGQL,
    private getUserGQL: GetUserGQL) {

    const localToken = this.getLocalToken();
    let isLoggedIn = false;
    if (localToken) {
      isLoggedIn = this.tokenExists() && !this.tokenExpired(localToken);
    }
    this.authSubject = new BehaviorSubject<AuthState>({
      isLoggedIn: isLoggedIn,
      currentUser: this.getLocalUser(),
      accessToken: localToken
    });
    this.authState = this.authSubject.asObservable();
    this.isLoggedInAsync = this.authState.pipe(map(state => state.isLoggedIn));
  }
  get isLoggedIn(): boolean {
    return this.authSubject.getValue().isLoggedIn;
  }
  get authUser(): User | null {
    return this.authSubject.getValue().currentUser;
  }
  getLocalToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN);
  }
  storeUser(user: User): void {
    localStorage.setItem(AUTH_USER, JSON.stringify(user));
  }
  private getLocalUser(): User | null {
    return JSON.parse(localStorage.getItem(AUTH_USER) as string) ?? null;
  }
  private storeToken(token: string): void {
    localStorage.setItem(ACCESS_TOKEN, token);
  }
  private tokenExists(): boolean {
    return !!localStorage.getItem(ACCESS_TOKEN);
  }
  private tokenExpired(token: string): boolean {
    const tokenObj = JSON.parse(atob(token.split('.')[1]));
    return Date.now() > (tokenObj.exp * 1000);
  }
  private updateAuthState(token: string, user: User) {
    this.storeToken(token);
    this.storeUser(user);
    this.authSubject.next({
      isLoggedIn: true,
      currentUser: user,
      accessToken: token
    });
  }
  private resetAuthState() {
    this.authSubject.next({
      isLoggedIn: false,
      currentUser: null,
      accessToken: null
    });
  }
  register(
    fullName: string,
    username: string,
    email: string,
    password: string): Observable<RegisterResponse | null | undefined> {
    return this.registerGQL
      .mutate({
        fullName: fullName,
        username: username,
        email: email,
        password: password
      })
      .pipe(
        map(result => result.data),
        tap({
          next: (data: RegisterResponse | null | undefined) => {
            if (data?.register.token && data?.register.user) {

              const token: string = data?.register.token, user: User = data?.register.user;
              this.updateAuthState(token, user);
            }

          },
          error: err => {
            console.error(err);
            this.resetAuthState();
          }
        }));
  }
  login(
    email: string,
    password: string): Observable<LoginResponse | null | undefined> {
    return this.loginGQL
      .mutate({
        email: email,
        password: password
      })
      .pipe(
        map(result => result.data),
        tap({
          next: (data: LoginResponse | null | undefined) => {
            if (data?.signIn.token && data?.signIn.user) {
              const token: string = data?.signIn.token, user = data?.signIn.user;
              this.updateAuthState(token, user);
            }
          },
          error: err => {
            console.error(err);
            this.resetAuthState();
          }
        }));
  }
  getUser(userId: string): Observable<UserResponse> {
    return this.getUserGQL.watch({
      userId: userId
    }).valueChanges.pipe(map(result => result.data));
  }
  searchUsers(searchQuery: string, offset: number, limit: number): SearchUsersResponse {
    const feedQuery = this.apollo.watchQuery<UsersResponse>({
      query: SEARCH_USERS_QUERY,
      variables: {
        searchQuery: searchQuery,
        offset: offset,
        limit: limit
      },
      fetchPolicy: 'cache-first',
    });

    const fetchMore: (users: User[]) => void = (users: User[]) => {
      feedQuery.fetchMore({
        variables: {
          offset: users.length,
        }
      });
    }

    return { data: feedQuery.valueChanges.pipe(map(result => result.data)), fetchMore: fetchMore };
  }
  logOut(): void {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(AUTH_USER);
    this.resetAuthState();
  }
}
