import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import {
  ApolloTestingController,
  ApolloTestingModule
} from 'apollo-angular/testing';
import {
  ACCESS_TOKEN,
  AuthResponse,
  AuthState,
  AUTH_USER,
  LoginResponse,
  LOGIN_MUTATION,
  RegisterResponse,
  REGISTER_MUTATION,
  SEARCH_USERS_QUERY,
  User,
  UserResponse,
  UsersResponse,
  USER_QUERY
} from 'src/app/shared';
import { authState, GET_AUTH_STATE } from 'src/app/reactive';
import { Apollo, QueryRef } from 'apollo-angular';
import { of } from 'rxjs';

describe('AuthService', () => {
  let service: AuthService;
  let controller: ApolloTestingController;
  let apollo: Apollo;
  const fakeUser: User = {
    id: 'id#1',
    fullName: 'A B',
    username: 'a.b',
    email: 'a.b@email.com'
  } as User;
  const fakeToken: string = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTYzMzU3Nzc3NCwiZXhwIjoxNjMzNTgxMzc0fQ.Qk-YrW27tr7teHPFYhxS9PajpBnFufzG1xPs9ub7hF8';
  const authResponse: AuthResponse = {
    token: fakeToken,
    user: fakeUser
  };
  const fakeAuthState: AuthState = {
    isLoggedIn: true,
    currentUser: fakeUser,
    accessToken: fakeToken
  } as AuthState;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ApolloTestingModule]
    });
    service = TestBed.inject(AuthService);
    controller = TestBed.inject(ApolloTestingController);
    apollo = TestBed.inject(Apollo);
  });

  afterEach(() => {
    controller.verify();
  });


  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should register a user', (done) => {
    const fakeRegisterResponse: RegisterResponse = {
      register: authResponse
    };
    spyOn(service, 'updateAuthState' as never);
    service.register('A B', 'a.b', 'a.b@techiediaries.com', '1..9').subscribe({
      next: (result) => {
        expect(result)
          .toEqual(fakeRegisterResponse);
        expect(service['updateAuthState']).toHaveBeenCalledOnceWith(
          fakeRegisterResponse.register.token,
          fakeRegisterResponse.register.user
        );
        done();
      }
    });
    const op = controller.expectOne((operation) => {
      expect(operation.query.definitions).toEqual(REGISTER_MUTATION.definitions);
      return true;
    });
    expect(op.operation.variables.fullName).toEqual('A B');
    expect(op.operation.variables.username).toEqual('a.b');
    expect(op.operation.variables.email).toEqual('a.b@techiediaries.com');
    expect(op.operation.variables.password).toEqual('1..9');
    // Mock the response data
    op.flush({ data: fakeRegisterResponse });
  });
  xit('should reset auth state when registration fails on server', (done) => {
    const initialState = {
      isLoggedIn: false,
      currentUser: null,
      accessToken: null
    };
    const resetAuthStateSpy = spyOn(service, 'resetAuthState' as never);
    service.register('A B', 'a.b', 'a.b@techiediaries.com', '1..9').subscribe({
      error: () => {
        expect(authState()).toEqual(initialState);
        expect(resetAuthStateSpy).toHaveBeenCalled();
        done();
      }
    })
    const op = controller.expectOne((operation) => {
      expect(operation.query.definitions).toEqual(REGISTER_MUTATION.definitions);
      return true;
    });
    op.networkError({} as Error);
  });
  it('should authenticate a user', (done) => {
    const fakeLoginResponse: LoginResponse = {
      signIn: authResponse
    };
    spyOn(service, 'updateAuthState' as never);
    service.login('a.b@techiediaries.com', '1..9').subscribe({
      next: (result) => {
        expect(result)
          .toEqual(fakeLoginResponse);
        expect(service['updateAuthState']).toHaveBeenCalledWith(
          fakeLoginResponse.signIn.token,
          fakeLoginResponse.signIn.user
        );
        done();
      }
    });
    const op = controller.expectOne((operation) => {
      expect(operation.query.definitions).toEqual(LOGIN_MUTATION.definitions);
      return true;
    });
    expect(op.operation.variables.email).toEqual('a.b@techiediaries.com');
    expect(op.operation.variables.password).toEqual('1..9');
    op.flush({ data: fakeLoginResponse });

  });
  it('should reset auth state when login fails on server', (done) => {
    const resetAuthStateSpy = spyOn(service, 'resetAuthState' as never);

    service.login('a.b@techiediaries.com', '1..9').subscribe({
      error: () => {
        expect(authState()).toEqual({
          isLoggedIn: false,
          currentUser: null,
          accessToken: null
        });
        expect(resetAuthStateSpy).toHaveBeenCalled();
        done();
      }
    })
    const op = controller.expectOne((operation) => {
      expect(operation.query.definitions).toEqual(LOGIN_MUTATION.definitions);
      return true;
    });
    op.networkError({} as Error);
  });
  it('should store user and token on updateAuthState call', () => {
    spyOn(service, 'storeUser');
    spyOn(service, 'storeToken' as never);

    spyOn(service, 'resetAuthState' as never);
    (service as any).updateAuthState(fakeToken, fakeUser);
    expect(service.storeUser).toHaveBeenCalledOnceWith(fakeUser);
    expect((service as any).storeToken).toHaveBeenCalledOnceWith(fakeToken);
    expect(authState()).toEqual({
      isLoggedIn: true,
      accessToken: fakeToken,
      currentUser: fakeUser
    });
  });
  it('should call localStorage.setItem on storeUser call', ()=> {
    spyOn(localStorage, 'setItem');
    service.storeUser(fakeUser);
    expect(localStorage.setItem).toHaveBeenCalledWith(AUTH_USER, JSON.stringify(fakeUser));
  });
  it('should call localStorage.setItem on storeToken call', ()=> {
    spyOn(localStorage, 'setItem');
    (service as any).storeToken(fakeToken);
    expect(localStorage.setItem).toHaveBeenCalledWith(ACCESS_TOKEN, fakeToken);
  });
  it('should return the isLoggedIn state', (done) => {
    spyOn(apollo, 'watchQuery').and.returnValue({
      valueChanges: of(
        {
          data:
          {
            authState:
            {
              isLoggedIn: true
            }
          }
        })
    } as QueryRef<any, any>);
    service.isLoggedIn.subscribe((isLoggedIn: boolean) => {
      expect(apollo.watchQuery).toHaveBeenCalledOnceWith({ query: GET_AUTH_STATE });
      expect(isLoggedIn).toEqual(true);
      done();
    });
  });
  it('should return the authenticated user state', (done) => {
    spyOn(apollo, 'watchQuery').and.returnValue(
      {
        valueChanges: of(
          {
            data:
            {
              authState:
                {
                  currentUser: fakeUser
                }
            }
          })
      } as QueryRef<any, any>
    );
    service.authUser.subscribe((authUser) => {
      expect(apollo.watchQuery).toHaveBeenCalledOnceWith({ query: GET_AUTH_STATE });
      expect(authUser).toEqual(fakeUser);
      done();
    })
  });
  it('should return the full auth state', (done) => {
    spyOn(apollo, 'watchQuery').and.returnValue(
      {
        valueChanges: of(
          {
            data:
            {
              authState:
                {
                  ...fakeAuthState
                }
            }
          })
      } as QueryRef<any, any>
    );
    service.authState.subscribe((authState) => {
      expect(apollo.watchQuery).toHaveBeenCalledOnceWith({ query: GET_AUTH_STATE });
      expect(authState).toEqual(fakeAuthState);
      done();
    })
  });
  it('should log out users', () => {
    spyOn(localStorage, 'removeItem');
    const resetAuthStateSpy = spyOn(service, 'resetAuthState' as never);
    service.logOut();
    expect(localStorage.removeItem).toHaveBeenCalledWith(ACCESS_TOKEN);
    expect(localStorage.removeItem).toHaveBeenCalledWith(AUTH_USER);
    expect(resetAuthStateSpy).toHaveBeenCalled();
  });
  it('should search for users', (done) => {
    const fakeSearchResponse = {
      searchUsers: [
        {
          id: 'id#1',
          fullName: 'Ahmed Bouchefra',
          username: "ahmed.bouchefra"
        }
      ]
    } as UsersResponse;
    const searchUsersResponse = service.searchUsers('a b', 0, 2);
    searchUsersResponse.data.subscribe({
      next: (result) => {
        expect(result)
          .toEqual(fakeSearchResponse);
        expect(result.searchUsers.length)
          .toEqual(fakeSearchResponse.searchUsers.length);
        done();
      }
    });
    const op = controller.expectOne(SEARCH_USERS_QUERY);
    expect(op.operation.variables.searchQuery).toEqual('a b');
    expect(op.operation.variables.offset).toEqual(0);
    expect(op.operation.variables.limit).toEqual(2);
    op.flush({ data: fakeSearchResponse });
  });
  it('should get user by ID', (done) => {
    const fakeUserResponse = {
      getUser: {
        id: 'id#0',
        fullName: 'Ahmed Bouchefra'
      }
    } as UserResponse;
    service.getUser('id#0').subscribe({
      next: (result) => {
        expect(result)
          .toEqual(fakeUserResponse);
        done();
      }
    });
    const op = controller.expectOne(USER_QUERY);
    expect(op.operation.variables.userId).toEqual('id#0');
    op.flush({ data: fakeUserResponse });
  });
});

