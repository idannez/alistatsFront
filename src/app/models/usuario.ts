export class Usuario {
    nombreCompleto:string;
    email:string;
    nombreUsuario:string;
    password:string;

    constructor(nombreCompleto:string,email:string,nombreUsuario:string,password:string){
        this.nombreCompleto=nombreCompleto;
        this.email=email;
        this.nombreUsuario=nombreUsuario;
        this.password=password;
    }
}