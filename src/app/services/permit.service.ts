import { Injectable, inject } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { DexieService } from './dexie.service';
import { SolarPermit, PermitStatus, SyncResult } from '../models/permit.model';
import { Observable, from, map, catchError, of, switchMap, tap } from 'rxjs';
import { SentryService } from './sentry.service';

const SOCRATA_URL = 'https://data.cityofnewyork.us/resource/rvxe-9y9u.json';

@Injectable({ providedIn: 'root' })
export class PermitService {
  private apollo = inject(Apollo);
  private dexie = inject(DexieService);
  private sentry = inject(SentryService);

  async fetchAll(): Promise<SolarPermit[]> {
    try {
      const cached = await this.dexie.getAll();
      if (cached.length > 0) {
        this.syncFromApi().subscribe();
        return cached;
      }
      return this.fetchFromApi().toPromise() ?? [];
    } catch (err) {
      this.sentry.captureError(err as Error, { context: 'fetchAll' });
      throw err;
    }
  }

  private fetchFromApi(): Observable<SolarPermit[]> {
    return from(fetch(`${SOCRATA_URL}?$limit=2000&$order=submitted_date DESC`)).pipe(
      switchMap((res) => {
        if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`);
        return res.json();
      }),
      map((data: any[]) => this.transformRecords(data)),
      tap((permits) => this.dexie.bulkPut(permits)),
      catchError((err) => {
        this.sentry.captureError(err, { context: 'fetchFromApi' });
        return of([]);
      })
    );
  }

  private syncFromApi(): Observable<SyncResult> {
    return this.fetchFromApi().pipe(
      map((serverPermits) => this.reconcile(serverPermits)),
      tap((result) => this.sentry.addBreadcrumb({ category: 'sync', data: result }))
    );
  }

  private reconcile(server: SolarPermit[]): SyncResult {
    let success = 0, failed = 0, conflicts = 0;
    // Simplified reconciliation - in production would compare timestamps
    this.dexie.bulkPut(server);
    return { success: server.length, failed: 0, conflicts: 0 };
  }

  updateStatus(id: string, status: PermitStatus): Observable<SolarPermit> {
    const updated: SolarPermit = { ...this.getLocalPermit(id), status, pendingSync: true, lastSynced: Date.now() };
    return from(this.dexie.put(updated)).pipe(
      map(() => updated),
      catchError((err) => {
        this.sentry.captureError(err, { context: 'updateStatus', permitId: id });
        throw err;
      })
    );
  }

  private getLocalPermit(id: string): SolarPermit {
    // In real app, query Dexie; here return mock for type safety
    return {} as SolarPermit;
  }

  private transformRecords(data: any[]): SolarPermit[] {
    return data.map((d) => ({
      id: d.job_number || d.id,
      jobNumber: d.job_number,
      status: this.mapStatus(d.permit_status),
      submittedDate: d.submitted_date,
      approvedDate: d.approved_date,
      scheduledDate: d.scheduled_date,
      installedDate: d.installed_date,
      closedDate: d.closed_date,
      contractor: d.contractor_name || 'Unknown',
      address: d.house_number + ' ' + d.street_name,
      borough: d.borough,
      zipCode: d.zip_code,
      systemSizeKw: parseFloat(d.system_size_kw) || 0,
      lastSynced: Date.now(),
      pendingSync: false,
    }));
  }

  private mapStatus(s: string): PermitStatus {
    const map: Record<string, PermitStatus> = {
      'Submitted': 'submitted',
      'Approved': 'approved',
      'Scheduled': 'scheduled',
      'Installed': 'installed',
      'Closed': 'closed',
    };
    return map[s] || 'submitted';
  }
}