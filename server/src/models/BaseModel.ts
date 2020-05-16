export default interface BaseModel<T extends object> {
  toJSON(): T;
  reset(): void;
}
