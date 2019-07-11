import App from './components/App.svelte';
import Gun from '../node_modules/gun/gun';

const app = new App({
	target: document.body
});

window.gun = Gun("ws://localhost:8000/gun")
