export interface BaseDataRepository<T> {
  retrieveById(id: string): Promise<T | null>;
  retrieveAll(): Promise<T[]>;
  persist(item: T): Promise<T>;
}
