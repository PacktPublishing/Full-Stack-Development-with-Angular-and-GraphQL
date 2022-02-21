import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/core';
import { MaybeNullOrUndefined, RegisterResponse } from 'src/app/shared';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {

  form: FormGroup = new FormGroup({
    fullName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    password2: new FormControl('', [Validators.required, Validators.minLength(6)])
  });
  errorMessage: string | null = '';
  private registerSubscription: Subscription | null = null;

  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router) { }

  ngOnInit(): void {
  }
  ngOnDestroy() {
    if (this.registerSubscription) {
      this.registerSubscription.unsubscribe();
    }
  }
  submit() {
    const { fullName, username, email, password, password2 } = this.form.value;
    if (password !== password2) {
      this.errorMessage = 'Passwords mismatch';
      return;
    }
    if (!this.form.valid) {
      this.errorMessage = 'Please enter valid information';
      return;
    }

    this.registerSubscription = this.authService.register(fullName, username, email, password).subscribe({
      next: (result: MaybeNullOrUndefined<RegisterResponse>) => {
        const savedUserId = result?.register.user.id;
        this.snackBar.open('Signup Success!', 'Ok', {
          duration: 5 * 1000
        });
        if (savedUserId) {
          this.router.navigateByUrl(`/users/profile/${savedUserId}`);
        }
      },
      error: (err) => {
        console.error(err.error);
        this.errorMessage = err.message;
        this.snackBar.open(err.message, 'Ok', {
          duration: 5 * 1000
        });
      }
    });
  }
}


