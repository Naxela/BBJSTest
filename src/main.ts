import { NAXApp as App } from './NAXApp';

window.addEventListener('DOMContentLoaded', () => {
    let canvas = document.getElementById('renderCanvas') as HTMLCanvasElement;
    new App(canvas, 'assets/project.nx');
});