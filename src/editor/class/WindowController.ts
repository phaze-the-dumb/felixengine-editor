import { EditorWindow } from "./EditorWindow";
import { Editor } from '../main';

class WindowController{
  init: boolean = false;

  render( _window: EditorWindow, _editor: Editor ): void {};
  update( _window: EditorWindow, _editor: Editor ): void {};
  ref(): void {};
}

export { WindowController };