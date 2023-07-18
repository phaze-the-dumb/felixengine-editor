import { WindowType, EditorWindow, WindowTheme } from "./EditorWindow";
import { Editor } from "../main";

class ConfigWindow{
  x!: number;
  y!: number;
  width!: number;
  height!: number;
  type!: WindowType;
  theme!: WindowTheme;
}

class EditorConfig{
  windows: Array<ConfigWindow>;
  editor: Editor;

  constructor( editor: Editor ){
    this.windows = [];
    this.editor = editor;

    this.addWindow(0, 0, 20, 100, WindowType.HIERARCHY, WindowTheme.DARK);
    this.addWindow(75, 0, 25, 100, WindowType.INSPECTOR, WindowTheme.DARK);
    this.addWindow(20, 0, 55, 50, WindowType.GAME, WindowTheme.DARK);
    this.addWindow(20, 50, 55, 50, WindowType.SCENE, WindowTheme.DARK);
  }

  addWindow(x: number, y: number, width: number, height: number, type: WindowType, theme: WindowTheme): ConfigWindow {
    let win = new ConfigWindow();

    win.x = x;
    win.y = y;
    win.width = width;
    win.height = height;
    win.type = type;
    win.theme = theme;

    this.windows.push(win);
    return win;
  }

  fromJson( json: any ): void {
    this.windows = [];

    json.windows.forEach(( win: any ) => {
      let w = new ConfigWindow();

      w.x = win.x;
      w.y = win.y;
      w.width = win.width;
      w.height = win.height;
      w.type = win.type;
      w.theme = win.theme;

      this.windows.push( w );
    })
  }

  toJson(): any {
    let json: any = {
      windows: []
    }

    this.windows.forEach(w => {
      json.windows.push({
        x: w.x,
        y: w.y,
        width: w.width,
        height: w.height,
        type: w.type,
        theme: w.theme
      })
    })

    return json;
  }

  save(): void {
    console.log(this.toJson());
    localStorage.setItem('config', JSON.stringify(this.toJson()));
  }

  load(): void {
    this.windows.forEach(w => {
      let win = new EditorWindow(this.editor.container!, w.type, w.theme, this.editor.ctxMenu, this.editor.currentScene!);

      win.setPosition(w.x, w.y);
      win.setSize(w.width, w.height);

      this.editor.windows.push(win);
    })
  }

  static tryGetConfig( editor: Editor ): EditorConfig {
    try{
      if(localStorage.getItem('config')){
        let jsonConfig = JSON.parse(localStorage.getItem('config')!);
        let config = new EditorConfig(editor);

        config.fromJson(jsonConfig);
        return config;
      } else{
        let config = new EditorConfig(editor);
        return config;
      }
    } catch(e){
      let config = new EditorConfig(editor);
      return config;
    }
  }
}

export { EditorConfig };