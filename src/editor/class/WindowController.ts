import { EditorWindow } from "./EditorWindow";

class WindowController{
  init: boolean = false;

  render( window: EditorWindow ): void {};
  update( window: EditorWindow ): void {};
  ref(): void {};
}

export { WindowController };