import { Component, OnInit } from '@angular/core';
import { ucenici } from '../models/ucenici';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { UserService } from '../services/user.service';
import { nastavnici } from '../models/nastavnici';
import { Router } from '@angular/router';
import { predmeti } from '../models/predmeti';
import { casovi } from '../models/casovi';
import { CasoviService } from '../services/casovi.service';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-ucenik',
  templateUrl: './ucenik.component.html',
  styleUrls: ['./ucenik.component.css']
})
export class UcenikComponent implements OnInit{
  korisnik: ucenici;
  fileDownloaded: SafeUrl | null = null;
  profileFlag = true;
  listaNastavnika: nastavnici[] = [];
  listaPretrazenih: nastavnici[] = [];
  ime: string = "";
  prezime: string = "";
  predmet: string = "";
  message: string = "";
  pretraga: boolean = false;
  sort: string = ""
  casovi: boolean = false;
  arhiviraniCasovi: casovi[] = []
  nadolazeciCasovi: casovi[] = []
  
  constructor(private userService: UserService, private sanitizer: DomSanitizer, private router: Router, private casoviService: CasoviService, private datePipe: DatePipe){}

  ngOnInit(): void {
    let usr = localStorage.getItem('ulogovan');
    if(usr != null) this.korisnik = JSON.parse(usr);
    this.userService.getFile(this.korisnik.username).subscribe((data)=>{
      const blob = new Blob([data]);
      const url = URL.createObjectURL(blob);
      this.fileDownloaded = this.sanitizer.bypassSecurityTrustUrl(url);
      this.userService.getAktivneNastavnike().subscribe((n: nastavnici[])=>{
        let lista: nastavnici[] = [];
        n.forEach(nas=>{
          if(this.korisnik.tipSkole == 'osnovna' && this.korisnik.razred <= 4){
            nas.zeljeZaUzrast.forEach(zelja=>{
              if(zelja.uzrast == 'osnovna skola 1-4 razred'){
                lista.push(nas);
              }
            })
          } else if (this.korisnik.tipSkole == 'osnovna' && this.korisnik.razred > 4 && this.korisnik.razred <= 8){
            nas.zeljeZaUzrast.forEach(zelja=>{
              if(zelja.uzrast == 'osnovna skola 5-8 razred'){
                lista.push(nas);
              }
            })
          } else {
            nas.zeljeZaUzrast.forEach(zelja=>{
              if(zelja.uzrast == 'srednja skola'){
                lista.push(nas);
              }
            })
          }
        })
        this.listaNastavnika = lista;
      })
    })
  }

  profil(l: nastavnici): void{
    localStorage.setItem('nastavnik', JSON.stringify(l));
    this.router.navigate(['nastavnikProfil']);
  }

  prikaziProfil(){
    this.profileFlag = true;
    this.casovi = false;
  }

  prikaziNastavnike() {
    this.profileFlag = false;
    this.casovi = false;
  }

  prikaziCasove() {
    this.profileFlag = false;
    this.casovi = true;
    this.casoviService.dohvatiArhiviraneCasove(this.korisnik.username).subscribe((lista: casovi[])=>{
      this.arhiviraniCasovi = lista;
      this.casoviService.dohvatiNadolazeceCasove(this.korisnik.username).subscribe((l: casovi[])=>{
        this.nadolazeciCasovi = l;
      })
    })
  }

  promeniProfil() {
    this.router.navigate(['promenaProfila']);
  }

  sortiraj(){
    if(this.sort == 'imeOpadajuce'){
      this.listaNastavnika.sort((a,b)=>b.ime.localeCompare(a.ime));
    } else if (this.sort == 'imeNeopadajuce'){
      this.listaNastavnika.sort((a,b)=>a.ime.localeCompare(b.ime));
    } else if (this.sort == 'prezimeOpadajuce'){
      this.listaNastavnika.sort((a,b)=>b.prezime.localeCompare(a.prezime));
    } else {
      this.listaNastavnika.sort((a,b)=>a.prezime.localeCompare(b.prezime));
    } 
  }

  pretragaNastavnika(){
    this.pretraga = true;
  }

  nadjiNastavnika(){
    if(this.ime == "" && this.prezime == "" && this.predmet == ""){
      this.message = "Niste uneli sve podatke"
    } else {
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
            this.listaPretrazenih = lista;
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
            this.listaPretrazenih = lista;
          })
        })
      } else {
        this.userService.pretragaNastavnika(this.ime, this.prezime).subscribe((n: nastavnici[])=>{
          this.listaPretrazenih = n;
        })
      }
    }
  }

  formatirajDatum(date: Date): string {
    const formatiranDatum = this.datePipe.transform(date, 'dd/MM/yyyy');
    return formatiranDatum || ''; 
  }
}
