import { EventEmitter } from "./base/EventEmitter";
import { EditorWindow } from "./class/EditorWindow";
import { EditorConfig } from "./class/EditorConfig";
import { NavBar } from "./class/NavBar";
import { ContextMenu } from "./class/ContextMenu";

let mouse: any = {
  x: 0,
  y: 0,
  down: false
}

class Editor extends EventEmitter {
  container: HTMLElement | null;
  windows: Array<EditorWindow>;
  config: EditorConfig;
  nav: NavBar;
  ctxMenu: ContextMenu;

  constructor(){
    super();

    this.container = null;
    this.windows = [];
    this.ctxMenu = new ContextMenu(mouse);
    this.nav = new NavBar(this.ctxMenu);
    this.config = EditorConfig.tryGetConfig(this);

    this.update();
  }

  mount( container: HTMLElement ): void {
    this.container = container;

    this.config.load();
    this.nav.load(container);
    this.ctxMenu.load(container);

    this.ctxMenu.setActive(false);
    this.emit('load');
  }

  update(): void {
    this.ctxMenu.updateMouse(mouse.x, mouse.y);

    requestAnimationFrame(() => this.update());
  }
}

window.addEventListener('mousemove', ( e ) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

window.addEventListener('mousedown', () => mouse.down = true);
window.addEventListener('mouseup', () => mouse.down = false);

export { Editor };