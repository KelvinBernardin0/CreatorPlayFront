export default abstract class HistoryStack<T>{
  abstract save(state: T): void
  abstract undo(): void
}
