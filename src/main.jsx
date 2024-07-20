import { render } from 'preact';
import App from './App';
import './main.css';

render(
  <App />,
  // @ts-ignore
  document.getElementById('app'),
);
