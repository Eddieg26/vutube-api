import {neon} from '@neondatabase/serverless';
import {drizzle, NeonHttpDatabase} from 'drizzle-orm/neon-http';
import {PgTable, SelectedFields} from 'drizzle-orm/pg-core';
import {v4 as uuid} from 'uuid';

export class Database {
  url: string;
  private db: NeonHttpDatabase<Record<string, never>>;

  constructor(url: string) {
    const sql = neon(url);
    this.db = drizzle(sql);
    this.url = url;
  }

  generateId() {
    return uuid();
  }

  select() {
    return this.db.select();
  }

  selectFields<Selection extends SelectedFields>(fields: Selection) {
    return this.db.select(fields);
  }

  selectDistinct() {
    return this.db.selectDistinct();
  }

  selectDistinctFields<Selection extends SelectedFields>(fields: Selection) {
    return this.db.selectDistinct(fields);
  }

  insert<T extends PgTable>(source: T) {
    return this.db.insert(source);
  }

  update<T extends PgTable>(source: T) {
    return this.db.update(source);
  }

  delete<T extends PgTable>(source: T) {
    return this.db.delete(source);
  }
}
