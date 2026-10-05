import { signalStore, withState, withMethods, patchState, withComputed } from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import { PermitService } from '../services/permit.service';
import { SolarPermit, PermitStatus, STATUS_ORDER, PermitFilters } from '../models/permit.model';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap, catchError, of } from 'rxjs';

interface PermitState {
  permits: SolarPermit[];
  filters: PermitFilters;
  loading: boolean;
  error: string | null;
  lastSync: number | null;
}

export const PermitStore = signalStore(
  { providedIn: 'root' },
  withState<PermitState>({
    permits: [],
    filters: {},
    loading: false,
    error: null,
    lastSync: null,
  }),
  withComputed((store) => ({
    permitsByStatus: computed(() => {
      const grouped: Record<PermitStatus, SolarPermit[]> = {
        submitted: [],
        approved: [],
        scheduled: [],
        installed: [],
        closed: [],
      };
      store.permits().forEach((p) => grouped[p.status].push(p));
      return grouped;
    }),
    filteredPermits: computed(() => {
      let result = store.permits();
      const f = store.filters();
      if (f.status?.length) result = result.filter((p) => f.status!.includes(p.status));
      if (f.borough?.length) result = result.filter((p) => f.borough!.includes(p.borough));
      if (f.contractor) result = result.filter((p) => p.contractor.includes(f.contractor!));
      return result;
    }),
    stats: computed(() => ({
      total: store.permits().length,
      byStatus: STATUS_ORDER.reduce((acc, s) => ({ ...acc, [s]: store.permits().filter((p) => p.status === s).length }), {} as Record<PermitStatus, number>),
    })),
  })),
  withMethods((store, permitService = inject(PermitService)) => ({
    loadPermits: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap(() => permitService.fetchAll().pipe(
          tap((permits) => patchState(store, { permits, loading: false, lastSync: Date.now() })),
          catchError((err) => {
            patchState(store, { loading: false, error: err.message });
            return of([]);
          })
        ))
      )
    ),

    updateStatus: rxMethod<{ id: string; status: PermitStatus }>(
      pipe(
        switchMap(({ id, status }) => permitService.updateStatus(id, status).pipe(
          tap((updated) => {
            patchState(store, { permits: store.permits().map((p) => (p.id === id ? updated : p)) });
          }),
          catchError((err) => {
            patchState(store, { error: `Failed to update: ${err.message}` });
            return of(null);
          })
        ))
      )
    ),

    setFilters: (filters: Partial<PermitFilters>) =>
      patchState(store, { filters: { ...store.filters(), ...filters } }),

    optimisticUpdate: (id: string, status: PermitStatus) => {
      patchState(store, {
        permits: store.permits().map((p) =>
          p.id === id ? { ...p, status, pendingSync: true, lastSynced: Date.now() } : p
        ),
      });
    },
  }))
);

export const provideStore = () => PermitStore;