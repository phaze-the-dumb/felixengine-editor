import { EditorWindow } from "../EditorWindow";
import { WindowController } from "../WindowController";
import { GameObject } from "../../../felix/class/GameObject";

let selectedElement: HTMLElement | null = null;
let selectedChild: HierarchyObject | null = null;
let mouseOverSelected: boolean = false;

class HierarchyObject{
  name: string;
  children: Array<HierarchyObject> = [];
  id: string;
  obj: GameObject;
  childrenCount: number = 0;
  mouseOver: boolean = false;

  constructor(obj: GameObject){
    this.name = obj.name;
    this.id = obj.id;
    this.obj = obj;

    obj.children.forEach(child =>
      this.children.push(new HierarchyObject(child)));
  }

  render( container: HTMLElement ): void {
    let childContainer = document.createElement("div");
    childContainer.classList.add("hierarchy-object");

    childContainer.addEventListener('mouseover', () => this.mouseOver = true);
    childContainer.addEventListener('mouseleave', () => this.mouseOver = false);

    let name = document.createElement("div");
    name.innerHTML = this.name;

    childContainer.appendChild(name);

    this.children.forEach(obj =>
      obj.render(childContainer));

    container.appendChild(childContainer);

    if(selectedChild && this.id === selectedChild.id){
      childContainer.classList.add("hierarchy-selected");
      selectedElement = childContainer;
      selectedChild = this;
      
      selectedElement.onmouseover = () => mouseOverSelected = true;
      selectedElement.onmouseleave = () => mouseOverSelected = false;
    }

    name.addEventListener('click', () => {
      if(selectedElement){
        selectedElement.classList.remove("hierarchy-selected");

        selectedElement.onmouseover = () => {};
        selectedElement.onmouseleave = () => {};
      }

      childContainer.classList.add("hierarchy-selected");

      mouseOverSelected = true;
      selectedElement = childContainer;
      selectedChild = this;

      selectedElement.onmouseover = () => mouseOverSelected = true;
      selectedElement.onmouseleave = () => mouseOverSelected = false;
    })

    name.addEventListener('dblclick', () => {
      let nameInput = document.createElement("input");
      nameInput.classList.add('go-name-input');
      nameInput.value = this.name;

      name.innerHTML = '';
      name.appendChild(nameInput);

      nameInput.addEventListener('change', () => {
        this.name = nameInput.value;
        name.innerHTML = this.name;
      });

      nameInput.addEventListener('keydown', ( e: KeyboardEvent ) => {
        if(e.key === 'Enter'){
          this.name = nameInput.value;
          name.innerHTML = this.name;
        } else if(e.key === 'Escape'){
          this.name = nameInput.value;
          name.innerHTML = this.name;
        }
      });
    });
  }

  update( go: GameObject ): void {
    go.children.forEach(child => {
      let obj = this.children.find(x => x.id === child.id);

      if(!obj)
        this.children.push(new HierarchyObject(child));
      else if(obj.childrenCount !== child.childrenCount)
        obj.update(child);
      else if(obj.name !== child.name)
        obj.name = child.name;
    });

    this.children.forEach(child => {
      let obj = go.children.find(x => x.id === child.id);

      if(!obj)
        this.children = this.children.filter(x => x.id !== child.id);
    })

    this.childrenCount = go.childrenCount;
  }
}

class HierachyWindowController extends WindowController {
  objectList: Array<HierarchyObject> = [];
  container: HTMLElement = document.createElement("div");

  render(win: EditorWindow): void {
    win.setHeader('Hierarchy');
    win.div.appendChild(this.container);

    this.container.classList.add('hierarchy-container');

    win.contextMenu.push({ name: 'Paste', cb: () => {
      console.log('Paste Clipboard');
    } });
    
    win.contextMenu.push({ name: 'Copy', cb: () => {
      console.log('Copy Selection');
    } });

    win.contextMenu.push({ name: '--- Add Object ---', cb: () => {} });

    win.contextMenu.push({ name: 'Empty', cb: () => {
      if(selectedElement && selectedChild){
        selectedChild.obj.createEmptyChild('Empty GameObject');
      } else
        win.scene.createEmptyChild('Empty GameObject');
  
      win.update();
    } });

    win.contextMenu.push({ name: 'Add Camera', cb: () => {
      if(selectedElement && selectedChild){
        selectedChild.obj.createEmptyChild('Camera');
      } else
        win.scene.createEmptyChild('Camera');
      
      win.update();
    } });

    win.contextMenu.push({ name: 'Sprite', cb: () => {
      if(selectedElement && selectedChild){
        selectedChild.obj.createEmptyChild('New Sprite');
      } else
        win.scene.createEmptyChild('New Sprite');
      
      win.update();
    } });
    
    win.contextMenu.push({ name: 'Tile Map', cb: () => {
      if(selectedElement && selectedChild){
        selectedChild.obj.createEmptyChild('New Tile Map');
      } else
        win.scene.createEmptyChild('New Tile Map');
      
      win.update();
    } });

    document.addEventListener('keydown', ( e: KeyboardEvent ) => {
      if(e.key === 'Delete' && selectedChild){
        selectedChild.obj.remove();
        win.update();

        selectedChild = null;
        selectedElement = null;
      }
    });

    win.div.addEventListener('click', () => {
      setTimeout(() => {
        if(!mouseOverSelected && selectedElement){
          selectedElement.classList.remove("hierarchy-selected");
  
          selectedElement.onmouseover = () => {};
          selectedElement.onmouseleave = () => {};

          selectedChild = null;
          selectedElement = null;
        }
      }, 50)
    });
  }

  renderObjectList(): void {
    this.container.innerHTML = '';

    this.objectList.forEach(obj =>
      obj.render(this.container));
  }

  update(win: EditorWindow): void {
    win.setHeader('Hierarchy: '+win.scene.name);

    win.scene.children.forEach(child => {
      let obj = this.objectList.find(x => x.id === child.id);
      
      if(!obj)
        this.objectList.push(new HierarchyObject(child))
      else if(obj.childrenCount !== child.childrenCount)
        obj.update(child);
      else if(obj.name !== child.name)
        obj.name = child.name;
    });

    this.objectList.forEach(child => {
      let obj = win.scene.children.find(x => x.id === child.id);

      if(!obj)
        this.objectList = this.objectList.filter(x => x.id !== child.id);
    });

    this.renderObjectList();
  }
}

export { HierachyWindowController };