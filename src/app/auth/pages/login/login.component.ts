import { JsonPipe } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertModule } from 'ngx-bootstrap/alert';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [JsonPipe, ReactiveFormsModule, AlertModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
// export class LoginComponent {  //old
export class LoginComponent implements OnInit { //new add key cloak
  @Input()
  code = '';

  // router
  router = inject(Router);
  route = inject(ActivatedRoute) // add

  /// auth.service
  authService = inject(AuthService);

  // init form
  fb = inject(NonNullableFormBuilder);
  username = this.fb.control('u1002');
  password = this.fb.control('user02');

  fg = this.fb.group({
    username: this.username,
    password: this.password
  });

  // error
  error?: any;

  // add new key cloak
  ngOnInit() {
    if (this.code) {
      this.authService
        .loginOauth2(this.code)
        .subscribe(() => this.router.navigate(['/']));
    }
  }

  onLogin() {
    this.authService.login(this.fg.getRawValue()).subscribe({
      //old
      // next: () => {
      //   this.router.navigate(['/']);
      // },
      //new
      next: () => {
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/'; // add
        this.router.navigate([returnUrl]); // add
      },
      error: (error) => (this.error = error)
    });
  }
}

