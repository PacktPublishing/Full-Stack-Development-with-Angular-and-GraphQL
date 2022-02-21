import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';
import { AuthGuard } from './auth.guard';

class AuthServiceMock {
  get isLoggedIn(): Observable<boolean> {
    return of(true);
  }
}
describe('AuthGuard', () => {
  let guard: AuthGuard;
  let router: Partial<Router>;
  let authService: Partial<AuthService>;
  let routerStateSnapshot: RouterStateSnapshot;
  let activatedRouteSnapshot: ActivatedRouteSnapshot;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: { parseUrl: jasmine.createSpy('navigate') } },
        { provide: AuthService, useClass: AuthServiceMock },
      ]
    });
    guard = TestBed.inject(AuthGuard);
    router = TestBed.inject(Router);
    authService = TestBed.inject(AuthService);
    routerStateSnapshot = { url: '/feed' } as RouterStateSnapshot;
    activatedRouteSnapshot = {} as ActivatedRouteSnapshot;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
  it('should allow access when user is logged in', () => {
    const canActivateObs: Observable<boolean | UrlTree> = guard.canActivate(
      activatedRouteSnapshot,
      routerStateSnapshot
    ) as Observable<boolean | UrlTree>;

    canActivateObs.subscribe((isLoggedIn) => {
      expect(isLoggedIn).toBe(true);
    });
  });
  it('should redirect to login page when user is logged out', () => {
    spyOnProperty(authService, 'isLoggedIn').and.returnValue(of(false));
    const canActivateObs: Observable<boolean | UrlTree> = guard.canActivate(
      activatedRouteSnapshot,
      routerStateSnapshot
    ) as Observable<boolean | UrlTree>;

    canActivateObs.subscribe(() => {
      expect(router.parseUrl)
      .toHaveBeenCalledOnceWith('/users/login');
    });
  });
});