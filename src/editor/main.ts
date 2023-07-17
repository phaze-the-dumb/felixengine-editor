import { EventEmitter } from "./base/EventEmitter";
import { EditorWindow } from "./class/EditorWindow";
import { EditorConfig } from "./class/EditorConfig";
import { NavBar } from "./class/NavBar";
import { ContextMenu } from "./class/ContextMenu";

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
    this.nav = new NavBar();
    this.ctxMenu = new ContextMenu();
    this.config = EditorConfig.tryGetConfig(this);
  }

  mount( container: HTMLElement ): void {
    this.container = container;

    this.config.load();
    this.nav.load(container);
    this.ctxMenu.load(container);

    this.emit('load');
  }
}

export { Editor };