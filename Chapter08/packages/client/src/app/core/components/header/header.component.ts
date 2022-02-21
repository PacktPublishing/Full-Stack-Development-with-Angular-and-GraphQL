import { Component, OnInit, ElementRef, ViewChild, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { User, SearchUsersResponse, UsersResponse, AuthState } from 'src/app/shared';
import { AuthService } from 'src/app/core';
import { SearchDialogComponent } from '../search-dialog/search-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { first, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import {
  OnPostCommentedGQL,
  OnPostLikedGQL
} from '../../gql.services';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit, OnDestroy {
  @ViewChild('searchInput') searchInput: ElementRef | null = null;
  public isLoggedIn: boolean = false;
  public authUser: User | null = null;
  private destroyNotifier$: Subject<boolean> = new Subject<boolean>();
  public notificationsCount: number = 0; 
  constructor(
    public authService: AuthService,
    public matDialog: MatDialog,
    private router: Router, 
    private snackBar: MatSnackBar, 
    private changeDetectorRef: ChangeDetectorRef, 
    private onPostCommentedGQL: OnPostCommentedGQL, 
    private onPostLiked: OnPostLikedGQL) { }

  ngOnInit(): void {
    this.authService.authState
    .pipe(takeUntil(this.destroyNotifier$))
    .subscribe({
      next: (authState: AuthState) => {
        this.isLoggedIn = authState.isLoggedIn;
        this.authUser = authState.currentUser;
        this.changeDetectorRef.markForCheck();
        this.subscribeToNewComments();
        this.subscribeToNewLikes();
      }
    });
  }
  subscribeToNewComments() {
    const onPostCommentedObs = this.onPostCommentedGQL.subscribe();
    onPostCommentedObs.subscribe({
      next: (result) => {
        const comment = result.data?.onPostCommented;
        if (this.authUser?.id !== comment?.author.id) {
          this.notificationsCount++;
          this.changeDetectorRef.markForCheck();
        }
      }
    });
  }
  subscribeToNewLikes() {
    const onPostLikedObs = this.onPostLiked.subscribe();
    onPostLikedObs.subscribe({
      next: (result) => {
        const like = result.data?.onPostLiked;
        if (this.authUser?.id !== like?.user.id) {
          this.notificationsCount++;
          this.changeDetectorRef.markForCheck();
        }
      }
    });
  }
  ngOnDestroy(): void {
    this.destroyNotifier$.next(true);
    this.destroyNotifier$.complete();
  }
  logOut(): void {
    this.authService.logOut();
    this.router.navigateByUrl('/users/login');
  }
  searchUsers(): void {
    const searchText = this.searchInput?.nativeElement.value;
    if(searchText == ''){
      this.snackBar.open('Please enter a search term', 'Ok', {
        duration: 5 * 1000
      });
      return;
    }
    const result: SearchUsersResponse = this.authService.searchUsers(searchText, 0, 10);
    const dialogConfig = new MatDialogConfig<SearchUsersResponse>();
    dialogConfig.data = result;
    /*
    - We subscribe to the Observable to fetch data and check if any users are found
    before we open the dialog.
    - We unsubscribe using the first() operator.
    - We change the fetch policy to 'cache-first' in the AuthService' searchUsers() method
    to avoid sending multiple requests since we are subscribing to this Observable
    in the dialog component too.
    */
    result.data.pipe(first()).subscribe((data: UsersResponse)=> {

      if(data.searchUsers.length > 0) this.matDialog.open(SearchDialogComponent, dialogConfig);
      else {
        this.snackBar.open('No users found with this search term', 'Ok', {
          duration: 5 * 1000
        });
      }
    });

  }
}
