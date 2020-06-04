import { TestBed } from '@angular/core/testing';
import { LoaderInterceptorService } from './loader-interceptor.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('LoaderInterceptorService', () => {
    let service: LoaderInterceptorService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
        });
        service = TestBed.inject(LoaderInterceptorService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
