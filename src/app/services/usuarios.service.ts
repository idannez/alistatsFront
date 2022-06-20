import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  url = 'https://alistats.click:3000/';

  constructor(private http:HttpClient) { }

  crearUsuario(usuario: any): Observable<any> {
    return this.http.post(this.url + 'usuarios',usuario);
  }

  login(password:string, email:string): Observable<any>{
    return this.http.post(this.url + 'usuarios/login',{'email':email,'password':password});
  }

  verificarLogin(token:string): Observable<any> {
    return this.http.post(this.url + 'usuarios/verifyLogin',{token:token});
  }

  verificarUser(token:string): Observable<any> {
    return this.http.post(this.url + 'usuarios/getUserByJWT',{token:token});
  }

  modificarUser(id:string, usuario:any): Observable<any>{
    return this.http.put(this.url + 'usuarios/' + id, usuario);
  }

  buscarUserPorPUUID(id:string): Observable<any>{
    return this.http.get(this.url + 'usuarios/puuid/' + id);
  }

  mostrarUsuario(id:string): Observable<any>{
    return this.http.get(this.url + 'usuarios/' + id);
  }

  buscarUserPorEmail(email:string): Observable<any>{
    return this.http.get(this.url + 'usuarios/email/' + email);
  }

  buscarUserPorSummonerName(sname:string): Observable<any>{
    return this.http.get(this.url + 'usuarios/sname/' + sname);
  }

  buscarUserPorUserName(sname:string): Observable<any>{
    return this.http.get(this.url + 'usuarios/uname/' + sname);
  }

  borrarUser(sname:string): Observable<any>{
    return this.http.delete(this.url + 'usuarios/' + sname);
  }

}
