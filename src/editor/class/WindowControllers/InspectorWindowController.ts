import { EditorWindow } from "../EditorWindow";
import { WindowController } from "../WindowController";

import { GameObject } from "../../../felix/class/GameObject";
import { Component } from "../../../felix/class/GameObject/Component";

let colours: any = {
  'Camera': '#c5ffc3',
  'Bounding Box': '#6cd8fc',
  'Sprite': '#ee6cfc'
};

let hasShift = false;

window.addEventListener("keydown", ( e: KeyboardEvent ) => {
  if(e.key === 'Shift')
    hasShift = true;
});

window.addEventListener("keyup", ( e: KeyboardEvent ) => {
  if(e.key === 'Shift')
    hasShift = false;
});

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
    this.content.innerHTML = '';

    this.div.appendChild(header);
    this.div.appendChild(this.content);

    Object.keys(component.definePublicValues).forEach(key => {
      let type = component.definePublicValues[key];

      let div = document.createElement("div");
      let divName = document.createElement("span");

      div.className = "inspector-component-value";

      let splitKey = key.split('');
      splitKey[0] = splitKey[0].toUpperCase();

      splitKey.forEach(( value, i ) => {
        if(value == value.toUpperCase()){
          splitKey[i] = ' ' + value;
        }
      });

      divName.innerHTML = splitKey.join('');
      div.appendChild(divName);

      if(type == 'Position'){
        let xInput = document.createElement("input");
        let yInput = document.createElement("input");

        xInput.className = "small-inspector-input";
        yInput.className = "small-inspector-input";

        let x: number = (component as any)[key].x;
        let y: number = (component as any)[key].y;

        xInput.value = x.toFixed(6);
        yInput.value = y.toFixed(6);

        xInput.onwheel = ( e: WheelEvent ) => {
          if(e.deltaY < 0)
            x = x + (hasShift ? 0.1 : 1);
          else
            x = x - (hasShift ? 0.1 : 1);

          xInput.value = x.toFixed(6);
          (component as any)[key].x = x;
        }

        yInput.onwheel = ( e: WheelEvent ) => {
          if(e.deltaY < 0)
            y = y + (hasShift ? 0.1 : 1);
          else
            y = y - (hasShift ? 0.1 : 1);

          yInput.value = y.toFixed(6);
          (component as any)[key].y = y;
        }

        xInput.onchange = () => {
          x = parseFloat(xInput.value);
          (component as any)[key].x = x;
        }

        yInput.onchange = () => {
          y = parseFloat(yInput.value);
          (component as any)[key].y = y;
        }

        let container = document.createElement("div");
        container.className = 'inspector-values';

        container.appendChild(xInput);
        container.appendChild(yInput);

        div.appendChild(container);
      } else if(type === 'Rotation'){
        let xInput = document.createElement("input");

        let x = (component as any)[key].x;

        xInput.className = "small-inspector-input";
        xInput.value = x.toFixed(6);

        xInput.onwheel = ( e: WheelEvent ) => {
          if(e.deltaY < 0)
            x = x + (hasShift ? 0.1 : 1);
          else
            x = x - (hasShift ? 0.1 : 1);

          xInput.value = x.toFixed(6);
          (component as any)[key].x = x;
        }

        xInput.onchange = () => {
          x = parseFloat(xInput.value);
          (component as any)[key].x = x;
        }

        let container = document.createElement("div");
        container.className = 'inspector-values';

        container.appendChild(xInput);
        div.appendChild(container);
      } else if(type === 'Number'){
        let xInput = document.createElement("input");

        let x = (component as any)[key];

        xInput.className = "small-inspector-input";
        xInput.value = x.toFixed(6);

        xInput.onwheel = ( e: WheelEvent ) => {
          if(e.deltaY < 0)
            x = x + (hasShift ? 0.1 : 1);
          else
            x = x - (hasShift ? 0.1 : 1);

          xInput.value = x.toFixed(6);
          (component as any)[key] = x;
        }

        xInput.onchange = () => {
          x = parseFloat(xInput.value);
          (component as any)[key] = x;
        }

        let container = document.createElement("div");
        container.className = 'inspector-values';

        container.appendChild(xInput);
        div.appendChild(container);
      } else if(type === 'Colour'){
        let input = document.createElement("input");
        input.type = 'color';

        let c = (component as any)[key];
        input.value = `#${(c.r * 255).toString(16).padStart(2, '0')}${(c.g * 255).toString(16).padStart(2, '0')}${(c.b * 255).toString(16).padStart(2, '0')}`;

        input.onchange = () => {
          c.r = parseInt(input.value.slice(1, 3), 16) / 255;
          c.g = parseInt(input.value.slice(3, 5), 16) / 255;
          c.b = parseInt(input.value.slice(5, 7), 16) / 255;
        }

        let container = document.createElement("div");
        container.className = 'inspector-values';

        container.appendChild(input);
        div.appendChild(container);
      }

      this.content.appendChild(div);
    })
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

    this.content.innerHTML = '<span class="inspector-title">'+go.name+'</span>';

    go.components.forEach(component => {
      let co = new InspectorComponent(component);
      this.content.appendChild(co.div);
    })
  }
}

export { InspectorWindowController };