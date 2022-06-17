import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { HashService } from 'src/app/services/hash.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { ToastrService } from 'ngx-toastr';
import { LogoutService } from 'src/app/services/logout.service';
import { SummonerService } from 'src/app/services/summoner.service';

@Component({
  selector: 'app-modify-user',
  templateUrl: './modify-user.component.html',
  styleUrls: ['./modify-user.component.css']
})
export class ModifyUserComponent implements OnInit {

  modifyUser?: boolean = false;
  linkSummoner?: boolean = false;
  modifyForm: UntypedFormGroup;
  validpw: boolean = true;
  swpw?: boolean;
  region: string = "euw";
  summonerName: string = "";

  randNumber: any;
  changeIcon?: boolean;

  summonerData: any;

  user: any;
  puuid: any;

  accountImage1: any;
  accountImage2: any;

  isAccountLinked: boolean = false;

  inputUsername: string = "";
  inputCompleteName: string = "";
  inputEmail1: string = "";
  inputEmail2: string = "";
  inputPassword1: string = "";
  inputPassword2: string = "";

  constructor(private toastr: ToastrService, private fb: UntypedFormBuilder, private router: Router, private _hashService: HashService, private _usuariosService: UsuariosService, public _logoutService: LogoutService, private _summonerService: SummonerService) {

    this.modifyForm = this.fb.group({
      InputUsername: ['', [Validators.required]],
      InputCompleteName: ['', [Validators.required]],
      InputEmail1: ['', [Validators.required, Validators.email]],
      InputPassword1: ['', [Validators.required, Validators.minLength(8)]],
      InputPassword2: ['', [Validators.required, Validators.minLength(8)]],
    })

  }

  ngOnInit(): void {

    this._usuariosService.verificarLogin(localStorage.getItem('token') || "").subscribe(data => {
      if (!data.data) {
        this.router.navigate(['/']);
        setTimeout(() => { window.location.reload() }, 5);
      } else {
        this.user = data.data.usuario;
        if (this.user.summonerAccount) {
          this.isAccountLinked = true;
        }
        this.modifyForm.patchValue({
          InputUsername: this.user.nombreUsuario,
          InputCompleteName: this.user.nombreCompleto,
          InputEmail1: this.user.email
        });
        this.inputCompleteName = this.user.nombreCompleto;
        this.inputEmail1 = this.user.email;
      }
    });

    if (this.user) {
      this._summonerService.obtenerInvocador(this.user.summonerAccount, this.region).subscribe(data => {
        this.summonerData = data;
        this.accountImage1 = "./assets/12.7.1/img/profileicon/" + data.profileIconId + ".png";
      })
    }

  }

  swPw() {
    let inputPw1: any = document.getElementById('InputPassword1');
    let inputPw2: any = document.getElementById('InputPassword2');
    if (!this.swpw) {
      this.swpw = true;
      inputPw1.disabled = false;
      inputPw2.disabled = false;
    } else {
      this.swpw = false;
      inputPw1.disabled = true;
      inputPw2.disabled = true;
    }
  }

  ma() {

    if (!this.modifyUser) {
      this.modifyUser = true;
      setTimeout(() => {
        let inputPw1: any = document.getElementById('InputPassword1');
        let inputPw2: any = document.getElementById('InputPassword2');

        this.swpw = false;
        inputPw1.disabled = true;
        inputPw2.disabled = true;
      }, 200)

    } else {
      this.modifyUser = false;
    }

  }

  ls() {

    if (!this.linkSummoner) {
      this.linkSummoner = true;
    } else {
      this.linkSummoner = false;
      this.changeIcon = false
    }

  }

