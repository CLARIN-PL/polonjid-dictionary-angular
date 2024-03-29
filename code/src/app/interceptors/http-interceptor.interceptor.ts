import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpRequest,
  HttpResponse,
  HttpInterceptor,
  HttpHandler,
} from "@angular/common/http";
import { of as observableOf, Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { RequestCacheService } from "../services/request-cache.service";
import { LoadingBarService } from "@ngx-loading-bar/core";

@Injectable()
export class CachingInterceptor implements HttpInterceptor {
  constructor(
    private cache: RequestCacheService,
    private loadingBar: LoadingBarService
  ) {}

  // graph should be cached elsewhere
  notCacheableURIs = ["/graph"];

  private isRequestCacheable(req: HttpRequest<any>) {
    if (req.method !== "GET") {
      return false;
    }

    this.notCacheableURIs.forEach((nonCachableURI) => {
      if (req.url.indexOf(nonCachableURI) > -1) {
        return false;
      }
    });

    return true;
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const cachedResponse: HttpEvent<any> = this.cache.get(req);

    this.loadingBar.start();

    // for debug, turn off cache
    this.loadingBar.complete();
    return this.sendRequest(req, next, this.cache);

    if (!this.isRequestCacheable(req)) {
      this.loadingBar.complete();
      return next.handle(req);
    }

    if (cachedResponse) {
      this.loadingBar.complete();
      return observableOf(cachedResponse);
    }

    this.loadingBar.complete();
    return this.sendRequest(req, next, this.cache);
  }

  sendRequest(
    req: HttpRequest<any>,
    next: HttpHandler,
    cache: RequestCacheService
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap((event) => {
        if (event instanceof HttpResponse) {
          cache.put(req, event);
        }
      })
    );
  }
}
