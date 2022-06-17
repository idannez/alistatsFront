import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LogoutService } from 'src/app/services/logout.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  searchBy:string="email";
  sdata:string="";
  rol:string="";
  user:any;

  constructor(private router:Router, private _usuarioService: UsuariosService,public _logoutService: LogoutService) { }

  ngOnInit(): void {
    this._usuarioService.verificarLogin(localStorage.getItem('token')||"").subscribe(data => {
      if(!data.error){
        if(data.data.rol!='admin'){
          this.rol=data.data.usuario.rol;
        }else{
          this.router.navigate(['/']);
        }
      }else{
        this.router.navigate(['/']);
      }
    })
  }

  search(){
    this.user=[];
    if(this.searchBy=="email"){
      this._usuarioService.buscarUserPorEmail(this.sdata).subscribe(data=>{
        if(data){
          this.user.push(data);
        }else{
          this.user=null;
        }
      })
    }
    if(this.searchBy=="sname"){
      this._usuarioService.buscarUserPorSummonerName(this.sdata).subscribe(data=>{
        if(data){
          this.user.push(data);
        }else{
          this.user=null;
        }
      })
    }
    if(this.searchBy=="uname"){
      this._usuarioService.buscarUserPorUserName(this.sdata).subscribe(data=>{
        if(data){
          this.user=data;
        }else{
          this.user=null;
        }
      })
    }
  }

  delete(id:string){

    this._usuarioService.borrarUser(id).subscribe(data=>{
      
      if(data)
        window.location.reload();
    });

  }

  unlink(id:string){

    let user:any;

    this._usuarioService.mostrarUsuario(id).subscribe(data=>{
      user=data;
      user.summonerAccount="";
      user.summonerName="";
    
    this._usuarioService.modificarUser(id, user).subscribe(data=>{

      if(data)
        window.location.reload();
    });
    });

  }

  changeRol(id:string){

    let user:any;

    this._usuarioService.mostrarUsuario(id).subscribe(data=>{
      user=data;

      if(user.rol=="admin"){
        user.rol=""
      }else{
        user.rol="admin"
      }
      
      this._usuarioService.modificarUser(id, user).subscribe(data=>{
        if(data)
          window.location.reload();
      });
    });

  }

}