  modify() {

    let valid = true;

    if (this.swpw) {
      if ((this.modifyForm.get('InputPassword1')?.value != this.modifyForm.get('InputPassword2')?.value) || this.modifyForm.get('InputPassword2')?.value == "" || this.modifyForm.get('InputPassword2')?.value.length < 8) {
        this.validpw = false;
        valid = false;
      } else {
        this.validpw = true;
      }
    }

    if (this.modifyForm.get('InputUsername')?.value == "" || this.modifyForm.get('InputCompleteName')?.value == "") {
      valid = false;
    }

    if (!valid) {
      this.toastr.error('Something went wrong!', 'Modify Account');
      return;
    }
    this.user.nombreUsuario = this.modifyForm.get('InputUsername')?.value;
    this.user.nombreCompleto = this.modifyForm.get('InputCompleteName')?.value;
    this.user.email = this.modifyForm.get('InputEmail1')?.value;

    if (this.swpw) {
      this.user.password = this._hashService.SHA256(this.modifyForm.get('InputPassword1')?.value);
    }

    this._usuariosService.modificarUser(this.user._id, this.user).subscribe(data => {

      if (!data.msg || data != "ERROR") {
        this.toastr.success('Modified correctly', 'Modify Account');
        setTimeout(() => {
          this._usuariosService.login(this.user.password, this.user.email).subscribe(data => {
            if (!data.msg) {
              localStorage.setItem('token', data.token);
            }
          });
          this.router.navigate(['/']);
        }, 2000);
      } else {
        this.toastr.error('Something went wrong!', 'Modify Account');
      }

    })
  }

  searchSummoner() {
    this._summonerService.obtenerInvocador(this.summonerName, this.region).subscribe(data => {
      this._usuariosService.buscarUserPorPUUID(data.puuid).subscribe(dataUser => {
        if (dataUser.msg) {

          this.puuid = data.puuid;

          this.changeIcon = true;

          this.accountImage1 = "./assets/12.7.1/img/profileicon/" + data.profileIconId + ".png";

          do { this.randNumber = Math.floor(Math.random() * (28 - 1 + 1)) + 1; }
          while (this.randNumber == data.profileIconId)

          this.accountImage2 = "./assets/12.7.1/img/profileicon/" + this.randNumber + ".png";

        } else {
          this.toastr.error('This summoner name is already linked to another account', 'Link summoner account');
        }
      });

    });
  }

  comprobarProfileIcon() {

    this._summonerService.obtenerInvocador(this.summonerName, this.region).subscribe(data => {

      if (this.randNumber == data.profileIconId) {
        this.user.summonerAccount = this.puuid;
        this.user.summonerName = this.summonerName;
        this._usuariosService.modificarUser(this.user._id, this.user).subscribe(data => {

          if (data.email) {
            this.toastr.success('Account linked!', 'Link summoner account');
            setTimeout(() => {
              this._usuariosService.login(this.user.password, this.user.email).subscribe(data => {
                if (!data.msg) {
                  localStorage.setItem('token', data.token);
                }
              });
              this.router.navigate(['/']);
            }, 2000);
          } else {
            this.toastr.error('Wrong profile icon', 'Link summoner account');
          }
        });
      } else {
        this.toastr.error('Wrong profile icon', 'Link summoner account');
      }

    });

  }

  enableInputDiscord() {
    let cb: any = document.getElementById('btncheck2');
    let input: any = document.getElementById('InputDiscord');
    let button: any = document.getElementById('ButtonDiscord');

    if (cb.checked) {
      input.disabled = false;
      button.disabled = false;
    } else {
      input.disabled = true;
      button.disabled = true;
    }
  }

  addDiscord() {
    let input: any = document.getElementById('InputDiscord');
    let expresion = /^[a-zA-Z0-9._-]{2,32}\#{1}[0-9]{4}$/i;
    let expresion2 = /^$/i;
    if (input.value.match(expresion) || input.value.match(expresion2)) {
      this.user.discord = input.value;
      this._usuariosService.modificarUser(this.user._id, this.user).subscribe(data => {
        if (data) {
          this.toastr.success('Success', 'Discord');
          setTimeout(() => {
            this._usuariosService.login(this.user.password, this.user.email).subscribe(data => {
              if (!data.msg) {
                localStorage.setItem('token', data.token);
              }
            });
            this.router.navigate(['/']);
          }, 2000);
        } else {
          this.toastr.error('Something went wrong', 'Discord');
        }
      })
    } else {
      console.log(this.user);
      this.toastr.error('Wrong discord, please write it correctly', 'Discord');
    }

  }


}
