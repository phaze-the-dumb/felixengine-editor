import './style.css'
import { Editor } from './editor/main';
import { sleep } from './editor/util/time';

let editor = new Editor();

editor.on('load', async () => {
  console.log('Loaded editor.');

  document.querySelector<HTMLElement>('.loader')!.style.opacity = '0';
  await sleep(1000);
  document.querySelector<HTMLElement>('.loader')!.remove();
});

editor.mount(document.querySelector('#app')!);