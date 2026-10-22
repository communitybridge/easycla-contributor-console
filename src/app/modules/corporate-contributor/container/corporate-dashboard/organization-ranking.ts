// Copyright The Linux Foundation and each contributor to CommunityBridge.
// SPDX-License-Identifier: MIT

import { Organization } from 'src/app/core/models/organization';

export const UNSIGNED_DISPLAY_LIMIT = 50;

export interface OrganizationGroups {
  signed: Organization[];
  unsigned: Organization[];
}

export function rankOrganizations(
  organizations: Organization[],
  searchText: string
): Organization[] {
  const term = (searchText || '').trim().toLowerCase();
  const name = (organization: Organization) =>
    organization.organization_name || '';
  const startsWithTerm = (organization: Organization) =>
    term !== '' && name(organization).toLowerCase().startsWith(term);

  return [...organizations].sort(
    (a, b) =>
      Number(startsWithTerm(b)) - Number(startsWithTerm(a)) ||
      Number(!!b.has_b2b_account) - Number(!!a.has_b2b_account) ||
      name(a).localeCompare(name(b), undefined, { sensitivity: 'base' })
  );
}

export function groupOrganizations(
  organizations: Organization[],
  searchText: string
): OrganizationGroups {
  const ranked = rankOrganizations(organizations || [], searchText);
  return {
    signed: ranked.filter((organization) => organization.ccla_enabled),
    unsigned: ranked.filter((organization) => !organization.ccla_enabled),
  };
}
