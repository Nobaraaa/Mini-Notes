declare module "pg" {
  export type PoolConfig = {
    connectionString?: string;
    [key: string]: any;
  };

  export class Pool {
    constructor(config?: PoolConfig);
    query(queryText: string, values?: unknown[]): Promise<{ rows: any[] }>;
    end(): Promise<void>;
  }
}
