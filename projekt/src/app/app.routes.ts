import { Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { LoggedMainComponent } from './logged-main/logged-main.component';
import { NewDrawingComponent } from './new-drawing/new-drawing.component';
import { ProfilComponent } from './profil/profil.component';
import { GalleryComponent } from './gallery/gallery.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { NewPassComponent } from './new-pass/new-pass.component';
import { CheckProfileComponent } from './check-profile/check-profile.component';
import { CommentsComponent } from './comments/comments.component';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'guest', component: MainComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: "logged-main", component: LoggedMainComponent },
    { path: 'new-drawing', component: NewDrawingComponent },
    { path: 'profil', component: ProfilComponent },
    { path: 'gallery', component: GalleryComponent },
    { path: 'forgot-password', component: ForgotPasswordComponent },
    { path: 'new-pass', component: NewPassComponent },
    { path: 'checkProfile/:id', component: CheckProfileComponent },
    { path: 'comments/:id', component: CommentsComponent },
];
