import { Component } from '@angular/core';
import { nastavnici } from '../models/nastavnici';
import { zeljeZaPoducavanje } from '../models/zeljeZaPoducavanje';
import { zeljeZaUzrast } from '../models/zeljeZaUzrast';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-register-nastavnik',
  templateUrl: './register-nastavnik.component.html',
  styleUrls: ['./register-nastavnik.component.css']
})
export class RegisterNastavnikComponent {
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
  profilePictureForUpload: File | null = null;
  CVPictureForUpload: File | null = null;
  uzrast: string[] = [];
  predmeti: string[] = [];
  gdeSteCuli: string = ""
  errorMessage: string;
  sigurnosnoPitanje: string = "Koja je vasa omiljena boja?";
  dr: string = ""
  registerFlag: boolean = false;

  constructor(private userService: UserService){}

  onProfilePictureSelected(event: any): void {
    const file: File = event.target.files[0];
    const reader = new FileReader();

    reader.onload=(e)=>{
      const img = new Image();
      img.onload=()=>{
        const width = img.width;
        const height = img.height;
        if(width < 100 || height < 100 || width > 300 || height > 300){
          this.errorMessage = "Profilna slika nije odgovarajucih dimenzija";
          this.profilePictureForUpload = null;
        } else {
          this.errorMessage = ""
          this.profilePictureForUpload = file;
        }
      }
      img.src = e.target.result.toString();
    }
    reader.readAsDataURL(file);
  }

  onCVSelected(event: any): void {
    const file: File = event.target.files[0];
    if(file.size > 3 * 1024 * 1024){
      this.errorMessage="CV je prevelik";
      this.CVPictureForUpload = null;
    } else {
      this.errorMessage = "";
      this.CVPictureForUpload = event.target.files[0];
    }
    
  }

  registerNastavnik() {
    const passwordRegex = /^(?=[a-zA-Z])(?=.*[A-Z])(?=.*[a-z].*[a-z].*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{6,10}$/;
    if(this.username == "" || this.password == "" || this.ime == "" || this.prezime == "" || this.odgovor == "" || (this.musko == false && this.zensko == false) || this.adresa == "" || this.telefon == "" || this.email == "" || this.profilePictureForUpload == null || this.CVPictureForUpload == null || this.uzrast.length == 0 || this.predmeti.length == 0 || this.gdeSteCuli == ""){
      this.errorMessage = ""
    } else {
      if(passwordRegex.test(this.password) != true){
        this.errorMessage = "Lozinka nije u dobrom formatu"
      } else {
          this.errorMessage = "";
          if(this.dr!=""){
            let index = this.predmeti.indexOf('drugo');
            if (index !== -1) { 
              this.predmeti.splice(index, 1); 
            }
          }
          let user = new nastavnici();
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
          this.predmeti.forEach(p=>{
            let novaZelja = new zeljeZaPoducavanje();
            novaZelja.predmet = p;
            user.zeljeZaPoducavanje.push(novaZelja);
          })
          this.uzrast.forEach(u=>{
            let noviUzrast = new zeljeZaUzrast();
            noviUzrast.uzrast = u;
            user.zeljeZaUzrast.push(noviUzrast);
          })
          user.preporuka = this.gdeSteCuli;
          this.userService.uploadFile(this.profilePictureForUpload).subscribe((url: string)=>{
            user.profilePictureUrl = url;
            console.log(url);
            this.userService.uploadFile(this.CVPictureForUpload).subscribe((cvurl: string)=>{
              user.CVUrl = cvurl;
              console.log(cvurl);
              this.userService.registerNastavnik(user, this.dr).subscribe(()=>{
                this.registerFlag = true;
              });
            })
          })
      }
    }
  }
}
