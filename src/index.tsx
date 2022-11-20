/* @refresh reload */
import 'modern-css-reset';
import 'src/styles/global/responsive.scss';
import 'src/styles/global/typography.scss';
import 'src/styles/global/main.scss';

import { render } from 'solid-js/web';

import { App } from './App';

render(() => <App />, document.getElementById('app') as HTMLElement);
