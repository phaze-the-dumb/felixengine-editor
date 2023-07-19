import { RenderObject } from "../../../felix/class/RenderObject";
import { EditorWindow } from "../EditorWindow";
import { WindowController } from "../WindowController";

class GameWindowController extends WindowController {
  renderScreen!: RenderObject;

  render(win: EditorWindow): void {
    win.setHeader("Game");

    let container = document.createElement("div");
    container.className = "game-container";

    this.renderScreen = new RenderObject();
    this.renderScreen.mount(container);

    win.div.appendChild(container);
  }

  ref(): void {
    this.renderScreen.render();
  }
}

export { GameWindowController };