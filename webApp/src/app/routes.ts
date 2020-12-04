import { Routes } from '@angular/router';
import { HomeFullComponent } from './home-full/home-full.component';
import { HomeLimitedComponent } from './home-limited/home-limited.component';
import { LoginComponent } from './user/login/login.component';
import { RegisterComponent } from './user/register/register.component';
import { UserComponent } from './user/user.component';
export const appRoutes: Routes = [
    { path: 'home-full', component: HomeFullComponent, /*canActivate:[AuthGuard]*/ },
    { path: 'home-limited', component: HomeLimitedComponent},
    {
        path: 'login', component:UserComponent,
        children: [{path: '', component: LoginComponent }]
    },
    {
        path: 'register', component:UserComponent,
        children: [{path: '', component: RegisterComponent }]
    },
    {path: '', redirectTo:'/login', pathMatch: 'full'}
];