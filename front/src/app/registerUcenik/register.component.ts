import { Component } from '@angular/core';
import { ucenici } from '../models/ucenici';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username: string = "";
  password: string = "";
  ime: string = "";
  prezime: string = "";
  odgovor: string = "";
  musko: boolean = false;
  zensko: boolean = false;
  adresa: string = "";
  telefon: string = "";
  email: string = "";
  fileForUpload: File | null = null;
  tipSkole: string = "";
  razredi: number[] = [];
  errorMessage: string;
  sigurnosnoPitanje: string = "Koja je vasa omiljena boja?";
  trenutniRazred: number = -1;

  constructor(private userService: UserService){}

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    const reader = new FileReader();

    reader.onload=(e)=>{
      const img = new Image();
      img.onload=()=>{
        const width = img.width;
        const height = img.height;
        if(width < 100 || height < 100 || width > 300 || height > 300){
          this.errorMessage = "Profilna slika nije odgovarajucih dimenzija";
          this.fileForUpload = null;
        } else {
          this.errorMessage = ""
          this.fileForUpload = file;
        }
      }
      img.src = e.target.result.toString();
    }
    reader.readAsDataURL(file);
  }

  onTipSkoleChange() {
    if (this.tipSkole === 'osnovna') {
      this.razredi = [1, 2, 3, 4, 5, 6, 7, 8];
    } else {
      this.razredi = [1, 2, 3, 4];
    }
  }

  registerUcenik() {
    const passwordRegex = /^(?=[a-zA-Z])(?=.*[A-Z])(?=.*[a-z].*[a-z].*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{6,10}$/;
    if(this.adresa == "" || this.email == "" || this.fileForUpload == null || this.ime=="" || (this.musko == false && this.zensko == false) || this.prezime == "" || this.odgovor == "" || this.password == "" || this.username == "" || this.telefon == "" || this.tipSkole == ""){
      this.errorMessage = "Niste uneli sve podatke"
    } else {
      if(passwordRegex.test(this.password) != true){
        this.errorMessage = "Lozinka nije u dobrom formatu"
      } else {
        if(this.trenutniRazred == -1) this.errorMessage = "Niste uneli sve podatke"
        else {
          this.errorMessage = "";
          let user = new ucenici();
          user.username = this.username;
          user.password = this.password;
          user.odgovorNaPitanje = this.odgovor;
          user.ime = this.ime;
          user.prezime = this.prezime;
          if(this.musko == true) user.pol="m";
          else if (this.zensko == true) user.pol = "z";
          user.adresa = this.adresa;
          user.telefon = this.telefon;
          user.email = this.email;
          user.profilePictureUrl = "";
          user.tipSkole = this.tipSkole;
          user.razred = this.trenutniRazred;
          this.userService.registerUcenik(user, this.fileForUpload).subscribe((response)=>{
            console.log("Uspesna registracija");
          }, (error)=>{
            console.log("Neuspesna registracija")
          })
        }
      }
    }
  }
}
