import App from './components/App.svelte';
import Gun from '../node_modules/gun/gun';

const app = new App({
	target: document.body
});

window.gun = Gun("ws://192.168.0.176:8000/gun")
