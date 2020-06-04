import { TestBed } from '@angular/core/testing';

import { ClaContributorService } from './cla-contributor.service';
import { HttpClientModule } from '@angular/common/http';
import { AlertService } from 'src/app/shared/services/alert.service';
import { RouterTestingModule } from '@angular/router/testing';
import { StorageService } from 'src/app/shared/services/storage.service';

describe('ClaContributorService', () => {
    let service: ClaContributorService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule, HttpClientModule],
            providers: [AlertService, StorageService]
        });
        service = TestBed.inject(ClaContributorService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
