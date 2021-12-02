import {
  Component,
  ElementRef,
  Injector,
  ViewChild
} from '@angular/core';
import {
  ActivatedRoute,
  ParamMap
} from '@angular/router';
import { Post, User }
  from '@ngsocial/graphql/types';
import {
  User
    as UserModel
} from 'src/app/shared';
import { Maybe } from 'graphql/jsutils/Maybe';
import { Subject } from 'rxjs';
import {
  take,
  takeUntil,
  switchMap
} from 'rxjs/operators';
import {
  BaseComponent
} from 'src/app/core/components/base.component';
import { authState }
  from 'src/app/reactive';
import { ProfileService }
  from 'src/app/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent
  extends BaseComponent {
  private destroyNotifier: Subject<boolean> = new Subject();
  @ViewChild('bioInput') bioInput: ElementRef | null = null;
  profileUser: Partial<User> | null = null;
  showEditSection: boolean = false;
  isAuthUserProfile: boolean = false;
  fetchMore!: () => void;
  constructor(
    private route: ActivatedRoute,
    private profileService: ProfileService,
    public injector: Injector
  ) {
    super(injector);
  }

  set bioInputValue(value: string) {
    this
      .bioInput!
      .nativeElement
      .value = value;
  }
  get bioInputValue() {
    return this
      .bioInput!
      .nativeElement
      .value;
  }
  get userFirstName() {
    return this.profileUser
      ?.fullName
      ?.split(' ')
      ?.shift();
  }
  ngOnInit(): void {
    super.ngOnInit();
    const userObs = this.route.paramMap
      .pipe(
        switchMap((params: ParamMap) => {
          const userId = params.get('userId')!;
          return this.authService.getUser(userId);
        }),
        switchMap((userResponse) => {
          this.setProfileUser(userResponse.getUser);
          this.setIsAuthUserProfile();
          const qRef =  this.postService
            .getPostsByUserId(userResponse.getUser.id);
          this.fetchMore = () => {
            qRef.fetchMore({
              variables: {
                offset: this.posts.length
              }
            });
          }
          return qRef.valueChanges;
        }),
        takeUntil(this.destroyNotifier)
      );
    userObs
      .pipe(getPostsObs => {
        this.loading = true;
        return getPostsObs;
      })
      .subscribe({
        next: (result) => {
          this.loading = result.loading;
          this.posts = result
            .data
            .getPostsByUserId as Post[];
          console.log(this.posts);
        },
        error: (err) => super.handleErrors(err)
      });
  }
  private setProfileUser(user: Partial<User>) {
    this.profileUser = user;
  }
  private setIsAuthUserProfile() {
    this.isAuthUserProfile =
      !!(
        this.authUser &&
        this.authUser.id == this.profileUser?.id
      );
  }
  setBio(): void {
    const bio = this.bioInputValue;
    this.profileService
      .setUserBio(bio)
      .pipe(take(1))
      .subscribe(
        {
          next: (userResult) => {
            if (userResult) {
              this.handleSuccess(
                userResult,
                'Your bio is updated.'
              );
              this.bioInputValue = '';
            }
          },
          error: (err) => this.handleErrors(err)
        }
      );
  }
  setUserCover(file: File): void {
    this.profileService
      .setUserCover(file)
      .pipe(take(1))
      .subscribe({
        next: (userResult) => {
          if (userResult)
            this.handleSuccess(
              userResult,
              'Your profile cover is successfully updated.'
            )
        },
        error: (err) => this.handleErrors(err)
      });
  }
  setUserPhoto(file: File): void {
    this.profileService
      .setUserPhoto(file)
      .pipe(take(1))
      .subscribe({
        next: (userResult) => {
          this.handleSuccess(
            userResult,
            'Your profile photo is successfully updated.'
          )
        },
        error: (err) => this.handleErrors(err)
      });
  }
  private handleSuccess(
    userResult: Partial<Maybe<User>>,
    message: string) {
    if (userResult) {
      this.displayMessage(message);
      const prevAuthState = authState();
      authState({
        ...prevAuthState,
        currentUser: userResult as UserModel
      });
      if (this.authUser) {
        this.authUser = userResult as User;
        this.authService
          .storeUser(this.authUser as any);
      }
    }
  }
  enableDisableEditing(): void {
    this.showEditSection = !this.showEditSection;
  }
  onPhotoSelected(event: Event): void {
    const files: FileList =
      (event.target as HTMLInputElement)
        .files!;
    if (files.length > 0) {
      const photoFile = files[0];
      this.setUserPhoto(photoFile);
    }
  }
  onCoverSelected(event: Event) {
    const files: FileList =
      (event.target as HTMLInputElement)
        .files!;
    if (files.length > 0) {
      const coverFile = files[0];
      this.setUserCover(coverFile);
    }
  }
}
