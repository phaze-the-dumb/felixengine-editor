import { EventEmitter } from "./base/EventEmitter";

class Editor extends EventEmitter {
  container: HTMLElement | null;

  constructor(){
    super();
    this.container = null;
  }

  mount( container: HTMLElement ): void {
    this.container = container;

    this.emit('load');
  }
}

export { Editor };