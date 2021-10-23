import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AbstractControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { defer, Subscription, throwError } from 'rxjs';
import { AuthService } from 'src/app/core';
import { LoginResponse, MaybeNullOrUndefined } from 'src/app/shared';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let router: Router;
  let matSnackBar: MatSnackBar;
  let authService: AuthService;
  let email: AbstractControl;
  let password: AbstractControl;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [
        {
          provide: Router, useValue: {
            navigateByUrl: jasmine.createSpy('navigateByUrl')
          }
        },
        {
          provide: MatSnackBar, useValue: {
            open: jasmine.createSpy('open')
          }
        },
        {
          provide: AuthService, useValue: {
            login: (email: string, _password: string) => {
              return defer(() => Promise.resolve(
                {
                  signIn: {
                    user: {
                      id: 'id#1',
                      email: email
                    }
                  }
                } as MaybeNullOrUndefined<LoginResponse>
              ))
            }
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
    router = TestBed.inject(Router);
    matSnackBar = TestBed.inject(MatSnackBar);
    authService = TestBed.inject(AuthService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    email = component.form.controls['email'];
    password = component.form.controls['password'];
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should initially have invalid form', () => {
    expect(component.form.valid).toBeFalsy();
  });
  it('should initially have empty error message', () => {
    expect(component.errorMessage).toEqual('');
  });
  it('should set error message when email or password is not valid', () => {
    component.submit(); // submit with no email and password
    expect(email.errors!['required']).toBeTruthy();
    expect(password.errors!['required']).toBeTruthy();
    expect(component.errorMessage).toEqual('Please enter valid email and password');

    component.errorMessage = '';
    email.setValue('email@'); // set invalid email
    password.setValue('12345'); // set invalid password
    expect(email.errors!['email']).toBeTruthy();
    expect(password.errors!['minlength']).toBeTruthy();
    component.submit();
    expect(component.errorMessage).toEqual('Please enter valid email and password');

    component.errorMessage = '';
    email.setValue('test@email.com'); // set valid email
    password.setValue('12345'); // set invalid password
    expect(password.errors!['minlength']).toBeTruthy();
    component.submit();
    expect(component.errorMessage).toEqual('Please enter valid email and password');

    component.errorMessage = '';
    email.setValue('email'); // set invalid email
    password.setValue('123456'); // set valid password
    expect(email.errors!['email']).toBeTruthy();
    component.submit();
    expect(component.errorMessage).toEqual('Please enter valid email and password');

    component.errorMessage = '';
    email.setValue('test@email.com'); // set valid email
    password.setValue('12345677'); // set valid password
    component.submit();
    expect(component.errorMessage).not.toEqual('Please enter valid email and password');
  });
  describe('On form submit', () => {
    beforeEach(() => {
      email.setValue('test@email.com');
      password.setValue('123456789');
    });
    it('should navigate to user profile when login succeeds', fakeAsync(() => {
      component.submit(); // trigger the submit method
      tick(); // advance time
      expect(router.navigateByUrl).toHaveBeenCalledOnceWith('/users/profile/id#1');
    }));
    it('should display success message when login succeeds', fakeAsync(() => {
      component.submit();
      tick();
      expect(matSnackBar.open).toHaveBeenCalledOnceWith('Login Success!', 'Ok', {
        duration: 5 * 1000
      });
    }));
    it('should display error when login fails', () => {
      spyOn(authService, 'login').and.returnValue(throwError(new Error('Test error message')));
      component.submit();
      expect(matSnackBar.open).toHaveBeenCalledOnceWith('Test error message', 'Ok', {
        duration: 5 * 1000
      });
    });
  });
  it('should unsubscribe when destroyed', () => {
    const unsubscribeSpy = spyOn(Subscription.prototype, 'unsubscribe');
    email.setValue('test@email.com');
    password.setValue('123456789');
    component.submit();
    component.ngOnDestroy();
    expect(unsubscribeSpy).toHaveBeenCalled();
  });
});
