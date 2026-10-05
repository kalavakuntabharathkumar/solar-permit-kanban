import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideApollo } from './app/graphql/apollo.provider';
import { provideStore } from './app/store/permit.store';
import { provideSentry } from './app/services/sentry.service';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withFetch()),
    provideRouter(routes),
    provideApollo(),
    provideStore(),
    provideSentry(),
  ],
}).catch((err) => console.error('Bootstrap failed:', err));
