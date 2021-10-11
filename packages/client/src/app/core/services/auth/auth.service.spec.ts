import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import {
  ApolloTestingController,
  ApolloTestingModule
} from 'apollo-angular/testing';
import {
  AuthResponse,
  RegisterResponse,
  REGISTER_MUTATION,
  User
} from 'src/app/shared';
import { authState } from 'src/app/reactive';

describe('AuthService', () => {
  let service: AuthService;
  let controller: ApolloTestingController;
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

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ApolloTestingModule]
    });
    service = TestBed.inject(AuthService);
    controller = TestBed.inject(ApolloTestingController);
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
  it('should reset auth state when registration fails on server', (done) => {
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
});

