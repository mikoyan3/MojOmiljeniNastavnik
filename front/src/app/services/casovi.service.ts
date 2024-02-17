import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { casovi } from '../models/casovi';
import { dosije } from '../models/dosije';
import { Observable } from 'rxjs';
import { helper } from '../models/helper';


@Injectable({
  providedIn: 'root'
})
export class CasoviService {

  constructor(private http: HttpClient) { }

  dodajCas(username: string, datumCasa: string, predmetCasa: string, temaCasa: string, dupliCas: boolean, ucenik: string){
    let data = {
      username: username,
      datumCasa: datumCasa,
      predmetCasa: predmetCasa,
      temaCasa: temaCasa,
      dupliCas: dupliCas,
      ucenik: ucenik
    }

    return this.http.post<String>("http://localhost:4000/casovi/dodajCas", data);
  }

  dohvatiArhiviraneCasove(username: string){
    let data = {
      username: username
    }
    
    return this.http.post<casovi[]>("http://localhost:4000/casovi/dohvatiArhiviraneCasove", data)
  }

  dohvatiNadolazeceCasove(username: string){
    let data = {
      username: username
    }
    
    return this.http.post<casovi[]>("http://localhost:4000/casovi/dohvatiNadolazeceCasove", data)
  }

  dohvatiPetCasova(username: string){
    let data = {
      username: username
    }

    return this.http.post<casovi[]>("http://localhost:4000/casovi/dohvatiPetCasova", data)
  }

  dohvatiZatrazeneCasove(username: string){
    let data = {
      username: username
    }

    return this.http.post<casovi[]>("http://localhost:4000/casovi/dohvatiZatrazeneCasove", data)
  }

  potvrdiCas(id: number, obrazlozenje: string, ucenik: string){
    let data = {
      id: id,
      obrazlozenje: obrazlozenje,
      ucenik: ucenik
    }

    return this.http.post<string>("http://localhost:4000/casovi/potvrdiCas", data)
  }

  odbijCas(id: number, obrazlozenje: string, ucenik: string){
    let data = {
      id: id,
      obrazlozenje: obrazlozenje,
      ucenik: ucenik
    }

    return this.http.post<string>("http://localhost:4000/casovi/odbijCas", data)
  }

  getAllClasses(nastavnik: string, ucenik: string){
    let data = {
      nastavnik: nastavnik,
      ucenik: ucenik
    }
    return this.http.post<string[]>("http://localhost:4000/casovi/getAllClasses", data)
  }

  getUniqueDatesForSubject(nastavnik: string, ucenik: string, predmet: string){
    let data = {
      nastavnik: nastavnik,
      ucenik: ucenik,
      predmet: predmet
    }

    return this.http.post<Date[]>("http://localhost:4000/casovi/getUniqueDatesForSubject", data);
  }

  getClassesFromGivenDateForGivenSubject(nastavnik: string, ucenik: string, predmet: string, datum: Date){
    let data = {
      nastavnik: nastavnik,
      ucenik: ucenik,
      predmet: predmet,
      datum: datum
    }

    return this.http.post<casovi[]>("http://localhost:4000/casovi/getClassesFromGivenDateForGivenSubject", data);
  }

  getDosije(idCasa: number){
    return this.http.post<dosije>("http://localhost:4000/casovi/getDosije", idCasa);
  }

  oceni(idCasa: number, ocena: number, komentar: string){
    let data = {
      idCasa: idCasa,
      ocena: ocena,
      komentar: komentar
    }
    return this.http.post<string>("http://localhost:4000/casovi/oceni", data);
  }

  odobriPredmet(predmet: string){
    let data = {
      predmet:predmet
    }
    return this.http.post<string>("http://localhost:4000/casovi/odobriPredmet", data);
  }

  dodajPredmet(predmet: string){
    let data = {
      predmet: predmet
    }
    return this.http.post<string>("http://localhost:4000/casovi/dodajPredmet", data);
  }

  getAllSubjects(){
    return this.http.get<string[]>("http://localhost:4000/casovi/getAllSubjects")
  }

  getNumberOfTeachers(predmet: string){
    let data = {
      predmet: predmet
    }
    return this.http.post<number>("http://localhost:4000/casovi/getNumberOfTeachers", data)
  }

  getNumberOfTeachersPerUzrast(uzrast: string){
    let data = {
      uzrast: uzrast
    }
    return this.http.post<number>("http://localhost:4000/casovi/getNumberOfTeachersPerUzrast", data)
  }

  getAverageCasoviPerDay(){
    return this.http.get<{ukupanBrojPoDanima: number, counterPoDanima: number}>("http://localhost:4000/casovi/getAverageCasoviPerDay");
  }

  getBrojOdrzanih(){
    return this.http.get<helper[]>("http://localhost:4000/casovi/getBrojOdrzanih");
  }
}
