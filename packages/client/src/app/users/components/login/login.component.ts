import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/core';
import { LoginResponse } from 'src/app/shared';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: FormGroup = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6)
    ]),
  });

  errorMessage: string = '';
  private loginSubscription: Subscription | null = null;

  constructor(private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router) { }

  ngOnInit(): void {}
  ngOnDestroy() {
    if (this.loginSubscription) {
      this.loginSubscription.unsubscribe();
    }
  }  
  submit() {
    const { email, password } = this.form.value;
    if (!this.form.valid) {
      this.errorMessage = 'Please enter valid email and password';
      return;
    }
    this.loginSubscription = this.authService.login(email, password).subscribe({
      next: (result: LoginResponse | null | undefined) => {
        if (result) {
          const savedUserId = result.signIn.user?.id;
          this.snackBar.open('Login Success!', 'Ok', {
            duration: 5 * 1000
          });
          this.router.navigateByUrl(`/users/profile/${savedUserId}`);
        }
      },
      error: (err) => {
        console.error(err.message);
        this.snackBar.open(err.message, 'Ok', {
          duration: 5 * 1000
        });
      }
    });
  }
}
