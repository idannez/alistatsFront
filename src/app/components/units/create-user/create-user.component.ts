import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { HashService } from 'src/app/services/hash.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { Usuario } from 'src/app/models/usuario';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit {

  registerForm: UntypedFormGroup;
  validpw=true;
  validemail=true;

  constructor(private toastr: ToastrService, private fb: UntypedFormBuilder, private router: Router, private _hashService: HashService, private _usuariosService: UsuariosService) {

    this.registerForm = this.fb.group({
      InputUsername: ['', [Validators.required]],
      InputCompleteName: ['', [Validators.required]],
      InputEmail1: ['', [Validators.required, Validators.email]],
      InputEmail2: ['', [Validators.required, Validators.email]],
      InputPassword1: ['', [Validators.required, Validators.minLength(8)]],
      InputPassword2: ['', [Validators.required, Validators.minLength(8)]],
    })

  }

  ngOnInit(): void {
  }

  formulario(){return this.registerForm.controls;}

  async register() {
    let valid=true;
    if(this.registerForm.get('InputPassword1')?.value!=this.registerForm.get('InputPassword2')?.value){
      this.validpw=false;
      valid=false;
    }else{
      this.validpw=true;
    }
    if(this.registerForm.get('InputEmail1')?.value!=this.registerForm.get('InputEmail2')?.value){
      this.validemail=false;
      valid=false;
    }else{
      this.validemail=true;
    }
    if(!valid){
      return;
    }

    const USUARIO: Usuario={
      nombreCompleto:this.registerForm.get('InputCompleteName')?.value,
      email:this.registerForm.get('InputEmail1')?.value,
      nombreUsuario:this.registerForm.get('InputUsername')?.value,
      password:this._hashService.SHA256(this.registerForm.get('InputPassword1')?.value)
    }

    this._usuariosService.crearUsuario(USUARIO).subscribe(data=>{
      if(!data.error){
        this.toastr.success('User registered!','Register');
        setTimeout(() => {  this.router.navigate(['/']); }, 3000);
      }else{
        this.toastr.error('Email already registered','Register');  
      }
    },error => {
      this.toastr.error('Something went wrong','Register');
      console.log(error);
      this.registerForm.reset();  
    })

  }

}
