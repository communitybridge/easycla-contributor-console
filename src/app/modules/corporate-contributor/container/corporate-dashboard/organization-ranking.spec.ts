// Copyright The Linux Foundation and each contributor to CommunityBridge.
// SPDX-License-Identifier: MIT

import { Organization } from 'src/app/core/models/organization';
import { groupOrganizations, rankOrganizations } from './organization-ranking';

function org(
  name: string,
  overrides: Partial<Organization> = {}
): Organization {
  return {
    organization_id: name,
    organization_name: name,
    organization_website: 'https://example.org',
    signing_entity_names: [],
    ccla_enabled: false,
    ...overrides,
  };
}

const names = (organizations: Organization[]) =>
  organizations.map((organization) => organization.organization_name);

describe('rankOrganizations', () => {
  it('puts names that start with the search text first', () => {
    const ranked = rankOrganizations(
      [org('Big Acme'), org('Acme Labs'), org('Zeta Acme')],
      'acme'
    );
    expect(names(ranked)).toEqual(['Acme Labs', 'Big Acme', 'Zeta Acme']);
  });

  it('puts Salesforce B2B organizations before the rest when the prefix ties', () => {
    const ranked = rankOrganizations(
      [
        org('Acme Alpha'),
        org('Acme Beta', { has_b2b_account: true }),
        org('Other Acme', { has_b2b_account: true }),
        org('Another Acme'),
      ],
      'acme'
    );
    expect(names(ranked)).toEqual([
      'Acme Beta',
      'Acme Alpha',
      'Other Acme',
      'Another Acme',
    ]);
  });

  it('falls back to A-Z ignoring case', () => {
    const ranked = rankOrganizations(
      [org('charlie'), org('Bravo'), org('alpha')],
      'zzz'
    );
    expect(names(ranked)).toEqual(['alpha', 'Bravo', 'charlie']);
  });

  it('matches the prefix ignoring case and surrounding spaces', () => {
    const ranked = rankOrganizations([org('Big ACME'), org('ACME Corp')], '  Acme ');
    expect(names(ranked)).toEqual(['ACME Corp', 'Big ACME']);
  });

  it('treats a missing has_b2b_account as false', () => {
    const ranked = rankOrganizations(
      [org('Acme A'), org('Acme B', { has_b2b_account: true })],
      'acme'
    );
    expect(names(ranked)).toEqual(['Acme B', 'Acme A']);
  });

  it('does not reorder the input array', () => {
    const input = [org('Bravo'), org('Alpha')];
    rankOrganizations(input, '');
    expect(names(input)).toEqual(['Bravo', 'Alpha']);
  });
});

describe('groupOrganizations', () => {
  it('splits signed from unsigned and ranks each part', () => {
    const groups = groupOrganizations(
      [
        org('Other Acme', { ccla_enabled: true }),
        org('Acme Two'),
        org('Acme Signed', { ccla_enabled: true }),
        org('Acme One', { has_b2b_account: true }),
      ],
      'acme'
    );
    expect(names(groups.signed)).toEqual(['Acme Signed', 'Other Acme']);
    expect(names(groups.unsigned)).toEqual(['Acme One', 'Acme Two']);
  });

  it('returns empty parts for no results', () => {
    expect(groupOrganizations(undefined, 'acme')).toEqual({
      signed: [],
      unsigned: [],
    });
  });
});
