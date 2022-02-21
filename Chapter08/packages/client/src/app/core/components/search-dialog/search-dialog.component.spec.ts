import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { defer, Subscription } from 'rxjs';
import { User, UsersResponse } from 'src/app/shared';

import { SearchDialogComponent } from './search-dialog.component';

describe('SearchDialogComponent', () => {
  let component: SearchDialogComponent;
  let fixture: ComponentFixture<SearchDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchDialogComponent],
      providers: [
        {
          provide: MatDialogRef, useValue: {
            close: jasmine.createSpy('close')
          }
        },
        {
          provide: MAT_DIALOG_DATA, useValue: {
            data: defer(() => Promise.resolve({
              searchUsers: [
                {
                  id: 'id#1'
                }
              ]
            } as UsersResponse)),
            fetchMore: jasmine.createSpy('fetchMore')
          }
        },
        { provide: Router, useValue: { navigateByUrl: jasmine.createSpy('navigateByUrl') } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should display title with h2 tag', () => {
    const h2Element: HTMLElement = fixture.nativeElement.querySelector('h2');
    expect(h2Element).toBeDefined();
    expect(h2Element.textContent).toEqual('Users');
  });
  it('should go to user profile when Visit button is clicked', fakeAsync(() => {
    component.users = [{
      id: 'id#1',
      fullName: 'A B'
    } as User];
    fixture.detectChanges();
    spyOn(component, 'goToProfile');
    const searchBtn = fixture.debugElement.query(By.css('button:nth-of-type(1)'));
    searchBtn.nativeElement.click();
    tick();
    expect(component.goToProfile).toHaveBeenCalledOnceWith('id#1');
  }));
  it('should close dialog when Close button is clicked', fakeAsync(() => {
    spyOn(component, 'close');
    const closeBtn = fixture.debugElement.query(By.css('button:nth-of-type(1)'));
    closeBtn.nativeElement.click();
    tick();
    expect(component.close).toHaveBeenCalledTimes(1);
  }));
  it('should invoke fetchMore when More.. button is clicked', fakeAsync(() => {
    const invokeFetchMoreBtn = fixture.debugElement.query(By.css('button:nth-of-type(2)'));
    invokeFetchMoreBtn.nativeElement.click();
    tick();
    expect(component.fetchMore).toHaveBeenCalledTimes(1);
  }));
  it('should emit found users after subscribing to searchUsers', (done) => {
    component.response.data.subscribe({
      next: (data) => {
        expect(component.users).toEqual(data.searchUsers);
        expect(component.users).toEqual([{
          id: 'id#1'
        } as User]);
        expect(component.users.length).toEqual(1);
        done();
      }
    });
  });
  it('should unsubscribe when component is destroyed', () => {
    const unsubSpy = spyOn(Subscription.prototype, 'unsubscribe');
    component.ngOnDestroy();
    expect(unsubSpy).toHaveBeenCalled();
  });
  it('should call navigateByUrl() when goToProfile() is called', () => {
    const router = fixture.debugElement.injector.get(Router);
    component.goToProfile('id#1');
    expect(router.navigateByUrl).toHaveBeenCalled();
  });
  it('should close dialog on trigger', () => {
    component.close();
    expect(component.dialogRef.close).toHaveBeenCalled();
  });
});