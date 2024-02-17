import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { UcenikComponent } from './ucenik/ucenik.component';
import { NastavnikComponent } from './nastavnik/nastavnik.component';
import { AdminComponent } from './admin/admin.component';
import { LoginAdminComponent } from './login-admin/login-admin.component';
import { RegisterComponent } from './registerUcenik/register.component';
import { RegisterNastavnikComponent } from './register-nastavnik/register-nastavnik.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { PocetnaComponent } from './pocetna/pocetna.component';
import { PromenaProfilaComponent } from './promena-profila/promena-profila.component';
import { NastavnikProfilComponent } from './nastavnik-profil/nastavnik-profil.component';
import { CommonModule, DatePipe } from '@angular/common';
import { PromenaProfilaNastavnikComponent } from './promena-profila-nastavnik/promena-profila-nastavnik.component';
import { DosijeComponent } from './dosije/dosije.component';
import { OceniCasComponent } from './oceni-cas/oceni-cas.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UcenikComponent,
    NastavnikComponent,
    AdminComponent,
    LoginAdminComponent,
    RegisterComponent,
    RegisterNastavnikComponent,
    PocetnaComponent,
    PromenaProfilaComponent,
    NastavnikProfilComponent,
    PromenaProfilaNastavnikComponent,
    DosijeComponent,
    OceniCasComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    PdfViewerModule,
    CommonModule
  ],
  providers: [
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
