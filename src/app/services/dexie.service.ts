import { Injectable } from '@angular/core';
import Dexie, { Table } from 'dexie';
import { SolarPermit } from '../models/permit.model';

@Injectable({ providedIn: 'root' })
export class DexieService extends Dexie {
  permits!: Table<SolarPermit>;

  constructor() {
    super('PermitFlowDB');
    this.version(1).stores({
      permits: 'id, jobNumber, status, borough, contractor, lastSynced, pendingSync',
    });
  }

  async getAll(): Promise<SolarPermit[]> {
    return this.permits.toArray();
  }

  async put(permit: SolarPermit): Promise<void> {
    await this.permits.put(permit);
  }

  async bulkPut(permits: SolarPermit[]): Promise<void> {
    await this.permits.bulkPut(permits);
  }

  async getPendingSync(): Promise<SolarPermit[]> {
    return this.permits.where('pendingSync').equals(true).toArray();
  }

  async clearPendingSync(id: string): Promise<void> {
    await this.permits.update(id, { pendingSync: false });
  }
}