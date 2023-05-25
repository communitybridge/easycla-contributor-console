// Copyright The Linux Foundation and each contributor to CommunityBridge.
// SPDX-License-Identifier: MIT

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from './shared/shared.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoaderInterceptorService } from './shared/services/loader-interceptor.service';
import { AlertService } from './shared/services/alert.service';
import { AlertComponent } from './shared/components/alert/alert.component';
import { IndividualContributorModule } from './modules/individual-contributor/individual-contributor.module';
import { CorporateContributorModule } from './modules/corporate-contributor/corporate-contributor.module';
import { FormsModule } from '@angular/forms';
import { AuthModule } from '@auth0/auth0-angular';
import { EnvConfig } from './config/cla-env-utils';
import { AuthInterceptorService } from './shared/services/auth-interceptor.service';
import { environment } from 'src/environments/environment';

@NgModule({
  declarations: [AppComponent, AlertComponent],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    SharedModule,
    DashboardModule,
    IndividualContributorModule,
    CorporateContributorModule,
    FormsModule,
    AuthModule.forRoot({
      domain: EnvConfig.default['auth0-domain'],
      clientId: EnvConfig.default['auth0-clientId'],
      redirectUri: window.location.origin + '/#/auth',
      audience: environment.auth0Audience,
      authorizationParams: {
        redirect_uri: window.location.origin + '/#/auth',
      },
      useRefreshTokens: true,
      scope: 'access:api openid email profile offline_access',
    }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptorService,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
    AlertService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
