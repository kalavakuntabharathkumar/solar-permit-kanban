import { gql } from '@apollo/client/core';

export const GET_PERMITS = gql`
  query GetPermits($filters: PermitFilters) {
    permits(filters: $filters) {
      id
      jobNumber
      status
      submittedDate
      approvedDate
      scheduledDate
      installedDate
      closedDate
      contractor
      address
      borough
      zipCode
      systemSizeKw
      lastSynced
      pendingSync
    }
  }
`;

export const UPDATE_PERMIT_STATUS = gql`
  mutation UpdatePermitStatus($id: ID!, $status: PermitStatus!) {
    updatePermitStatus(id: $id, status: $status) {
      id
      status
      pendingSync
      lastSynced
    }
  }
`;

export const PERMIT_FRAGMENT = gql`
  fragment PermitFields on Permit {
    id
    jobNumber
    status
    submittedDate
    approvedDate
    scheduledDate
    installedDate
    closedDate
    contractor
    address
    borough
    zipCode
    systemSizeKw
    lastSynced
    pendingSync
  }
`;