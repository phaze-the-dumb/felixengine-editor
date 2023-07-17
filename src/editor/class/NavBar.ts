class NavBar{
  div: HTMLElement;
  tabs: any;

  constructor(){
    this.div = document.createElement("div");
    this.div.classList.add("navbar");

    this.tabs = {
      File: [],
      Edit: [],
      View: [],
    };
  }

  load( container: HTMLElement ){
    Object.keys(this.tabs).forEach(( tab: any ) => {
      let div = document.createElement("div");
      div.innerText = tab;
      div.classList.add('navbutton');

      this.div.appendChild(div);
    });

    container.appendChild( this.div );
  }
}

export { NavBar };