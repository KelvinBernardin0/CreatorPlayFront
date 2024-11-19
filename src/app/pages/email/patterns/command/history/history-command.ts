export default abstract class HistoryCommand<T>{
  abstract save(state: T): void
  abstract undo(): void
}
