import './polyfills';

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { PopupModule } from './pages/popup';
import { environment } from './environments/environmentProduct';

if (environment.production) {
	enableProdMode();
}

platformBrowserDynamic()
	.bootstrapModule(PopupModule)
	.then((ref)=>{
		if (window['ngRef']) {
			window['ngRef'].destroy();
		}
		window['ngRef'] = ref;
	})
	.catch(err => console.error(err));
