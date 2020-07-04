import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError, BehaviorSubject } from "rxjs";
import { AuthService } from "./auth/shared/auth.service";
import { catchError, switchMap, filter, take } from "rxjs/operators";
import { LoginResponse } from "./auth/login/login-response.payload";

@Injectable({
    providedIn: "root"
})

export class TokenInterceptor implements HttpInterceptor {

    isTokenRefreshing: boolean;
    refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject(null);

    constructor(private authService: AuthService) {

    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        if(req.url.indexOf('refresh') !== -1 || req.url.indexOf('login') !== -1) {
            return next.handle(req);
        }

        const token = this.authService.getJwtToken();
        if(token) {
            return next.handle(this.addToken(req, token)).pipe(catchError(error => {
                if(error instanceof HttpErrorResponse
                    && error.status === 403) {
                        return this.handleAuthErrors(req, next);
                } else {
                    return throwError(error)
                }
            }));
        }
        return next.handle(req);
    }   
    handleAuthErrors(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        
        if(!this.isTokenRefreshing) {
            this.isTokenRefreshing = true;
            this.refreshTokenSubject.next(null);
            return this.authService.refreshToken().pipe(
                switchMap((refreshTokenResponse: LoginResponse) => {
                    this.isTokenRefreshing = false;
                    this.refreshTokenSubject
                        .next(refreshTokenResponse.authenticationToken);
                    return next.handle(this.addToken(req, 
                        refreshTokenResponse.authenticationToken)); 
                })
            )
        } else {
            return this.refreshTokenSubject.pipe(
                filter(result => result !== null),
                take(1),
                switchMap((res) => {
                    return next.handle(this.addToken(req, 
                        this.authService.getJwtToken()))
                })
            );
        }
    }

    addToken(req: HttpRequest<any>, token: any) {
        return req.clone({
            headers: req.headers.set('Authorization',
                'Bearer '+token)
        });
    }
}