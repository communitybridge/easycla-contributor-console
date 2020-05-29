import { Injectable } from '@angular/core';

@Injectable()
export class AppSettings {
    /* eslint-disable */
    public static COOKIE_EXPIRY = (30 * 24 * 60 * 60 * 1000);
    public static CLA_USER = 'cla-user';
    public static HEADER_ACCEPT_LANGUAGE = 'en-US';
    public static HEADER_CONTENT_TYPE = 'application/json';
    public static TOKEN_KEY = 'token_id';
    public static EMAIL_PATTERN = '[a-z|A-Z|0-9]+[@]+[a-z|A-Z|0-9]+[.]+([a-z|A-Z|0-9]){2}';
    public static USERNAME_REGEX = '/^[a-zA-Z0-9_]{1,15}$/';
    public static URL_PATTERN = '^((ht|f)tp(s?))\://([0-9a-zA-Z\-]+\.)+[a-zA-Z]{2,6}(\:[0-9]+)?(/\S*)?$';
    public static TOKEN = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlJFWTNSVGcyTTBVMk5URTRSamcwTUVRNU9VSkZRMFpGTVVGRVJUaEVRVVF5TTBZeVF6QXhOQSJ9.eyJodHRwczovL3Nzby5saW51eGZvdW5kYXRpb24ub3JnL2NsYWltcy91c2VybmFtZSI6ImFtb2xzb250YWtrZSIsImdpdmVuX25hbWUiOiJBbW9sIiwiZmFtaWx5X25hbWUiOiJTYW50YWtrZSIsIm5pY2tuYW1lIjoiYW1vbHNvbnRha2tlIiwibmFtZSI6IkFtb2wgU2FudGFra2UiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tLy1CWUNnSzRLSEQ5dy9BQUFBQUFBQUFBSS9BQUFBQUFBQUFBQS9BQ0hpM3JjVzg2ekJrWHNOY3hydWN5cmswWDloYXJDcC13L3Bob3RvLmpwZyIsInVwZGF0ZWRfYXQiOiIyMDIwLTA1LTI2VDA2OjM1OjM0Ljc1MFoiLCJlbWFpbCI6ImFtb2xzQHByb3hpbWFiaXouY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImlzcyI6Imh0dHBzOi8vbGludXhmb3VuZGF0aW9uLWRldi5hdXRoMC5jb20vIiwic3ViIjoiYXV0aDB8YW1vbHNvbnRha2tlIiwiYXVkIjoiaHF1WkhPOEpOc2FJU2NvYXlQdENTNVZFTGRuN1RuVnEiLCJpYXQiOjE1OTA0NzQ5MzYsImV4cCI6MTU5MDUxMDkzNiwiYXRfaGFzaCI6InVwdHc1WkRZdkNRMmZ2Wk8wT3p1UVEiLCJub25jZSI6IkpNb1NWU0tkWDFHSmhjN1Y0fjNscFR5RHVua09yOWh0In0.s3o7Tsf5m0-x3skXshNk7awkffhnIfhkzfSZojlUrqTj5L0ST8qy0udspw1-l65FU0j10x8Ne8XFCpQpixm3UGnvyvod2NPEtWMUKSd3ocqqbGGzPVC8jKfsjPTTnGq3hryS4gI3GXDeoUWrqEq5tG7N1wlmIpOqZGP8l_D353xvb6DRqgPEXaM6U0D5I3aw0GJXJHh2iIYTEEbLTo9-9dkLLuULwAF1xhN9c6vdLBXe-5tyqzoDUyMyHIFO57zHj46MVcSkJfYqHi5xf4tbs7Wf5-YbxXKFURynPNEVI2YlCso4CTJNeqYNOQDSQUHAQaGqf2xU9MCvKZl6sFiSjA';
}
