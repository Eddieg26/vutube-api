import {createClient, RedisClientOptions, RedisFlushModes} from 'redis';

type Client = ReturnType<typeof createClient>;

export class Redis {
  private client: Client;

  constructor(opts?: RedisClientOptions) {
    this.client = createClient(opts);
  }

  async get<T>(key: string): Promise<T | null> {
    const value = await this.client.get(key);
    if (value) return Promise.resolve(JSON.parse(value));
    else return Promise.resolve(null);
  }

  async set<T>(key: string, value: T): Promise<void> {
    await this.client.set(key, JSON.stringify(value));
  }

  async delete<T>(key: string): Promise<T | null> {
    const value = await this.get<T>(key);
    await this.client.del(key);
    return value;
  }

  async exists(keys: string | string[]): ReturnType<Client['exists']> {
    return this.client.exists(keys);
  }

  async clear(): Promise<void> {
    await this.client.flushAll(RedisFlushModes.ASYNC);
  }

  on(event: string, cb: (...args: any[]) => void) {
    this.client.on(event, cb);
  }

  off(event: string, cb: (...args: any[]) => void) {
    this.client.off(event, cb);
  }

  async connect() {
    await this.client.connect();
  }

  async disconnect() {
    await this.client.disconnect();
  }
}
