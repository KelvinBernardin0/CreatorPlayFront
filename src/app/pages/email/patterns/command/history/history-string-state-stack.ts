import {StringState} from "../../../../../common/types/State";
import {EditorMediator} from "../../mediator/editor_mediator";
import HistoryStack from "./history-stack";



export default class HistoryStringStateStack extends HistoryStack<StringState> {

  private state: StringState[] = []

  constructor(
    private mediator: EditorMediator
  ){
    super()
  }

  public override save(state: StringState): void {
    if(this.isSameState(state))
      return

    this.state.push(state);
  }

  public override undo(): void {
    if (this.state.length <= 0)
      return;
    const state = this.state.pop()
    this.mediator.updateEditorState(state!);
    return
  }

  private isSameState(state: StringState): boolean{
    const prevState = this.state.at(-1)
    if (!prevState)
      return false
    return (
      prevState.header === state.header &&
      prevState.content === state.content &&
      prevState.footer === state.footer
    )
  }

}
