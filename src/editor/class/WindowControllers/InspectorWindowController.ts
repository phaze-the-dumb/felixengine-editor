import { EditorWindow } from "../EditorWindow";
import { WindowController } from "../WindowController";

import { GameObject } from "../../../felix/class/GameObject";
import { Component } from "../../../felix/class/GameObject/Component";

class InspectorComponent{
  div: HTMLElement;
  component: Component;

  constructor( component: Component ){
    this.div = document.createElement("div");
    this.component = component;

    this.div.classList.add("inspector-component");
    this.div.style.borderLeft = this.component.colour + ' 2px solid';

    let header = document.createElement("div");
    header.classList.add("inspector-component-header");
    header.innerHTML = component.name;

    this.div.appendChild(header);
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