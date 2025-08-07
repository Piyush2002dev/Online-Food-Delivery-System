import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('jwt');

    // Only log for API requests to reduce console noise
    if (req.url.startsWith('http://localhost:9095/api')) {
      console.log('=== AUTH INTERCEPTOR DEBUG ===');
      console.log('Intercepted request:', req.url);
      console.log('Token found:', !!token);
      console.log('Token from localStorage:', token ? `${token.substring(0, 20)}...` : 'null');
      console.log('================================');
    }

    // Only attach token for your API
    if (token && req.url.startsWith('http://localhost:9095/api')) {
      const authHeaders = { Authorization: `Bearer ${token}` };
      const cloned = req.clone({
        setHeaders: authHeaders
      });
      console.log('✅ Request cloned with Authorization header:', authHeaders);
      return next.handle(cloned);
    }

    if (req.url.startsWith('http://localhost:9095/api')) {
      console.log('❌ No token or not API request, proceeding without Authorization header');
    }
    return next.handle(req);
  }
}
