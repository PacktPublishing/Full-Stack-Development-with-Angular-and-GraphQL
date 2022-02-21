import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatSnackBar, MatSnackBarRef, TextOnlySnackBar } from '@angular/material/snack-bar';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ApolloError } from '@apollo/client/core';
import { defer, Observable, of } from 'rxjs';
import { find } from 'rxjs/operators';
import { AuthService, PostService } from 'src/app/core';
import { PostEvent, User, UserResponse } from 'src/app/shared';
import { ProfileService } from '../../services/profile/profile.service';

import { ProfileComponent } from './profile.component';
const fakeUser: User = {
  id: '#1',
  fullName: 'Ahmed Bouchefra',
  username: 'ahmed.b',
  email: 'ahmed@techiediaries.com',
  coverImage: `url('https://example.com/cover.jpg')`,
  image: 'https://example.com/photo.jpg',
  bio: 'bio of user#1',
  postsCount: 0,
  createdAt: 'Sun, October 3, 2021'
};

const fakeUser2: User = {
  id: '#2'
} as User;

class AuthServiceMock {
  get authUser(): Observable<User> {
    return of(fakeUser);
  }
  getUser() {
    return defer(() => Promise.resolve({
      getUser: fakeUser
    }));
  }
  storeUser() { }
}

class ProfileServiceMock {
  setUserBio(bio: string) {
    return defer(() => Promise.resolve({
      setUserBio: fakeUser
    }));
  }
  setUserCover(coverImage: File) {
    return defer(() => Promise.resolve({
      setUserCover: fakeUser
    }));
  }
  setUserPhoto(photoImage: File) {
    return defer(() => Promise.resolve({
      setUserPhoto: fakeUser
    }));
  }
}
describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let snackBar: MatSnackBar;
  let authService: AuthService;
  let postService: PostService;
  let profileService: ProfileService;
  let postServiceMock = jasmine.createSpyObj([
    'createPost', 'removePost', 'uploadFile'
  ]);
  function findBy(selector: string): HTMLElement {
    const nativeElement = fixture.nativeElement;
    return nativeElement.querySelector(selector);
  }
  function setAuthUserProfile() {
    component.profileUser = fakeUser;
    component.isAuthUserProfile = true;
  }
  function setNonAuthProfileUser() {
    component.profileUser = fakeUser;
    component.isAuthUserProfile = false;
  }
  beforeEach(async () => {

    await TestBed.configureTestingModule({
      declarations: [ProfileComponent],
      providers: [
        {
          provide: ActivatedRoute, useValue: {
            paramMap: of({ get: (_: any) => '#1' })
          }
        },
        { provide: AuthService, useClass: AuthServiceMock },
        {
          provide: PostService, useValue: postServiceMock
        },
        {
          provide: MatSnackBar, useValue: {
            open: jasmine.createSpy('open')
          }
        },
        {
          provide: ProfileService, useClass: ProfileServiceMock
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
    snackBar = TestBed.inject(MatSnackBar);
    authService = TestBed.inject(AuthService);
    postService = TestBed.inject(PostService);
    profileService = TestBed.inject(ProfileService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should invite unauthenticated users', () => {
    component.profileUser = fakeUser;
    component.authUser = null;
    fixture.detectChanges();
    const divElm = findBy('.profile-call-action');
    expect(divElm.textContent)
      .toContain('Do you know Ahmed? If you know Ahmed, join our network to see their posts.');
  });
  it('should display edit button for authenticated users', () => {
    setAuthUserProfile();
    fixture.detectChanges();
    const editBtn = findBy('.profile-bio-btn');
    expect(editBtn.textContent)
      .toContain('Edit..');
  });
  it('should display the profile user information', () => {
    setAuthUserProfile();
    fixture.detectChanges();
    const coverElm = findBy('.profile-cover');
    const imageElm = findBy('.profile-image');
    const fullNameElm = findBy('.profile-grid h1');
    const bioElm = findBy('p:nth-of-type(1)');
    const createdAtElm = findBy('p:nth-of-type(2)');
    const postsCountElm = findBy('p:nth-of-type(3)');

    expect(coverElm.style.backgroundImage)
      .toEqual(`url("https://example.com/cover.jpg")`);

    expect((imageElm as HTMLImageElement).src)
      .toEqual('https://example.com/photo.jpg');

    expect(fullNameElm.textContent)
      .toContain('Ahmed Bouchefra');

    expect(bioElm.textContent)
      .toContain('bio of user#1');

    expect(createdAtElm.textContent)
      .toContain('Member since Sun, October 3, 2021');

    expect(postsCountElm.textContent)
      .toContain('0 posts');
  });
  it('should set the profile user when found', fakeAsync(() => {
    component.ngOnInit();
    tick();
    expect(component.profileUser)
      .toBeTruthy();
    expect(component.profileUser!.id)
      .toEqual('#1');
  }));
  it('should set the auth user', () => {
    component.ngOnInit();
    expect(component.authUser)
      .toBeTruthy();
  });
  it(`should display 'User not found!' if no profile user is found`, fakeAsync(() => {
    const err = new ApolloError({ errorMessage: 'No user found' });
    spyOn(authService, 'getUser').and.returnValue(
      defer(() => Promise.reject(err))
    );
    component.ngOnInit();
    tick();
    const divElement = findBy('.user-not-found');
    expect(divElement.textContent).toContain('User not found!');
  }));
  it('should hide edit button for other users profiles', () => {
    setNonAuthProfileUser();
    fixture.detectChanges();
    const editBtn = findBy('.profile-bio-btn');
    expect(editBtn)
      .toBeNull();
  });
  it(`should render 'create post component' for authenticated user profiles`, () => {
    setAuthUserProfile();
    fixture.detectChanges();
    const createPostElm = findBy('app-create-post');
    expect(createPostElm)
      .toBeTruthy();
  });
  it(`should hide 'create post component' for other users profiles`, () => {
    setNonAuthProfileUser();
    fixture.detectChanges();
    const createPostElm = findBy('app-create-post');
    expect(createPostElm)
      .toBeNull();
  });
  it(`should pass the props to 'create post component'`, () => {
    setAuthUserProfile();
    fixture.detectChanges();
    const createPostElm = fixture.debugElement.query(By.css('app-create-post'));
    expect(createPostElm.properties.authUser).toBe(fakeUser);
    expect(createPostElm.properties.loading).toBe(false);
  });
  it(`should handle the the post event of 'create post component'`, () => {
    const fakeImage = {
      name: "FA4d9zHWUAQNxHu.jpeg",
      type: "image/jpeg"
    } as unknown as File;
    setAuthUserProfile();
    const uploadFileSpy = postServiceMock.uploadFile.and
      .returnValue(of({ url: 'fake-image-url' }));
    fixture.detectChanges();
    const createPostElm = fixture.debugElement.query(By.css('app-create-post'));
    createPostElm.triggerEventHandler('post', {
      text: 'A new post',
      image: fakeImage
    } as PostEvent);
    expect(postService.createPost).toHaveBeenCalledOnceWith('A new post', 'fake-image-url');
    expect(uploadFileSpy).toHaveBeenCalledOnceWith(fakeImage);
  });
  it('should display edit section on button click', () => {
    setAuthUserProfile();
    fixture.detectChanges();
    const editBtn = findBy('button.profile-bio-btn');
    expect(component.showEditSection).toBeFalse();
    editBtn.click();
    fixture.detectChanges();
    const editDiv = findBy('.profile-settings');
    expect(component.showEditSection).toBeTrue();
    expect(editDiv).toBeTruthy();
  });
  it('should set bio on button trigger', fakeAsync(() => {
    setAuthUserProfile();
    component.showEditSection = true;
    fixture.detectChanges();
    component.bioInputValue = 'My bio';
    const setBioBtn = findBy('button:nth-of-type(3)');
    spyOn(component, 'setBio').and.callThrough();
    setBioBtn.click();
    tick();
    expect(component.setBio).toHaveBeenCalled();
    expect(component.bioInputValue).toEqual('');
  }));
  it('should set cover on input change', () => {
    setAuthUserProfile();
    component.showEditSection = true;
    fixture.detectChanges();
    const uploadCoverInput = findBy('input:nth-of-type(1)');
    spyOn(component, 'onCoverSelected');
    uploadCoverInput.dispatchEvent(new Event('change'));
    expect(component.onCoverSelected).toHaveBeenCalled();
  });
  it('should set photo on input change', () => {
    setAuthUserProfile();
    component.showEditSection = true;
    fixture.detectChanges();
    const uploadPhotoInput: HTMLElement = findBy('input:nth-of-type(2)');
    spyOn(component, 'onPhotoSelected');
    uploadPhotoInput.dispatchEvent(new Event('change'));
    expect(component.onPhotoSelected).toHaveBeenCalled();
  });
});
