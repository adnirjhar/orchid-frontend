import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
    HttpResponse
} from '@angular/common/http';

import {Observable} from 'rxjs';
const JSOG = require('jsog');

export class ResponseInterceptor implements HttpInterceptor {

    constructor() {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return next.handle(request).do((response: HttpEvent<any>) => {

            if (response instanceof HttpResponse && typeof response.body === 'object'  && !(response.body instanceof Blob)) {
                response = response.clone({ body: JSOG.decode(response.body) });
            }
            return response;

        }, (error: HttpErrorResponse) => {

            if (error.error instanceof ErrorEvent) {
                // A client-side or network error occurred. Handle it accordingly.
                console.error('An error occurred:', error.error.message);
            } else {
                // The backend returned an unsuccessful response code.
                // The response body may contain clues as to what went wrong,
                console.error(
                    `Backend returned code ${error.status}, ` +
                    `body was: ${error.error}`);
            }
            // return an observable with a user-facing error message
            return Observable.throw(error);
        });
    }
}
