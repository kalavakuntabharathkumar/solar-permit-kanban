import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideApollo } from './graphql/apollo.provider';
import { provideStore } from './store/permit.store';
import { provideSentry } from './services/sentry.service';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withFetch()),
    provideRouter(routes),
    provideApollo(),
    provideStore(),
    provideSentry(),
  ],
};