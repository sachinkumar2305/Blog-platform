declare module '@vercel/postgres' {
  interface SqlResponse<T = unknown> {
    rows: T[];
  }

  interface SqlQueryConfig {
    text: string;
    values?: any[];
  }

  export interface VercelPoolClient {
    query<T = any>(query: string | SqlQueryConfig): Promise<SqlResponse<T>>;
  }

  export const sql: {
    <T = any>(strings: TemplateStringsArray, ...values: any[]): Promise<SqlResponse<T>>;
    begin(): Promise<void>;
    commit(): Promise<void>;
    rollback(): Promise<void>;
  };
}