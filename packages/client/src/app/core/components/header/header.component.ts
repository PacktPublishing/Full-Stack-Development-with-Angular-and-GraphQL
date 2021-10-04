import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { User, SearchUsersResponse } from 'src/app/shared';
import { AuthService } from 'src/app/core';
import { SearchDialogComponent } from '../search-dialog/search-dialog.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @ViewChild('searchInput') searchInput: ElementRef | null = null;
  fetchMore: (users: User[]) => void = (users: User[]) => { };
  constructor(
    public authService: AuthService,
    public matDialog: MatDialog,
    private router: Router) { }

  ngOnInit(): void {
  }
  logOut(): void {
    this.authService.logOut();
    this.router.navigateByUrl('/users/login');
  }
  searchUsers(): void {
    const searchText = this.searchInput?.nativeElement.value;
    const result: SearchUsersResponse = this.authService.searchUsers(searchText, 0, 10);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = result;
    this.matDialog.open(SearchDialogComponent, dialogConfig);
  }

}

