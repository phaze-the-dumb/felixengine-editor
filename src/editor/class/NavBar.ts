import { ContextMenu } from "./ContextMenu";

class NavBar{
  div: HTMLElement;
  tabs: any;
  menu: ContextMenu;

  constructor( ctxMenu: ContextMenu ){
    this.div = document.createElement("div");
    this.div.classList.add("navbar");
    this.menu = ctxMenu;

    this.tabs = {
      File: [ 'Save' ],
      Edit: [ 'Project Settings' ]
    };
  }

  buttonPress(tab: string, btn: string): void {
    console.log(tab, btn);
  }

  load( container: HTMLElement ){
    Object.keys(this.tabs).forEach(( tab: any ) => {
      let div = document.createElement("div");
      div.innerText = tab;
      div.classList.add('navbutton');

      div.onclick = () => {
        this.menu.reset();

        this.tabs[tab].forEach((btn: any) => {
          this.menu.addButton(btn, () => {
            this.buttonPress(tab, btn);
          });
        })

        this.menu.setActive(true);
      }

      div.onmouseleave = () => {
        setTimeout(() => {
          this.menu.setActive(false);
        }, 100);
      }

      this.div.appendChild(div);
    });

    container.appendChild( this.div );
  }
}

export { NavBar };