import { render } from 'preact';
import Router from './initialization/Router';
import './main.css';

render(
  <Router />,
  // @ts-ignore
  document.getElementById('app')
);
