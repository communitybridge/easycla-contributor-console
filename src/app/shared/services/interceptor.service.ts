// Copyright The Linux Foundation and each contributor to CommunityBridge.
// SPDX-License-Identifier: MIT

import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, mergeMap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class InterceptorService {
  constructor() {
  }
}
