import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';


import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';

//For creating a better looking website using Angular Materials
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTabsModule} from '@angular/material/tabs';
import {MatDividerModule} from '@angular/material/divider';
import {MatSelectModule} from '@angular/material/select';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatDialogModule} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';

//Login/Register Section
import { UserComponent } from './user/user.component';
import { LoginComponent } from './user/login/login.component';
import { RegisterComponent } from './user/register/register.component';
import { AdministratorComponent } from './user/administrator/administrator.component';

//Main Section of the Website
import { HomeLimitedComponent } from './home-limited/home-limited.component';
import { HomeFullComponent } from './home-full/home-full.component';
import { TokenInterceptor } from './token.interceptor';
import { MatConfirmDialogComponent } from './home-full/mat-confirm-dialog/mat-confirm-dialog.component';

import { appRoutes } from './routes';

//Legal Sections (INCOMPLETE SECTIONS)
import { SecAndPrivComponent } from './policy/sec-and-priv/sec-and-priv.component';
import { AccUsePoliComponent } from './policy/acc-use-poli/acc-use-poli.component';
import { DmcaNotTakPoliComponent } from './policy/dmca-not-tak-poli/dmca-not-tak-poli.component';




@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UserComponent,
    RegisterComponent,
    HomeLimitedComponent,
    HomeFullComponent,
    SecAndPrivComponent,
    AccUsePoliComponent,
    DmcaNotTakPoliComponent,
    AdministratorComponent,
    MatConfirmDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FlexLayoutModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatToolbarModule,
    MatTabsModule,
    MatDividerModule,
    MatSelectModule,
    MatExpansionModule,
    MatSlideToggleModule,
    MatDialogModule,
    MatIconModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }],
  bootstrap: [AppComponent],
  entryComponents:[MatConfirmDialogComponent]
})
export class AppModule { }
