import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { admin } from '../models/admin';

@Component({
  selector: 'app-login-admin',
  templateUrl: './login-admin.component.html',
  styleUrls: ['./login-admin.component.css']
})
export class LoginAdminComponent {
  username: string = ""
  password: string = ""
  message: string = ""

  constructor(private userService: UserService, private router: Router){}

  login() {
    this.userService.loginAdmin(this.username, this.password).subscribe((korisnik: admin)=>{
      if(korisnik == null){
        this.message = "Pogresni kredencijali"
      } else {
        this.router.navigate(['admin']);
      }
    })
  }
}
