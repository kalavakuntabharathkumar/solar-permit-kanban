import { TestBed } from '@angular/core/testing';
import { PermitStore } from './permit.store';
import { PermitService } from '../services/permit.service';
import { SolarPermit, PermitStatus } from '../models/permit.model';
import { of } from 'rxjs';

const mockPermits: SolarPermit[] = [
  { id: '1', jobNumber: 'P001', status: 'submitted', submittedDate: '2024-01-01', contractor: 'SolarCo', address: '123 Main St', borough: 'Manhattan', zipCode: '10001', systemSizeKw: 5, lastSynced: Date.now(), pendingSync: false },
  { id: '2', jobNumber: 'P002', status: 'approved', submittedDate: '2024-01-02', approvedDate: '2024-01-05', contractor: 'SunPower', address: '456 Oak Ave', borough: 'Brooklyn', zipCode: '11201', systemSizeKw: 8, lastSynced: Date.now(), pendingSync: false },
];

describe('PermitStore', () => {
  let store: ReturnType<typeof PermitStore>;
  let service: jasmine.SpyObj<PermitService>;

  beforeEach(() => {
    service = jasmine.createSpyObj('PermitService', ['fetchAll', 'updateStatus']);
    service.fetchAll.and.returnValue(of(mockPermits));
    service.updateStatus.and.returnValue(of({ ...mockPermits[0], status: 'approved' }));

    TestBed.configureTestingModule({ providers: [PermitStore, { provide: PermitService, useValue: service }] });
    store = TestBed.inject(PermitStore);
  });

  it('loads permits and groups by status', () => {
    store.loadPermits();
    expect(store.permits().length).toBe(2);
    expect(store.permitsByStatus().submitted.length).toBe(1);
    expect(store.permitsByStatus().approved.length).toBe(1);
  });

  it('optimistic updates permit status', () => {
    store.loadPermits();
    store.optimisticUpdate('1', 'approved');
    expect(store.permits().find((p) => p.id === '1')?.status).toBe('approved');
    expect(store.permits().find((p) => p.id === '1')?.pendingSync).toBeTrue();
  });

  it('filters by borough', () => {
    store.loadPermits();
    store.setFilters({ borough: ['Manhattan'] });
    expect(store.filteredPermits().length).toBe(1);
    expect(store.filteredPermits()[0].borough).toBe('Manhattan');
  });
});