import { Routes } from '@angular/router';
import { HomeFullComponent } from './home-full/home-full.component';
import { HomeLimitedComponent } from './home-limited/home-limited.component';
import { AccUsePoliComponent } from './policy/acc-use-poli/acc-use-poli.component';
import { DmcaNotTakPoliComponent } from './policy/dmca-not-tak-poli/dmca-not-tak-poli.component';
import { SecAndPrivComponent } from './policy/sec-and-priv/sec-and-priv.component';
import { LoginComponent } from './user/login/login.component';
import { RegisterComponent } from './user/register/register.component';
import { UserComponent } from './user/user.component';
import { AuthGuardService as AuthGuard } from './auth-guard.service';
import { AdministratorComponent } from './user/administrator/administrator.component';


/*
Format for creating routes
https://www.youtube.com/watch?v=e8BlURn6SFk
*/
//List of routes that exist on the client side that a user can go through
export const appRoutes: Routes = [
    { path: 'home-full', component: HomeFullComponent/*, canActivate:[AuthGuard]*/ },
    { path: 'home-limited', component: HomeLimitedComponent},
    {
        path: 'login', component:UserComponent,
        children: [{path: '', component: LoginComponent }]
    },
    {
        path: 'register', component:UserComponent,
        children: [{path: '', component: RegisterComponent }]
    },
    {
        path: 'administrator', component:UserComponent,
        children: [{path: '', component: AdministratorComponent}]
    },
    {path: '', redirectTo:'/login', pathMatch: 'full'},
    { path: 'acc-use-poli', component: AccUsePoliComponent },
    { path: 'dcma-not-tak-poli', component: DmcaNotTakPoliComponent },
    { path: 'sec-and-priv', component: SecAndPrivComponent },
];