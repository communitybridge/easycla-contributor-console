import { Injectable } from '@angular/core';
import createAuth0Client from '@auth0/auth0-spa-js';
import Auth0Client from '@auth0/auth0-spa-js/dist/typings/Auth0Client';
import { from, of, Observable, BehaviorSubject, combineLatest, throwError } from 'rxjs';
import { tap, catchError, concatMap, shareReplay } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AppSettings } from 'src/app/config/app-settings';
import { StorageService } from './storage.service';
import { AUTH_ROUTE } from 'src/app/config/auth-utils';
import { EnvConfig } from 'src/app/config/cla-env-utils';

function log(text, value: any = '') {
  console.log(`(authservice) ${text} > `, value ? JSON.stringify({ value }) : null);
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  auth0Options = {
    domain: EnvConfig.default['auth0-domain'], // e.g linuxfoundation-dev.auth0.com
    clientId: EnvConfig.default['auth0-clientId'],
    redirectUri: `${window.location.origin}` + AUTH_ROUTE, // *info from allowed_logout_urls
  };

  currentHref = window.location.href;

  loading$ = new BehaviorSubject<any>(true);
  // Create an observable of Auth0 instance of client
  auth0Client$ = (from(
    createAuth0Client({
      domain: this.auth0Options.domain,
      client_id: this.auth0Options.clientId,
      redirect_uri: this.auth0Options.redirectUri,
      cacheLocation: 'memory',
      useRefreshTokens: true,
    })
  ) as Observable<Auth0Client>).pipe(
    shareReplay(1), // Every subscription receives the same shared value
    catchError((err) => {
      this.loading$.next(false);
      return throwError(err);
    })
  );
  // Define observables for SDK methods that return promises by default
  // For each Auth0 SDK method, first ensure the client instance is ready
  // concatMap: Using the client instance, call SDK method; SDK returns a promise
  // from: Convert that resulting promise into an observable
  isAuthenticated$ = this.auth0Client$.pipe(
    concatMap((client: Auth0Client) => from(client.isAuthenticated())),
    tap((res: any) => {
      tap(() => { log('this.auth0Client$.pipe > concatMap > tap', { res }) }),

        // *info: once isAuthenticated$ responses , SSO sessiong is loaded
        this.loading$.next(false);
      this.loggedIn = res;
    })
  );
  handleRedirectCallback$ = this.auth0Client$.pipe(
    tap(() => {
      // *info: We need to use the URL with code and state store in the service because
      // the URL will be cleaned with the Navigation Start Event (angular booststrap)
      log('this.currentHref', { currentHref: this.currentHref })
    }),
    concatMap((client: Auth0Client) => from(client.handleRedirectCallback(this.currentHref)))
  );
  // Create subject and public observable of user profile data
  private userProfileSubject$ = new BehaviorSubject<any>(null);
  userProfile$ = this.userProfileSubject$.asObservable();
  // Create a local property for login status
  loggedIn = false;

  constructor(
    private router: Router,
    private storageService: StorageService
  ) {
    // On initial load, check authentication state with authorization server
    // Set up local auth streams if user is already authenticated
    this.localAuthSetup();
    // Handle redirect from Auth0 login
    this.handleAuthCallback();
  }

  // When calling, options can be passed if desired
  // https://auth0.github.io/auth0-spa-js/classes/auth0client.html#getuser
  getUser$(options?): Observable<any> {
    return this.auth0Client$.pipe(
      concatMap((client: Auth0Client) => from(client.getUser(options))),
      tap((user) => {
        // this.setSession(user);
        this.userProfileSubject$.next(user);
      })
    );
  }

  private localAuthSetup() {
    // This should only be called on app initialization
    // Set up local authentication streams
    const checkAuth$ = this.isAuthenticated$.pipe(
      concatMap((loggedIn: boolean) => {
        log('localAuthSetup > his.isAuthenticated$.pipe  > concatMap', { loggedIn });
        if (loggedIn) {
          // If authenticated, get user and set in app
          // NOTE: you could pass options here if needed
          return this.getUser$();
        }
        this.auth0Client$.pipe(
          concatMap((client: Auth0Client) => from(client.checkSession()))).subscribe((data) => {
            log('localAuthSetup > checkSession >  data', { data })
          })
        // If not authenticated, return stream that emits 'false'
        return of(loggedIn);
      })
    );
    checkAuth$.subscribe();
  }

  login(redirectPath: string = '/') {
    // A desired redirect path can be passed to login method
    // (e.g., from a route guard)
    // Ensure Auth0 client instance exists
    this.auth0Client$.subscribe((client: Auth0Client) => {
      // Call method to log in
      client.loginWithRedirect({
        redirect_uri: `${window.location.origin}`,
        appState: { target: redirectPath },
      });
    });
  }

  private handleAuthCallback() {
    // Call when app reloads after user logs in with Auth0
    const params = window.location.search;
    if (params.includes('code=') && params.includes('state=')) {
      let targetRoute: string; // Path to redirect to after login processsed
      const authComplete$ = this.handleRedirectCallback$.pipe(
        // Have client, now call method to handle auth callback redirect
        tap((cbRes: any) => {
          const element: any = document.getElementById('lfx-header');
          element.authuser = this.getUser$();
          // Get and set target redirect route from callback results
          targetRoute = cbRes.appState && cbRes.appState.target ? cbRes.appState.target : '/';
        }),
        concatMap(() => {
          // Redirect callback complete; get user and login status
          return combineLatest([this.getUser$(), this.isAuthenticated$]);
        })
      );
      // Subscribe to authentication completion observable
      // Response will be an array of user and login status
      authComplete$.subscribe(() => {
        // Redirect to target route after callback processing
        if (targetRoute === '/') {
          this.redirectAsPerType();
        } else {
          this.router.navigate([targetRoute]);
        }
      });
    }
  }

  logout() {
    // Ensure Auth0 client instance exists
    this.auth0Client$.subscribe((client: Auth0Client) => {
      // Call method to log out
      client.logout({
        client_id: this.auth0Options.clientId,
        returnTo: this.auth0Options.redirectUri,
      });
    });
  }

  getTokenSilently$(options?): Observable<any> {
    return this.auth0Client$.pipe(concatMap((client: Auth0Client) => from(client.getTokenSilently(options))));
  }

  getIdToken$(options?): Observable<any> {
    return this.auth0Client$.pipe(
      concatMap((client: Auth0Client) => from(client.getIdTokenClaims(options))),
      concatMap((claims: any) => of(claims.__raw))
    );
  }

  /* Extra method added */
  private setSession(authResult): void {
    const sessionData = {
      userid: authResult.nickname,
      user_email: authResult.email,
      user_name: authResult.name
    }
    this.storageService.setItem(AppSettings.AUTH_DATA, sessionData);
  }

  public getIdToken(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const token = this.getIdToken$({ ignoreCache: true }).toPromise();
      resolve(token);
    });
  }

  private redirectForGerritFlow() {
    const userId = JSON.parse(localStorage.getItem(AppSettings.USER_ID));
    const contractType = JSON.parse(localStorage.getItem(AppSettings.CONTRACT_TYPE));
    const projectId = JSON.parse(localStorage.getItem(AppSettings.PROJECT_ID));
    if (contractType === 'individual') {
      const url = '/individual-dashboard/' + projectId + '/' + userId;
      this.router.navigate([url]);
    } else if (contractType === 'corporate') {
      const url = '/corporate-dashboard/' + projectId + '/' + userId;
      this.router.navigate([url]);
    }
  }

  private redirectToGithubDashboard() {
    const redirectUrl = JSON.parse(localStorage.getItem(AppSettings.REDIRECT));
    const projectId = JSON.parse(localStorage.getItem(AppSettings.PROJECT_ID));
    const userId = JSON.parse(localStorage.getItem(AppSettings.USER_ID));
    this.router.navigate(['/cla/project/' + projectId + '/user/' + userId],
      { queryParams: { redirect: redirectUrl } });
  }

  private redirectAsPerType() {
    const hasGerrit = JSON.parse(localStorage.getItem(AppSettings.HAS_GERRIT));
    if (hasGerrit) {
      this.redirectForGerritFlow();
    } else {
      this.redirectToGithubDashboard();
    }
  }
}
