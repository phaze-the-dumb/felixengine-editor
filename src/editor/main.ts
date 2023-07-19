import { EventEmitter } from "../felix/base/EventEmitter";
import { EditorWindow } from "./class/EditorWindow";
import { EditorConfig } from "./class/EditorConfig";
import { NavBar } from "./class/NavBar";
import { ContextMenu } from "./class/ContextMenu";
import { FelixScene } from "../felix/main";

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
  scenes: Array<FelixScene>;
  currentScene: FelixScene | null;

  constructor(){
    super();

    this.container = null;
    this.windows = [];
    this.scenes = [];
    this.ctxMenu = new ContextMenu(mouse);
    this.nav = new NavBar(this.ctxMenu);
    this.config = EditorConfig.tryGetConfig(this);

    this.currentScene = null;

    this.update();
  }

  mount( container: HTMLElement ): void {
    this.container = container;

    this.config.load();
    this.nav.load(container);
    this.ctxMenu.load(container);

    if(this.scenes.length === 0)
      this.scenes.push(new FelixScene());

    this.selectScene(this.scenes[0]);
    this.ctxMenu.setActive(false);
    this.emit('load');
  }

  selectScene( scene: FelixScene ): void {
    this.currentScene = scene;

    if(!this.scenes.find(x => x === scene))
      this.scenes.push(scene);

    this.windows.forEach(win => {
      win.setScene(scene);
    })
  }

  update(): void {
    this.ctxMenu.updateMouse(mouse.x, mouse.y);
    this.windows.forEach(win => {
      if(win.controller.init)
        win.ref()
    });

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