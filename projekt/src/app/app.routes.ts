import { Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { LoggedMainComponent } from './logged-main/logged-main.component';

export const routes: Routes = [
    {path: '', component: MainComponent},
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: "logged-main", component: LoggedMainComponent}

];
