import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { HashService } from 'src/app/services/hash.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: UntypedFormGroup;

  constructor(private toastr: ToastrService, private fb: UntypedFormBuilder, private router: Router, private _hashService: HashService, private _usuariosService: UsuariosService) {

    this.loginForm = this.fb.group({
      InputEmail: ['', [Validators.required]],
      InputPassword: ['', [Validators.required]]
    })

  }

  ngOnInit(): void {
  }

  login(){
    const loginData = JSON.stringify({
      "email":this.loginForm.get('InputEmail')?.value,
      "password":this._hashService.SHA256(this.loginForm.get('InputPassword')?.value)
    });
  this._usuariosService.login(this._hashService.SHA256(this.loginForm.get('InputPassword')?.value),this.loginForm.get('InputEmail')?.value).subscribe(data=>{
      if(data.msg){
        this.toastr.error('Wrong email or password','Login');
      }else{
        localStorage.setItem('token',data.token);
        this.toastr.success('Logged correctly','Login');
        setTimeout(()=>{
          this.router.navigate(['/']);
          setTimeout(()=>{window.location.reload()},5);
        },2000)
      }
    },error => {
      this.toastr.error('Wrong email or password','Login');
      console.log(error);
      this.loginForm.reset();  
    })
  }

}
