import { ContextMenu } from "./ContextMenu";
import { FelixScene } from "../../felix/main";
import { WindowController } from "./WindowController";

import { HierachyWindowController } from "./WindowControllers/HierachyWindowController";

enum WindowType{
  HIERARCHY, INSPECTOR, UNKNOWN,
  GAME, SCENE
}

enum WindowTheme{
  DARK
}

class EditorWindowTransform{
  x: number = 0;
  y: number = 0;
  width: number = 0;
  height: number = 0;
  win: EditorWindow;

  constructor( win: EditorWindow ){
    this.win = win;
    win.div.style.position = 'absolute';

    win.div.style.top = (((this.y / 100) * window.innerHeight) + (20 * ((this.y / -100) + 1))) + 'px';
    win.div.style.left = ((this.x / 100) * window.innerWidth) + 'px';

    win.div.style.height = ((this.height / 100) * (window.innerHeight - (20 * (this.height / 100)))) + 'px';
    win.div.style.width = ((this.width / 100) * window.innerWidth) + 'px';

    window.addEventListener('resize', () => {
      win.div.style.top = (((this.y / 100) * window.innerHeight) + (20 * ((this.y / -100) + 1))) + 'px';
      win.div.style.left = ((this.x / 100) * window.innerWidth) + 'px';
  
      win.div.style.height = ((this.height / 100) * window.innerHeight - (20 * (this.height / 100))) + 'px';
      win.div.style.width = ((this.width / 100) * window.innerWidth) + 'px';
    });
  }

  update(){
    this.win.div.style.top = (((this.y / 100) * window.innerHeight) + (20 * ((this.y / -100) + 1))) + 'px';
    this.win.div.style.left = ((this.x / 100) * window.innerWidth) + 'px';

    this.win.div.style.height = ((this.height / 100) * window.innerHeight - (20 * (this.height / 100))) + 'px';
    this.win.div.style.width = ((this.width / 100) * window.innerWidth) + 'px';
  }
}

class EditorWindow{
  container: HTMLElement;
  type: WindowType;
  theme: WindowTheme;
  div: HTMLElement;
  setupWin: Function | undefined;
  transform: EditorWindowTransform;
  header: HTMLElement;
  contextMenu: Array<{ name: string, cb: Function }>;
  menu: ContextMenu;
  scene: FelixScene;
  controller: WindowController;

  constructor( aContainer: HTMLElement, aType: WindowType, aTheme: WindowTheme, menu: ContextMenu, scene: FelixScene ){
    this.container = aContainer;
    this.type = aType;
    this.theme = aTheme;
    this.div = document.createElement('div');
    this.transform = new EditorWindowTransform(this);
    this.contextMenu = [];
    this.menu = menu;
    this.scene = scene;

    switch(this.type){
      case WindowType.HIERARCHY:
        this.controller = new HierachyWindowController();
        break;

      default:
        this.controller = new WindowController();
        break;
    }

    this.header = document.createElement('div');
    this.header.innerHTML = 'Unknown';
    this.header.className = 'window-header';

    this.div.appendChild(this.header);

    this.container.appendChild( this.div );
    this.div.classList.add('editor-window');

    switch( this.theme ){
      case WindowTheme.DARK:
        this.div.classList.add('window-darktheme');
        break;
    }

    if(this.type == WindowType.UNKNOWN && this.setupWin)
      this.setupWin();
    else
      this.render();

    this.div.addEventListener('contextmenu', ( e: Event ) => {
      e.preventDefault();

      if(this.contextMenu.length > 0){
        this.contextMenu.forEach(( a: { name: string, cb: Function } ) =>
          menu.addButton(a.name, a.cb));

        menu.setActive(true);
      }
    });

    this.div.onmousedown = () => {
      if(this.menu.lockPosition){
        this.menu.setActive(false);
      }
    }
  }

  setHeader( header: string ): void {
    this.header.innerHTML = header;
  }
  
  setPosition(x: number, y: number): void {
    this.transform.x = x;
    this.transform.y = y;
    this.transform.update();
  }

  setSize(width: number, height: number): void {
    this.transform.width = width;
    this.transform.height = height;
    this.transform.update();
  }

  setScene( scene: FelixScene ): void {
    this.scene = scene;
    this.update();
  }

  render(): void {
    this.controller.render(this);
  }

  update(){
    this.controller.update(this);
  }
}

export { EditorWindow, WindowType, WindowTheme };