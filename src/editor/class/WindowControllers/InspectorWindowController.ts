import { EditorWindow } from "../EditorWindow";
import { WindowController } from "../WindowController";

import { GameObject } from "../../../felix/class/GameObject";
import { Component } from "../../../felix/class/GameObject/Component";

let colours: any = {
  'Camera': '#c5ffc3'
};

class InspectorComponent{
  div: HTMLElement;
  component: Component;
  content: HTMLElement;

  constructor( component: Component ){
    this.div = document.createElement("div");
    this.component = component;

    this.div.classList.add("inspector-component");
    this.div.style.borderLeft = (colours[this.component.name] || '#ffc3c3') + ' 2px solid';

    let header = document.createElement("div");
    header.classList.add("inspector-component-header");
    header.innerHTML = component.name;

    this.content = document.createElement("div");
    this.content.style.textAlign = 'left';
    this.content.style.marginLeft = '5px';
    this.content.innerHTML = 'fuck';

    this.div.appendChild(header);
    this.div.appendChild(this.content);

    console.log(Object.keys(component.definePublicValues));
  }
}

class InspectorWindowController extends WindowController {
  content!: HTMLElement;

  render( win: EditorWindow ): void {
    win.setHeader('Inspector');

    this.content = document.createElement('div');
    this.content.classList.add('inspector-content');

    win.div.appendChild(this.content);
  }

  displayObject( go: GameObject | null ): void {
    if(!go){
      this.content.innerHTML = 'Nothing Selected in Hierarchy.';
      return;
    }

    console.log(go);
    this.content.innerHTML = '<span class="inspector-title">'+go.name+'</span>';

    go.components.forEach(component => {
      let co = new InspectorComponent(component);
      this.content.appendChild(co.div);
    })
  }
}

export { InspectorWindowController };