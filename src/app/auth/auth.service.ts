import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Observable, tap } from 'rxjs';
import { LoggedInUser, Tokens, UserProfile } from './models/logged-in-user';
import { ENV_CONFIG } from '../env.config';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // readonly URL = 'http://localhost:3000/auth/login'; //old

  private envConfig = inject(ENV_CONFIG);
  readonly URL = `${this.envConfig.apiUrl}/auth/login`;
  readonly TOKENS = 'TOKENS'; // add

  httpClient = inject(HttpClient);

  router = inject(Router); // add

  loggedInUser: LoggedInUser | null = null;

  // add
  constructor() {
    const tokensInStorage = sessionStorage.getItem(this.TOKENS);
    if (tokensInStorage) {
      this.setTokens(JSON.parse(tokensInStorage) as Tokens);
    }
  }

  login(credential: { username: string; password: string }): Observable<Tokens> {
    return this.httpClient
      .post<Tokens>(this.URL, credential)
      .pipe(tap((newToken) => this.setTokens(newToken)));
  }

  setTokens(newToken: Tokens) {
    const userProfile = jwtDecode<UserProfile>(newToken.access_token);
    this.loggedInUser = { tokens: newToken, userProfile };
    sessionStorage.setItem(this.TOKENS, JSON.stringify(newToken)); // add
  }

  // add
  logout(): void {
    this.loggedInUser = null;
    this.router.navigate(['/auth/login']);
    sessionStorage.removeItem(this.TOKENS)
  } 

  // add refresh token
  refreshToken(): Observable<{ access_token: string }> {
    return this.httpClient.post<{ access_token: string }>(
      `${this.envConfig.apiUrl}/auth/refresh`,
      null
    );
  } 

  // add new key cloak
  getLoginOauth2RedirectUrl() {
    return this.httpClient.get<{ redirectUrl: string }>(
      `${this.envConfig.apiUrl}/auth/login-oauth2-redirect-url`
    );
  }

  // add new key cloak
  loginOauth2(code: string) {
    return this.httpClient
      .post<any>(`${this.envConfig.apiUrl}/auth/login-oauth2`, { code })
      .pipe(tap((newToken) => this.setTokens(newToken)));
  }
}
