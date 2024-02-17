import { Component, OnInit } from '@angular/core';
import { predmeti } from '../models/predmeti';
import { UserService } from '../services/user.service';
import { ucenici } from '../models/ucenici';
import { nastavnici } from '../models/nastavnici';
import { casovi } from '../models/casovi';
import { Router } from '@angular/router';
import { zeljeZaPoducavanje } from '../models/zeljeZaPoducavanje';
import { nastavnik } from '../models/nastavnik';

@Component({
  selector: 'app-pocetna',
  templateUrl: './pocetna.component.html',
  styleUrls: ['./pocetna.component.css']
})
export class PocetnaComponent implements OnInit{
  ukupanBrojUcenika: number;
  ukupanBrojNastavnika: number;
  brojOdrzanihCasovaUZadnjih7Dana: number;
  brojOdrzanihCasovaUZadnjih30Dana: number;
  listaPredmeta: predmeti[] = [];
  flag: boolean = false;
  kartica: boolean = false;
  ime: string = "";
  prezime: string = "";
  predmet: string = "";
  listaNastavnika : nastavnici[] = []
  message: string = ""
  
  constructor(private userService: UserService, private router: Router){}
  ngOnInit(): void {
    this.userService.getSveUcenike().subscribe((uc: ucenici[])=>{
      if(uc!=null) this.ukupanBrojUcenika = uc.length;
      else this.ukupanBrojUcenika = 0;
      this.userService.getAktivneNastavnike().subscribe((nas: nastavnici[])=>{
        if(nas!=null) this.ukupanBrojNastavnika = nas.length
        else this.ukupanBrojNastavnika = 0
        this.listaNastavnika = nas;
        this.userService.getBrojOdrzanihCasova(7).subscribe((cas: casovi[])=>{
          if(cas!=null) this.brojOdrzanihCasovaUZadnjih7Dana=cas.length;
          else this.brojOdrzanihCasovaUZadnjih7Dana=0;
          this.userService.getBrojOdrzanihCasova(30).subscribe((c: casovi[])=>{
            if(c!=null) this.brojOdrzanihCasovaUZadnjih30Dana = c.length;
            else this.brojOdrzanihCasovaUZadnjih30Dana = 0;
            this.userService.getSvePredmete().subscribe((p: predmeti[])=>{
              this.listaPredmeta = p;
              for(let i = 0; i < this.listaPredmeta.length; i++){
                this.listaPredmeta[i].nastavnici = [];
                for(let j = 0; j < this.listaNastavnika.length; j++){
                  for(let k = 0; k < this.listaNastavnika[j].zeljeZaPoducavanje.length; k++){
                    if(this.listaPredmeta[i].predmet == this.listaNastavnika[j].zeljeZaPoducavanje[k].predmet){
                      let nast: nastavnik = new nastavnik();
                      nast.username = this.listaNastavnika[j].username;
                      nast.prezime = this.listaNastavnika[j].prezime;
                      nast.ime = this.listaNastavnika[j].ime;
                      this.listaPredmeta[i].nastavnici.push(nast);
                    }
                  }
                }
              }
            })
          })
        })
      })
    })
  }

  sortirajNeopadajucePoImenu(){
    this.listaPredmeta.forEach(predmet=>{
      predmet.nastavnici.sort((a,b)=> a.ime.localeCompare(b.ime));
    })
  }
  sortirajOpadajucePoImenu(){
    this.listaPredmeta.forEach(predmet=>{
      predmet.nastavnici.sort((a,b)=> b.ime.localeCompare(a.ime));
    })
  }
  sortirajNeopadajucePoPrezimenu(){
    this.listaPredmeta.forEach(predmet=>{
      predmet.nastavnici.sort((a,b)=> a.prezime.localeCompare(b.prezime));
    })
  }
  sortirajOpadajucePoPrezimenu(){
    this.listaPredmeta.forEach(predmet=>{
      predmet.nastavnici.sort((a,b)=> b.prezime.localeCompare(a.prezime));
    })
  }
  sortirajPredmeteNeopadajuce(){
    this.listaPredmeta.sort((a,b)=> a.predmet.localeCompare(b.predmet));
  }
  sortirajPredmeteOpadajuce(){
    this.listaPredmeta.sort((a,b)=> b.predmet.localeCompare(a.predmet));
  }
  login(){
    this.router.navigate(['login']);
  }

  prikaziOsnovneInfo(){
    this.flag = true;
    this.kartica = false;
    this.ngOnInit();
  }

  logout(){
    localStorage.clear();
    this.router.navigate(['']);
  }

  pretraga() {
    if(this.ime == "" && this.prezime == "" && this.predmet == ""){
      this.message = "Niste uneli sve podatke"
    } else {
      this.flag = true;
      this.kartica = true;
      this.message = "";
      let lista: nastavnici[] = []
      let predmet: predmeti;
      if(this.ime == "" && this.prezime == "" && this.predmet != ""){
        this.userService.getPredmet(this.predmet).subscribe((p: predmeti)=>{
          predmet = p;
          this.userService.getSveNastavnike().subscribe((n: nastavnici[])=>{
            n.forEach(nas=>{
              predmet.nastavnici.forEach(nastavnik=>{
                if(nas.username == nastavnik.username){
                  lista.push(nas);
                }
              })
            })
            this.listaNastavnika = lista;
          })
        })
      } else if (this.predmet != ""){
        this.userService.getPredmet(this.predmet).subscribe((p:predmeti)=>{
          predmet = p;
          this.userService.pretragaNastavnika(this.ime, this.prezime).subscribe((n: nastavnici[])=>{
            n.forEach(nas=>{
              predmet.nastavnici.forEach(nastavnik=>{
                if(nas.username == nastavnik.username){
                  lista.push(nas)
                }
              })
            })
            this.listaNastavnika = lista;
          })
        })
      } else {
        this.userService.pretragaNastavnika(this.ime, this.prezime).subscribe((n: nastavnici[])=>{
          this.listaNastavnika = n;
        })
      }
    }
  }
}
