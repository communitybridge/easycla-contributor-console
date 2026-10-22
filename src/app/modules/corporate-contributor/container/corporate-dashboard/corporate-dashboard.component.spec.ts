// Copyright The Linux Foundation and each contributor to CommunityBridge.
// SPDX-License-Identifier: MIT

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CorporateDashboardComponent } from './corporate-dashboard.component';
import { RouterTestingModule } from '@angular/router/testing';
import { AlertService } from 'src/app/shared/services/alert.service';
import { HttpClientModule } from '@angular/common/http';
import { StorageService } from 'src/app/shared/services/storage.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Organization } from 'src/app/core/models/organization';

function org(
    name: string,
    overrides: Partial<Organization> = {}
): Organization {
    return {
        organization_id: 'id-' + name,
        organization_name: name,
        organization_website: 'https://example.org',
        signing_entity_names: [],
        ccla_enabled: false,
        ...overrides,
    };
}

function unsignedOrgs(count: number): Organization[] {
    return Array.from({ length: count }, (_, i) =>
        org('Acme ' + String(i).padStart(3, '0'))
    );
}

describe('CorporateDashboardComponent', () => {
    let component: CorporateDashboardComponent;
    let fixture: ComponentFixture<CorporateDashboardComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [CorporateDashboardComponent],
            imports: [FormsModule, ReactiveFormsModule, RouterTestingModule, HttpClientModule],
            providers: [AlertService, StorageService]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CorporateDashboardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    function showResults(list: Organization[], searchText = 'acme') {
        component.form.controls.companyName.setValue(searchText);
        component.organizationList = { list };
        component.updateOrganizationGroups();
        component.hasShowDropdown = true;
        component.emptySearchError = false;
        fixture.detectChanges();
    }

    const element = (): HTMLElement => fixture.nativeElement;
    const rowNames = () =>
        Array.from(element().querySelectorAll('.companies .organization-name')).map(
            (row) => row.textContent.trim()
        );
    const normalize = (value: string) => value.replace(/\s+/g, ' ').trim();
    const text = () => normalize(element().querySelector('.companies').textContent);
    const showMoreButton = (): HTMLButtonElement =>
        element().querySelector('.show-unsigned');

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('lists signed organizations first and hides unsigned ones behind Show more', () => {
        showResults([
            org('Acme Unsigned'),
            org('Other Acme', { ccla_enabled: true }),
            org('Acme Signed', { ccla_enabled: true }),
        ]);

        expect(rowNames()).toEqual(['Acme Signed', 'Other Acme']);
        expect(showMoreButton().textContent.trim()).toBe(
            'Show 1 more without a signed CLA'
        );
        expect(text()).not.toContain('None of these has signed');
    });

    it('marks each signed row "CCLA signed" on the name line and leaves unsigned rows unmarked', () => {
        showResults([
            org('Acme Unsigned'),
            org('Acme Signed', { ccla_enabled: true }),
        ]);
        showMoreButton().click();
        fixture.detectChanges();

        const lines = Array.from(
            element().querySelectorAll('.companies .organization-line')
        ).map((line) => normalize(line.textContent));

        expect(lines).toEqual(['Acme Signed CCLA signed', 'Acme Unsigned']);
    });

    it('shows no badge for an organization with a Salesforce B2B account', () => {
        showResults([org('Acme B2B', { has_b2b_account: true })]);

        expect(text()).toBe(
            'None of these has signed a Corporate CLA yet. Acme B2B https://example.org'
        );
    });

    it('marks each signed row "CCLA signed" on the name line and leaves unsigned rows unmarked', () => {
        showResults([
            org('Acme Unsigned'),
            org('Acme Signed', { ccla_enabled: true }),
        ]);
        showMoreButton().click();
        fixture.detectChanges();

        const lines = Array.from(
            element().querySelectorAll('.companies .organization-line')
        ).map((line) => normalize(line.textContent));

        expect(lines).toEqual(['Acme Signed CCLA signed', 'Acme Unsigned']);
    });

    it('shows no badge for an organization with a Salesforce B2B account', () => {
        showResults([org('Acme B2B', { has_b2b_account: true })]);

        expect(text()).toBe(
            'None of these has signed a Corporate CLA yet. Acme B2B https://example.org'
        );
    });

    it('shows the unsigned organizations after Show more', () => {
        showResults([
            org('Acme Unsigned'),
            org('Acme Signed', { ccla_enabled: true }),
        ]);

        showMoreButton().click();
        fixture.detectChanges();

        expect(rowNames()).toEqual(['Acme Signed', 'Acme Unsigned']);
        expect(showMoreButton()).toBeNull();
    });

    it('caps the unsigned list at 50 and says how many more there are', () => {
        showResults([org('Acme Signed', { ccla_enabled: true }), ...unsignedOrgs(53)]);

        showMoreButton().click();
        fixture.detectChanges();

        expect(rowNames().length).toBe(51);
        expect(text()).toContain('3 more. Type more of the name to narrow the list.');
    });

    it('does not show the "type more" line at exactly 50 unsigned matches', () => {
        showResults([org('Acme Signed', { ccla_enabled: true }), ...unsignedOrgs(50)]);

        showMoreButton().click();
        fixture.detectChanges();

        expect(rowNames().length).toBe(51);
        expect(text()).not.toContain('Type more of the name');
    });

    it('shows every match at once, capped at 50, when none has signed', () => {
        showResults(unsignedOrgs(52));

        expect(text()).toContain('None of these has signed a Corporate CLA yet.');
        expect(showMoreButton()).toBeNull();
        expect(rowNames().length).toBe(50);
        expect(text()).toContain('2 more. Type more of the name to narrow the list.');
    });

    it('hides the unsigned organizations again after a new search', () => {
        showResults([org('Acme Unsigned'), org('Acme Signed', { ccla_enabled: true })]);
        showMoreButton().click();
        fixture.detectChanges();

        showResults([org('Acme Other'), org('Acme Signed', { ccla_enabled: true })]);

        expect(rowNames()).toEqual(['Acme Signed']);
        expect(showMoreButton()).not.toBeNull();
    });

    it('selects any row exactly as before', () => {
        const unsigned = org('Acme Unsigned');
        showResults([unsigned, org('Acme Signed', { ccla_enabled: true })]);
        showMoreButton().click();
        fixture.detectChanges();

        const rows = element().querySelectorAll<HTMLElement>('.companies .item');
        rows[1].click();

        expect(component.selectedCompany).toBe(unsigned.organization_id);
        expect(component.form.controls.companyName.value).toBe('Acme Unsigned');
        expect(component.hasShowDropdown).toBe(false);
    });

    it('labels the footer link to add an organization', () => {
        showResults([org('Acme Signed', { ccla_enabled: true })]);

        expect(normalize(element().querySelector('.footer').textContent)).toContain(
            'Not listed? + Add your organization'
        );
    });
});
