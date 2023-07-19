import { ContextMenu } from "./ContextMenu";
import { FelixScene } from "../../felix/main";
import { WindowController } from "./WindowController";

import { Editor } from "../main";

import { HierachyWindowController } from "./WindowControllers/HierachyWindowController";
import { GameWindowController } from "./WindowControllers/GameWindowController";
import { InspectorWindowController } from "./WindowControllers/InspectorWindowController";

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
  editor: Editor;

  constructor( editor: Editor, type: WindowType, theme: WindowTheme ){
    this.container = editor.container!;
    this.type = type;
    this.theme = theme;
    this.div = document.createElement('div');
    this.transform = new EditorWindowTransform(this);
    this.contextMenu = [];
    this.menu = editor.ctxMenu;
    this.scene = editor.currentScene!;
    this.editor = editor;

    switch(this.type){
      case WindowType.HIERARCHY:
        this.controller = new HierachyWindowController();
        break;
      case WindowType.GAME:
        this.controller = new GameWindowController();
        break;
      case WindowType.INSPECTOR:
        this.controller = new InspectorWindowController();
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
    else{
      setTimeout(() => {
        this.render();
        this.controller.init = true;
      }, 10);
    }

    this.div.addEventListener('contextmenu', ( e: Event ) => {
      e.preventDefault();

      if(this.contextMenu.length > 0){
        this.contextMenu.forEach(( a: { name: string, cb: Function } ) =>
          this.menu.addButton(a.name, a.cb));

        this.menu.setActive(true);
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

  update(): void {
    this.controller.update(this);
  }

  ref(): void {
    this.controller.ref();
  }
}

export { EditorWindow, WindowType, WindowTheme };