class ContextMenu{
  div: HTMLElement;
  buttons: Array<any>;

  constructor(){
    this.div = document.createElement("div");
    this.div.classList.add("context-menu");

    this.buttons = [];
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

    button.onclick = () => { cb(); };
    this.div.appendChild(button);
  }
}

export { ContextMenu };