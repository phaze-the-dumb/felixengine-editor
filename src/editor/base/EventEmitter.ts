class EventEmitter{
  events: any = {};

  emit( event: string, ...args: any[] ): void {
    if(!this.events[event])
      this.events[event] = [];

    this.events[event].forEach(( e: Function ) => e(...args));
  }

  on( event: string, cb: Function ): void {
    if(!this.events[event])
      this.events[event] = [];

    this.events[event].push(cb);
  }

  removeAllEvents(): void {
    this.events = {};
  }

  removeEvent( event: string ): void {
    this.events[event] = [];
  }
}

export { EventEmitter };