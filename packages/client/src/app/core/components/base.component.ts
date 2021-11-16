import {
  Injector,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import {
  Subject
} from 'rxjs';
import {
  mergeMap,
  takeUntil,
  take
} from 'rxjs/operators';
import { MatSnackBar }
  from '@angular/material/snack-bar';
import {
  AuthService,
  PostService
} from '../services';
import {
  User,
  Post
} from '@ngsocial/graphql/types'
import {
  PostEvent,
  RemovePostEvent
} from 'src/app/shared';

@Component({
  template: ''
})
export abstract class BaseComponent
  implements OnInit, OnDestroy {
  public authService: AuthService;
  public postService: PostService;
  public posts: Post[] = [];
  public authUser: Partial<User> | null = null;
  public loading: boolean = false;
  protected snackBar: MatSnackBar;
  private componentDestroyed = new Subject();

  constructor(public injector: Injector) {
    this.snackBar = injector.get(MatSnackBar);
    this.authService = injector.get(AuthService);
    this.postService = injector.get(PostService);
  }
  ngOnInit(): void {
    this.authService
      .authUser
      .pipe(
        takeUntil(this.componentDestroyed)
      )
      .subscribe({
        next: (authUser) => {
          this.authUser = authUser;
        }
      });
  }
  ngOnDestroy(): void {
    this.componentDestroyed.next();
    this.componentDestroyed.complete();
  }

  protected handleErrors(err: Error) {
    if (this.loading) this.loading = false;
    console.log(err);
    this.snackBar.open(err.message, 'Ok', {
      duration: 5 * 1000
    });
  }
  protected displayMessage(message: string) {
    this.snackBar
      .open(message,
        'Ok', {
        duration: 5 * 1000
      });
  }
  private createPost(text: string | null) {
    if (!text?.length) {
      this.displayMessage('Cannot create an empty post.');
      return;
    }
    if (text) {
      this.createTextPost(text);
    }
  }
  private createTextPost(text: string): void {
    this.loading = true;
    this.postService
      .createPost(text, null)
      .pipe(take(1))
      .subscribe({
        next: (post) => {
          if (post) {
            this.loading = false;
            this.displayMessage('Your post was created.');
            console.log(post);
          }
        },
        error: (err) => this.handleErrors(err)
      });
  }
  private uploadImageAndCreatePost(image: File, text: string | null) {
    this.loading = true;
    this.postService
      .uploadFile(image)
      .pipe(
        mergeMap(uploadFile => this.postService
          .createPost(text, uploadFile?.url || null)
        ),
        take(1)
      ).subscribe({
        next: (post) => {
          this.loading = false;
          if (post) {
            this.displayMessage('Your post was created.');
            console.log(post);
          }
        },
        error: (err) => this.handleErrors(err)
      });
  }
  onPost(e: PostEvent): void {
    if (e.image) {
      this.uploadImageAndCreatePost(e.image, e.text);
    }
    else {
      this.createPost(e.text);
    }
  }
  onRemovePost(e: RemovePostEvent): void {
    this.postService
      .removePost(e.id)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.displayMessage('Post deleted.');
        },
        error: (err) => this.handleErrors(err)
      });
  }
}
