import {
  ChangeDetectionStrategy,
  NO_ERRORS_SCHEMA
} from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { defer, of, Subject } from 'rxjs';
import {
  AuthState,
  SearchUsersResponse,
  UsersResponse
} from 'src/app/shared';
import { AuthService } from 'src/app/core';

import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let authService: AuthService;
  let authServiceStub: Partial<AuthService>;
  let router: Router;
  let routerStub: Partial<Router>;
  let matSnackBar: MatSnackBar;
  let matDialog: MatDialog;

  beforeEach(async () => {
    authServiceStub = {
      authState: of({
        isLoggedIn: false,
        currentUser: null
      } as AuthState),
      logOut: jasmine.createSpy('logOut'),
      searchUsers: (): SearchUsersResponse => {
        return {
          data: defer(() => Promise.resolve({
            searchUsers: []
          } as UsersResponse)),
          fetchMore: jasmine.createSpy('fetchMore')
        };
      }
    };
    routerStub = {
      navigateByUrl: jasmine.createSpy('navigateByUrl')
    };

    await TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      providers: [
        { provide: MatDialog, useValue: {} },
        {
          provide: Router, useValue: routerStub
        },
        {
          provide: MatSnackBar, useValue: {
            open: jasmine.createSpy('open')
          }
        },
        {
          provide: AuthService, useValue: authServiceStub
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(HeaderComponent, {
      set: {
        changeDetection: ChangeDetectionStrategy.Default
      }
    })
      .compileComponents();
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    matSnackBar = TestBed.inject(MatSnackBar);
    matDialog = TestBed.inject(MatDialog);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should display the app title', () => {
    const h1Element: HTMLElement = fixture.nativeElement.querySelector('h1');
    expect(h1Element).toBeDefined();
    expect(h1Element.textContent).toContain('ngSocial');
  });
  it('should have #isLoggedIn set to false after construction', () => {
    expect(component.isLoggedIn).toEqual(false);
  });
  it('should have #authUser set to null after construction', () => {
    expect(component.authUser).toEqual(null);
  });
  it('should display the search bar if user is logged in', () => {
    component.isLoggedIn = true;
    fixture.detectChanges();
    const searchbar = fixture.debugElement.query(By.css('.searchbar'));
    expect(searchbar).toBeTruthy();
  });
  it('should logout by delegation to AuthService', () => {
    component.logOut();
    expect(authService.logOut)
      .toHaveBeenCalledTimes(1);
  });
  it('should navigate to /users/login after logout', () => {
    component.logOut();
    expect(router.navigateByUrl)
      .toHaveBeenCalledOnceWith('/users/login');
  });
  it('should unsubscribe when destroyed', () => {
    const nextSpy = spyOn(Subject.prototype, 'next');
    const completeSpy = spyOn(Subject.prototype, 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalledOnceWith(true);
    expect(completeSpy).toHaveBeenCalledTimes(1);
  });
  it('should open SnackBar if searchInput is empty string', () => {
    component.isLoggedIn = true;
    fixture.detectChanges();
    component.searchInput!.nativeElement.value = '';
    component.searchUsers();
    expect(matSnackBar.open)
      .toHaveBeenCalledOnceWith(
        'Please enter a search term',
        'Ok',
        {
          duration: 5 * 1000
        });
  });
  it('should delegate to AuthService if searchInput is not empty string', fakeAsync(() => {
    component.isLoggedIn = true;
    fixture.detectChanges();
    component.searchInput!.nativeElement.value = 'A B';
    spyOn(authService, 'searchUsers')
      .and.callThrough();
    component.searchUsers();
    tick()
    expect(authService.searchUsers)
      .toHaveBeenCalledOnceWith(
        'A B', 0, 10
      );
  }));
  it('should call searchUsers() when the search button is clicked', fakeAsync(() => {
    component.isLoggedIn = true;
    fixture.detectChanges();
    spyOn(component, 'searchUsers');
    const searchBtn = fixture.debugElement
      .query(By.css('button:nth-of-type(1)'));
    searchBtn.nativeElement.click();
    tick();
    expect(component.searchUsers)
      .toHaveBeenCalled();
  }));
  it('should call logOut() when the logout button is clicked', fakeAsync(() => {
    component.isLoggedIn = true;
    fixture.detectChanges();
    spyOn(component, 'logOut');
    const logoutBtn = fixture.debugElement.query(By.css('button:nth-of-type(4)'));
    logoutBtn.nativeElement.click();
    tick();
    expect(component.logOut).toHaveBeenCalled();
  }));
  it('should detect changes after ngOnInit call', () => {
    const spy = spyOn((component as any).changeDetectorRef, 'markForCheck');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });
  it('should emit auth state after subscribe', () => {
    const observer: jasmine.Spy = jasmine.createSpy('auth state observer');
    authService.authState.subscribe(observer);
    expect(observer).toHaveBeenCalledWith(
      {
        isLoggedIn: false,
        currentUser: null
      } as AuthState
    );
  });
  it('should display the search button if user is logged in', () => {
    component.isLoggedIn = true;
    fixture.detectChanges();
    const searchBtn = fixture.debugElement.query(By.css('button:nth-of-type(1)'));
    expect(searchBtn).toBeTruthy();
  });
  it('should display the notifications button if user is logged in', () => {
    component.isLoggedIn = true;
    fixture.detectChanges();
    const notificationsBtn = fixture.debugElement.query(By.css('button:nth-of-type(2)'));
    expect(notificationsBtn).toBeTruthy();
  });
  it('should display the profile button if user is logged in', () => {
    component.isLoggedIn = true;
    fixture.detectChanges();
    const profileBtn = fixture.debugElement.query(By.css('button:nth-of-type(3)'));
    expect(profileBtn).toBeTruthy();
  });
  it('should display the home button if user is logged in', () => {
    component.isLoggedIn = true;
    fixture.detectChanges();
    const homeBtn = fixture.debugElement.query(By.css('button:nth-of-type(4)'));
    expect(homeBtn).toBeTruthy();
  });
  it('should display the login button if user is not logged in', () => {
    component.isLoggedIn = false;
    fixture.detectChanges();
    const loginBtn = fixture.debugElement.query(By.css('button:nth-of-type(1)'));
    expect(loginBtn).toBeTruthy();
  });
  it('should display the logout button if user is logged in', () => {
    component.isLoggedIn = true;
    fixture.detectChanges();
    const logoutBtn = fixture.debugElement.query(By.css('button:nth-of-type(4)'));
    expect(logoutBtn).toBeTruthy();
  });
});
