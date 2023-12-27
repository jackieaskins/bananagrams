export default interface BaseModel<T extends Record<string, any>> {
  toJSON(): T;
  reset(): void;
}
