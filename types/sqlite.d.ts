declare module 'sqlite' {
  export interface Database {
    all: <T = any>(sql: string, ...params: any[]) => Promise<T[]>;
    get: <T = any>(sql: string, ...params: any[]) => Promise<T | undefined>;
    run: (sql: string, ...params: any[]) => Promise<any>;
    exec: (sql: string) => Promise<void>;
    close: () => Promise<void>;
  }

  export function open(config: {
    filename: string;
    driver: any;
  }): Promise<Database>;
} 