import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
    HttpResponse
} from '@angular/common/http';

import {Observable} from 'rxjs/Observable';

export class HeaderInterceptor implements HttpInterceptor {

    constructor() {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        let clonedRequest = req.clone({
            setHeaders: {
                'Content-Type':  'application/json'
            },
            url : '/orchid' + req.url
        });

        return next.handle(clonedRequest);
    }
}
