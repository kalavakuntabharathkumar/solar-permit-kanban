import { Injectable } from '@angular/core';
import { Apollo, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache, makeVar, TypePolicies } from '@apollo/client/core';
import { environment } from '../../environments/environment';

const typePolicies: TypePolicies = {
  Query: {
    fields: {
      permits: {
        keyArgs: ['filters'],
        merge(existing, incoming) {
          return incoming;
        },
      },
    },
  },
  Permit: {
    keyFields: ['id'],
  },
};

export const filterVar = makeVar<Record<string, any>>({});

export function provideApollo() {
  return {
    provide: APOLLO_OPTIONS,
    useFactory: (httpLink: HttpLink) => ({
      link: httpLink.create({ uri: environment.graphqlEndpoint || '/graphql' }),
      cache: new InMemoryCache({ typePolicies }),
      defaultOptions: {
        watchQuery: { fetchPolicy: 'cache-and-network' },
        query: { fetchPolicy: 'cache-first' },
      },
    }),
    deps: [HttpLink],
  };
}