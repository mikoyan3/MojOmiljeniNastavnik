import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { UcenikComponent } from './ucenik/ucenik.component';
import { NastavnikComponent } from './nastavnik/nastavnik.component';
import { LoginAdminComponent } from './login-admin/login-admin.component';
import { RegisterComponent } from './registerUcenik/register.component';
import { RegisterNastavnikComponent } from './register-nastavnik/register-nastavnik.component';
import { AdminComponent } from './admin/admin.component';
import { PocetnaComponent } from './pocetna/pocetna.component';
import { PromenaProfilaComponent } from './promena-profila/promena-profila.component';
import { NastavnikProfilComponent } from './nastavnik-profil/nastavnik-profil.component';
import { PromenaProfilaNastavnikComponent } from './promena-profila-nastavnik/promena-profila-nastavnik.component';
import { DosijeComponent } from './dosije/dosije.component';
import { OceniCasComponent } from './oceni-cas/oceni-cas.component';

const routes: Routes = [
  { path: "", component: PocetnaComponent},
  { path: "ucenik", component: UcenikComponent},
  { path: "nastavnik", component: NastavnikComponent},
  { path: "adminLogin",  component: LoginAdminComponent},
  { path: "registerUcenik", component: RegisterComponent},
  { path: "registerNastavnik", component: RegisterNastavnikComponent},
  { path: "admin", component: AdminComponent},
  { path: "login", component: LoginComponent},
  { path: "promenaProfila", component: PromenaProfilaComponent},
  { path: "nastavnikProfil", component: NastavnikProfilComponent},
  { path: "promenaProfilaNastavnik", component: PromenaProfilaNastavnikComponent},
  { path: "dosije", component: DosijeComponent},
  { path: "oceni", component: OceniCasComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
