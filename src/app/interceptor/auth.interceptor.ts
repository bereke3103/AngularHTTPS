import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpEventType,
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export class AuthInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const cloned = req.clone({
      headers: req.headers.append('Auth', 'SOME_RANDOM_TOKEN'),
    });
    console.log('Intercept request', cloned);
    return next.handle(cloned).pipe(
      tap((event) => {
        if (event.type === HttpEventType.Response) {
          console.log('Interceptor response', event);
        }
      })
    );
  }
}
