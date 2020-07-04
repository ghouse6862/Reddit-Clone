import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { SignupRequestPayload } from '../signup/signup-request.payload';
import { Observable, throwError } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { LoginRequestPayload } from '../login/login-request.payload';
import { LocalStorageService } from 'ngx-webstorage';
import { LoginResponse } from "../login/login-response.payload";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  refreshTokenPayload = {
    refreshToken: this.getRefreshToken(),
    username: this.getUsername()
  }
  
  @Output() loggedIn: EventEmitter<boolean> = new EventEmitter();
  @Output() username: EventEmitter<string> = new EventEmitter();

  constructor(private http: HttpClient, private localStorage:LocalStorageService) { }

  signup(signupRequestPayload: SignupRequestPayload):Observable<any> {
    return this.http.post('http://localhost:8080/api/auth/signup', signupRequestPayload, { responseType: 'text' });
  }

  login(loginRequestPayload: LoginRequestPayload):Observable<boolean> {
    return this.http.post<LoginResponse>('http://localhost:8080/api/auth/login', loginRequestPayload)
                    .pipe(map(data => {
                                this.localStorage.store('authenticationToken', data.authenticationToken);
                                this.localStorage.store('refreshToken', data.refreshToken);
                                this.localStorage.store('expiresAt', data.expiresAt);
                                this.localStorage.store('username', data.username);

                                this.loggedIn.emit(true);
                                this.username.emit(data.username);
                                return true;
                    }));

  }

  getJwtToken() {
    return this.localStorage.retrieve('authenticationToken');
}

  refreshToken() {
    const refreshTokenPayload = {
      refreshToken: this.getRefreshToken(),
      username: this.getUsername()
    }

    return this.http.post<LoginResponse>('http://localhost:8080/api/auth/refresh/token', refreshTokenPayload)
                    .pipe(tap(response => {
                      this.localStorage.store('authenticationToken', response.authenticationToken);
                      this.localStorage.store('expiresAt', response.expiresAt);
                    }));
  }

  getRefreshToken() {
    return this.localStorage.retrieve('refreshToken');
  }

  getUsername() {
    return this.localStorage.retrieve('username');
  }
  isLoggedIn(): boolean {
    return this.getJwtToken() != null;
  }
  logout() {

    this.http.post('http://localhost:8080/api/auth/logout', this.refreshTokenPayload, {responseType: 'text'})
    .subscribe(data => { console.log(data); }, error => { throwError(error); })

    this.localStorage.clear('authenticationToken');
    this.localStorage.clear('username');
    this.localStorage.clear('refreshToken');
    this.localStorage.clear('expiresAt');

  }

}
