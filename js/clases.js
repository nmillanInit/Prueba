class Cliente{
    constructor(idUsuario, unUsuario, unaContrasenia, unNombrePerro, unTamanioPerro){
        this.idUsuario = idUsuario;
        this.usuario = unUsuario;
        this.contrasenia = unaContrasenia;
        this.nombrePerro = unNombrePerro;
        this.tamanioPerro = unTamanioPerro;
        this.tipoUsuario = 'cliente';
    }
}

class Paseador {
  constructor(unId, unNombre, unUsuario, unaContrasenia, unCuposDisponibles = 0) {
    this.idPaseador = unId;
    this.nombre = unNombre;
    this.usuario = unUsuario;
    this.contrasenia = unaContrasenia;
    this.cupos = unCuposDisponibles;
    this.tipoUsuario = "paseador";
  }
}


class Contratacion {
    constructor(idContratacion, statusContratacion, cliente, paseador) {
        this.idContratacion = idContratacion;
        this.statusContratacion = statusContratacion;
        this.cliente = cliente;
        this.paseador = paseador;  
    }
}
