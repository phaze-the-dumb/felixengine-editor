let pageSize = {
  width: window.innerWidth,
  height: window.innerHeight
}

window.addEventListener('resize', () => {
  pageSize.width = window.innerWidth;
  pageSize.height = window.innerHeight;
});

class ContextMenu{
  div: HTMLElement;
  buttons: Array<any>;

  isMouseOver: boolean = false;
  closeOnMouseLeave: boolean = false;
  lockPosition: boolean = false;

  mouse: { x: number, y: number, down: boolean };
  menuSize: { width: number, height: number };

  constructor( mouse: { x: number, y: number, down: boolean }){
    this.div = document.createElement("div");
    this.div.classList.add("context-menu");
    this.menuSize = { width: this.div.clientWidth, height: this.div.clientHeight };

    this.buttons = [];
    this.mouse = mouse;

    this.div.onmouseenter = () => this.isMouseOver = true;
    this.div.onmouseleave = () => {
      this.isMouseOver = false;

      if(this.closeOnMouseLeave){
        this.div.style.display = "none";
        this.closeOnMouseLeave = false;
        this.lockPosition = false;

        this.reset();
      }
    }
  }

  setActive( active: boolean ): void {
    if(active){
      this.div.style.display = "block";
      this.lockPosition = true;

      let rect = this.div.getBoundingClientRect();
      this.menuSize = { width: rect.width, height: rect.height };

      this.update(this.mouse.x, this.mouse.y);
    } else {
      if(this.isMouseOver)
        this.closeOnMouseLeave = true;
      else {
        this.div.style.display = "none";
        this.lockPosition = false;

        this.reset();
      }
    }
  }

  load( container: HTMLElement ): void {
    container.appendChild(this.div);
  }

  reset(): void {
    this.buttons.forEach(btn => btn.remove());
    this.buttons = [];
  }

  addButton( text: string, cb: Function ): void {
    let button = document.createElement("div");
    button.classList.add("context-menu-button");
    button.innerHTML = text;

    button.onclick = () => {
      cb();

      this.div.style.display = "none";
      this.closeOnMouseLeave = false;
      this.lockPosition = false;

      this.reset();
    };
    this.div.appendChild(button);
    this.buttons.push(button);
  }

  update( mouseX: number, mouseY: number ): void {
    this.div.style.left = mouseX + "px";

    if(mouseY + this.menuSize.height > pageSize.height)
      this.div.style.top = (mouseY - this.menuSize.height) + "px";
    else
      this.div.style.top = mouseY + "px";

    if(mouseX + this.menuSize.width > pageSize.width)
      this.div.style.left = (mouseX - this.menuSize.width) + "px";
    else
      this.div.style.left = mouseX + "px";
  }

  updateMouse( mouseX: number, mouseY: number ): void {
    this.mouse.x = mouseX;
    this.mouse.y = mouseY;
  }
}

export { ContextMenu };