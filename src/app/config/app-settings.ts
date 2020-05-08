import { Injectable } from '@angular/core';

@Injectable()
export class AppSettings {
    public static COOKIE_EXPIRY = (30 * 24 * 60 * 60 * 1000);
    public static PROJECT_ID = 'projectId';
    public static PROJECT_NAME = 'projectName';
    public static USER_ID = 'userId';
}
