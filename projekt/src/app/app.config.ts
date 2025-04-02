import { ApplicationConfig } from '@angular/core';

import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideClientHydration } from '@angular/platform-browser';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { MessageService } from 'primeng/api';


//This (provideHttpClient) will help us to resolve the issue 

import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {

	providers: [

		provideRouter(routes),

		provideClientHydration(),
		provideAnimationsAsync(),
		provideHttpClient(),
		provideClientHydration(),
		MessageService,
		providePrimeNG({
			theme: {
				preset: Aura
			}
		})

	]

};