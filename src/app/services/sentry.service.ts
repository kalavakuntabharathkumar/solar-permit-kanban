import { Injectable } from '@angular/core';
import * as Sentry from '@sentry/angular';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SentryService {
  init(): void {
    if (environment.sentryDsn) {
      Sentry.init({
        dsn: environment.sentryDsn,
        environment: environment.production ? 'production' : 'development',
        tracesSampleRate: 0.1,
        replaysOnErrorSampleRate: 1.0,
        replaysSessionSampleRate: 0.1,
        integrations: [
          Sentry.browserTracingIntegration(),
          Sentry.replayIntegration({
            maskAllText: true,
            blockAllMedia: true,
          }),
        ],
        beforeSend(event) {
          if (event.exception) {
            event.tags = { ...event.tags, component: 'permit-flow' };
          }
          return event;
        },
      });
    }
  }

  captureError(error: Error, context?: Record<string, any>): void {
    Sentry.captureException(error, { extra: context });
  }

  addBreadcrumb(breadcrumb: Sentry.Breadcrumb): void {
    Sentry.addBreadcrumb(breadcrumb);
  }

  setUserContext(user: { id: string; email?: string }): void {
    Sentry.setUser(user);
  }
}

export const provideSentry = () => {
  const service = new SentryService();
  service.init();
  return service;
};