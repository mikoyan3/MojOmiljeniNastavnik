import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { ucenici } from '../models/ucenici';
import { nastavnici } from '../models/nastavnici';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(private userService: UserService, private router: Router){}

  username: string = "";
  password: string = "";
  message: string = "";

  login() {
    if(this.username != "" && this.password != ""){
      this.userService.login(this.username, this.password).subscribe((rez: any)=>{
        if(rez.userType == 'nastavnik'){
          this.message = "";
          localStorage.setItem('ulogovan', JSON.stringify(rez.user));
          this.router.navigate(['nastavnik'])
        } else if (rez.userType == 'ucenik'){
          this.message = "";
          localStorage.setItem('ulogovan', JSON.stringify(rez.user));
          this.router.navigate(['ucenik']);
        } else if (rez.userType == 'nePostoji'){
          this.message = "Ne postoji korisnik";
        } else if (rez.userType == 'neaktivan'){
          this.message = "Nalog jos uvek nije aktiviran"
        }
      })
    } else {
      this.message = "Niste uneli sve informacije"
    }
  }

  registerUcenik() {
    this.router.navigate(['registerUcenik']);
  }

  registerNastavnik() {
    this.router.navigate(['registerNastavnik']);
  }

  pokaziPocetnu(){
    this.router.navigate(['pocetna']);
  }
}
