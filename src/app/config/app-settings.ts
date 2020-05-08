import { Injectable } from '@angular/core';

@Injectable()
export class AppSettings {
    public static COOKIE_EXPIRY = (30 * 24 * 60 * 60 * 1000);
    public static PROJECTID = 'projectId';
    public static USERID = 'userId';u
}
