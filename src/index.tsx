/* @refresh reload */
import { render } from 'solid-js/web';

import 'modern-css-reset';
import 'src/styles/global/main.scss';
import 'src/styles/global/responsive.scss';
import 'src/styles/global/typography.scss';

import { App } from './App';

render(() => <App />, document.getElementById('app') as HTMLElement);
