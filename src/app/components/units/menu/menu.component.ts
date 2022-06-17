import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LogoutService } from 'src/app/services/logout.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  sName:string="";
  mRegion:string="euw";
  verified?:boolean;
  data:any;
  root:boolean=false;
  rol?:string;
  
  constructor(private router:Router, private _usuarioService: UsuariosService,public _logoutService: LogoutService) { }

  ngOnInit(): void {
    this._usuarioService.verificarLogin(localStorage.getItem('token')||"").subscribe(data => {
      if(!data.error){
        this.verified=true;
        if(data.data.usuario.rol){
          this.rol=data.data.usuario.rol;
        }
      }else{
        this.verified=false;
      }
    })
  }

  searchSummoner(){
    
    if(this.sName.length>2 && this.sName.length<17){
      this.router.navigate(['/summoner/'+this.mRegion+'/'+this.sName]);
    }else{
      alert('Summoner name length is not valid (3-16)');
    }
  
  }

}
