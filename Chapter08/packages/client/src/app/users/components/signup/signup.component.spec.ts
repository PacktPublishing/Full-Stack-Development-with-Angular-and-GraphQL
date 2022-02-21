import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AbstractControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { defer, Subscription, throwError } from 'rxjs';
import { AuthService } from 'src/app/core';
import { MaybeNullOrUndefined, RegisterResponse } from 'src/app/shared';
import { SignupComponent } from './signup.component';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let router: Router;
  let matSnackBar: MatSnackBar;
  let authService: AuthService;
  let email: AbstractControl;
  let password: AbstractControl;
  let password2: AbstractControl;
  let fullName: AbstractControl;
  let username: AbstractControl;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SignupComponent],
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
            register: (fullName: string, username: string, email: string, _password: string) => {
              return defer(() => Promise.resolve(
                {
                  register: {
                    user: {
                      id: 'id#1',
                      email: email,
                      fullName: fullName,
                      username: username
                    }
                  }
                } as MaybeNullOrUndefined<RegisterResponse>
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
    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    email = component.form.controls['email'];
    password = component.form.controls['password'];
    password2 = component.form.controls['password2'];
    fullName = component.form.controls['fullName'];
    username = component.form.controls['username'];
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
  it(`should set error message to 'Please enter valid information'`, () => {
    component.errorMessage = '';
    email.setValue('email@'); // set invalid email
    password.setValue('12345'); // set invalid password
    password2.setValue('12345'); // set password again

    expect(email.errors!['email']).toBeTruthy();
    expect(password.errors!['minlength']).toBeTruthy();
    expect(password2.errors!['minlength']).toBeTruthy();
    component.submit();
    expect(component.errorMessage).toEqual('Please enter valid information');

    component.errorMessage = '';
    email.setValue('test@email.com'); // set valid email
    password.setValue('12345677'); // set valid password
    password2.setValue('12345677'); // set password again
    fullName.setValue('A B');
    username.setValue('ahm123');
    component.submit();
    expect(component.errorMessage).not.toEqual('Please enter valid information');
  });
  it(`should set error message to 'Passwords mismatch'`, () => {
    component.errorMessage = '';
    password.setValue('1234578'); // set invalid password
    password2.setValue('12345798'); // set a different password
    component.submit();
    expect(component.errorMessage).toEqual('Passwords mismatch');
  });
  describe('On form submit', () => {
    beforeEach(() => {
      fullName.setValue('A B');
      email.setValue('test@email.com');
      username.setValue('ahm123');
      password.setValue('123456789');
      password2.setValue('123456789');
    });
    it('should navigate to user profile when signup succeeds', fakeAsync(() => {
      component.submit(); // trigger the submit method
      tick(); // advance time
      expect(router.navigateByUrl).toHaveBeenCalledOnceWith('/users/profile/id#1');
    }));
    it('should display success message when signup succeeds', fakeAsync(() => {
      component.submit();
      tick();
      expect(matSnackBar.open).toHaveBeenCalledOnceWith('Signup Success!', 'Ok', {
        duration: 5 * 1000
      });
    }));
    it('should display error when signup fails', () => {
      spyOn(authService, 'register').and.returnValue(throwError(new Error('Test error message')));
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
    password2.setValue('123456789');
    fullName.setValue('A B');
    username.setValue('ahm123');
    component.submit();
    component.ngOnDestroy();
    expect(unsubscribeSpy).toHaveBeenCalled();
  });
});
