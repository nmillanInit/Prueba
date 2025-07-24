class Sistema {
  constructor() {
    (this.clientes = [
      new Cliente(0, "prueba", "Prueba1", "Firulais", "chico"),
      new Cliente(1, "alfaRodri23", "Firul4isA", "Firulais", "grande"),
      new Cliente(2, "brenLopez89", "Pelus4B", "Pelusa", "chico"),
      new Cliente(3, "carlosMdz7", "Toby123c", "Toby", "mediano"),
      new Cliente(4, "diana.sosa", "Luna321D", "Luna", "chico"),
      new Cliente(5, "esteban_rp", "M4xEsteban", "Max", "grande"),
      new Cliente(6, "flor.delvalle", "Can3laF", "Canela", "mediano"),
      new Cliente(7, "gus_rivera90", "RockyG9", "Rocky", "grande"),
      new Cliente(8, "helena.g", "N1naH123", "Nina", "chico"),
      new Cliente(9, "ivan_crz88", "S1mbaIv", "Simba", "mediano"),
      new Cliente(10, "julieta.mm", "C0c0Jul", "Coco", "chico"),
      new Cliente(11, "lucasQ_17", "Ch1spaL", "Chispa", "chico"),
      new Cliente(12, "vale_rios23", "BrunoV2", "Bruno", "mediano"),
      new Cliente(13, "leonel.sv", "Milo9Leo", "Milo", "grande"),
      new Cliente(14, "martu_fernandez", "Kira77M", "Kira", "mediano"),
      new Cliente(15, "sofi.garcia", "Z3usSofi", "Zeus", "grande"),
      new Cliente(16, "nico_mtz", "D4isyNm", "Daisy", "chico"),
      new Cliente(17, "agus.torres98", "Th0rAgus", "Thor", "grande"),
      new Cliente(18, "rochisv", "L0laRoch", "Lola", "mediano"),
      new Cliente(19, "fran.mendoza", "TeoF123", "Teo", "chico"),
      new Cliente(20, "meli.ramos10", "SashaM1", "Sasha", "mediano"),
      new Cliente(21, "franco", "123", "Roco", "grande"),
    ]),
      (this.paseadores = [
        new Paseador(0, "Alfredo", "AlfreditoCrack123", "con7rAseNia", 11),
        new Paseador(1, "Brenda", "BrenTop456", "Secr3tPass", 12),
        new Paseador(2, "Carlos", "Carlitox789", "P@ssword321", 12),
        new Paseador(3, "Diana", "DidiDinamita", "d1aNaClave", 12),
        new Paseador(4, "Esteban", "Estebinator007", "1234Clave!", 12),
        new Paseador(5, "test", "test", "test", 5),
      ]),
      (this.contrataciones = [
        new Contratacion(0, "confirmada", this.clientes[5], this.paseadores[0]),
        new Contratacion(1, "confirmada", this.clientes[1], this.paseadores[0]),
        new Contratacion(
          2,
          "confirmada",
          this.clientes[18],
          this.paseadores[0]
        ),
        new Contratacion(
          3,
          "confirmada",
          this.clientes[19],
          this.paseadores[1]
        ),
        new Contratacion(4, "confirmada", this.clientes[9], this.paseadores[1]),
        new Contratacion(
          5,
          "confirmada",
          this.clientes[10],
          this.paseadores[1]
        ),
        new Contratacion(6, "confirmada", this.clientes[2], this.paseadores[1]),
        new Contratacion(7, "pendiente", this.clientes[16], this.paseadores[1]),
        new Contratacion(8, "rechazada", this.clientes[12], this.paseadores[2]),
        new Contratacion(9, "cancelada", this.clientes[20], this.paseadores[2]),
        new Contratacion(
          10,
          "confirmada",
          this.clientes[17],
          this.paseadores[3]
        ),
        new Contratacion(11, "pendiente", this.clientes[4], this.paseadores[4]),
        new Contratacion(
          12,
          "pendiente",
          this.clientes[21],
          this.paseadores[5]
        ),
        new Contratacion(13, "pendiente", this.clientes[0], this.paseadores[5]),
        new Contratacion(
          14,
          "pendiente",
          this.clientes[12],
          this.paseadores[5]
        ),
      ]);
  }
  //VALIDACIONES SECCION REGISTRO
  //COMPRUEBO SI EL USUARIO QUE INTENTA REGISTRARSE YA EXISTE REGISTRADO SEA COMO PASEADOR O COMO CLIENTE
  usuarioExiste(unUsuario) {
    for (let i = 0; i < this.clientes.length; i++) {
      if (this.clientes[i].usuario.toLowerCase() === unUsuario) {
        return true;
      }
    }
    for (let i = 0; i < this.paseadores.length; i++) {
      if (this.paseadores[i].usuario.toLowerCase() === unUsuario) {
        return true;
      }
    }
    return false;
  }
  
  registrarCliente(cliente) {
    this.clientes.push(cliente);
    limpiarRegistro();
  }
  //VALIDO QUE TODOS LOS CAMPOS SEAN COMPLETADOS Y QUE EL USUARIO NO EXISTA YA PREVIAMENTE.
  validarRegistro(unUsuario, unaContrasenia, unNombrePerro, unTamanioPerro) {
    mostrarMsj("errorRegistro", "");
    mostrarMsj("registroExitoso", "");
    let contraseniaUsuarioValida = this.validarContrasenia(unaContrasenia);
    let usuarioYaExiste = this.usuarioExiste(unUsuario);
    if (unUsuario === "" || unaContrasenia === "" || unNombrePerro === "") {
      mostrarMsj("errorRegistro", "Asegurese de completar todos los campos");
    } else if (usuarioYaExiste) {
      mostrarMsj(
        "errorRegistro",
        `El usuario <b>${unUsuario}</b> ya está registrado en la Base de datos`
      );
    } else if (!usuarioYaExiste && contraseniaUsuarioValida) {
      let unIdUsuario = this.clientes[this.clientes.length - 1].idUsuario + 1;
      // SI PASA LAS VALIDACIONES CREO AL CLIENTE
      let nuevoCliente = new Cliente(
        unIdUsuario,
        unUsuario,
        unaContrasenia,
        unNombrePerro,
        unTamanioPerro
      );
      //UNA VEZ CREADO EL CLIENTE LO AGREGO AL LISTADO DE CLIENTES Y LIMPIO LOS CAMPOS DEL FORMULARIO
      this.registrarCliente(nuevoCliente);
      mostrarMsj("registroExitoso", "Registrado exitosamente");
    } else if (!usuarioYaExiste && !contraseniaUsuarioValida) {
      mostrarMsj(
        "errorRegistro",
        "Verifica que la contraseña contenga al menos: una minúscula, una mayúscula, un número, y además sea igual o mayor a 5 carácteres"
      );
    }
  }
  //VALIDO QUE LA CONTRASEÑA CONTENGA UNA MAYUSCULA, UNA MINUSCULA Y AL MENOS UN NÚMERO, ADEMÁS DE QUE SU LARGO SEA MAYOR O IGUAL A 5
  validarContrasenia(unaContrasenia) {
    let contieneMayus = false;
    let contieneMinus = false;
    let contieneNumero = false;

    let contraseniaEsValida = false;
    for (let i = 0; i < unaContrasenia.length; i++) {
      const caracter = unaContrasenia[i];
      if (caracter === caracter.toUpperCase() && isNaN(caracter)) {
        contieneMayus = true;
      } else if (caracter === caracter.toLowerCase() && isNaN(caracter)) {
        contieneMinus = true;
      } else if (!isNaN(caracter)) {
        contieneNumero = true;
      }
    }
    if (
      contieneMayus &&
      contieneMinus &&
      contieneNumero &&
      unaContrasenia.length >= 5
    ) {
      contraseniaEsValida = true;
    }

    return contraseniaEsValida;
  }
  // VALIDACIONES LOGIN
  //VALIDO QUE EL USUARIO COINCIDA CON UN USUARIO YA EXISTENTE, SEA PASEADOR O CLIENTE
  // SI EL USUARIO EXISTE Y LA CONTRASEÑA COINCIDE CON LA QUE SE REGISTRÓ JUNTO AL USUARIO RETORNAMOS EL OBJETO CLIENTE O PASEADOR, DEPENDIENDO DE A QUE CONJUNTO DE USUARIOS PERTENEZCA EL QUE SE LOGUEA
  validarLogin(unUsuario, unaContrasenia) {
    for (let i = 0; i < this.clientes.length; i++) {
      const cliente = this.clientes[i];
      if (unUsuario.toLowerCase() === cliente.usuario.toLowerCase()) {
        if (unaContrasenia === cliente.contrasenia) {
          return cliente;
        } else {
          return null;
        }
      }
    }

    for (let i = 0; i < this.paseadores.length; i++) {
      const paseador = this.paseadores[i];
      if (unUsuario.toLowerCase() === paseador.usuario.toLowerCase()) {
        if (unaContrasenia === paseador.contrasenia) {
          return paseador;
        } else {
          return null;
        }
      }
    }

    return null;
  }
  //VALIDACIONES SECCION CONTRATAR SERVICIO
  
  tieneCupoDisponible(idPaseador, cupoTotal) {
    let cupoOcupado = 0;
    for (let contratacion of this.contrataciones) {
      if (
        contratacion.paseador.idPaseador === idPaseador &&
        contratacion.statusContratacion === "confirmada"
      ) {
        if (contratacion.cliente.tamanioPerro === "grande") {
          cupoOcupado += 4;
        } else if (contratacion.cliente.tamanioPerro === "mediano") {
          cupoOcupado += 2;
        } else if (contratacion.cliente.tamanioPerro === "chico") {
          cupoOcupado += 1;
        }
      }
    }
    let cupoDisponible = cupoTotal - cupoOcupado;
    return cupoDisponible;
  }

  aceptaTamanio(cliente, paseador) {
    for (let contratacion of this.contrataciones) {
      if (
        contratacion.statusContratacion === "confirmada" &&
        contratacion.paseador.idPaseador === paseador.idPaseador
      ) {
        let tamanioPerroCliente = cliente.tamanioPerro;
        let tamanioPerroContratacion = contratacion.cliente.tamanioPerro;

        if (
          this.esTamanioIncompatible(
            tamanioPerroCliente,
            tamanioPerroContratacion
          )
        ) {
          return false;
        }
      }
    }
    return true;
  }

  // FUNCION OBTENER OBJETO
  obtenerObjeto(arrElementos, propiedad, busqueda) {
    let objeto = null;
    for (let i = 0; i < arrElementos.length; i++) {
      const unElemento = arrElementos[i];
      if (unElemento[propiedad] === busqueda) {
        objeto = unElemento;
        break;
      }
    }
    return objeto;
  }
  //FUNCION QUE CALCULA CANTIDAD DE CUPOS QUE CONSUME EL PERRO DEL CLIENTE
  calcCuposConsumePerroCliente(tamanioPerroDelCliente) {
    let cuposQueConsume = 0;
    switch (tamanioPerroDelCliente) {
      case "chico":
        cuposQueConsume = 1;
        break;
      case "mediano":
        cuposQueConsume = 2;
        break;
      case "grande":
        cuposQueConsume = 4;
        break;
    }
    return cuposQueConsume;
  }
  // Validar si el cliente ya tiene una contratación pendiente
  verificarSiContratacionEsPendiente(cliente) {
    let tienePendiente = false;
    for (let i = 0; i < this.contrataciones.length; i++) {
      let contratacion = this.contrataciones[i];
      if (
        contratacion.cliente.idUsuario === cliente.idUsuario &&
        contratacion.statusContratacion === "pendiente"
      ) {
        tienePendiente = true;
        break;
      }
    }
    return tienePendiente;
  }
  // Validar si el cliente ya tiene una contratación pendiente
  verificarSiContratacionEsConfirmada(cliente) {
    let tieneConfirmada = false;
    for (let i = 0; i < this.contrataciones.length; i++) {
      let contratacion = this.contrataciones[i];
      if (
        contratacion.cliente.idUsuario === cliente.idUsuario &&
        contratacion.statusContratacion === "confirmada"
      ) {
        tieneConfirmada = true;
        break;
      }
    }
    return tieneConfirmada;
  }
  //GUARDAR CONTRATACION
  guardarContratacion(nuevaContratacion) {
    this.contrataciones.push(nuevaContratacion);
  }
  //CANCELAR CONTRATACION
  cancelarContratacion(idContratacion) {
    let msjCancelacionContratacion =
      "Hubo un error en cancelar la contratacion.";

    for (let i = 0; i < sistema.contrataciones.length; i++) {
      let contratacion = sistema.contrataciones[i];
      if (contratacion.idContratacion === idContratacion) {
        contratacion.statusContratacion = "cancelada";
        msjCancelacionContratacion = "Contratacion cancelada con exito.";
        break;
      }
    }
    return msjCancelacionContratacion;
  }
  //Cuento la cantidad de perros asignados para el listado de paseadores
  cantidadPerrosAsignados(idDePaseador) {
    let perrosAsignados = 0;
    for (let contratacion of this.contrataciones) {
      if (
        contratacion.paseador.idPaseador === idDePaseador &&
        contratacion.statusContratacion === "confirmada"
      ) {
        perrosAsignados++;
      }
    }
    return perrosAsignados;
  }
  puedeAceptarPendiente(idPaseador, cupoTotal, tamanioPerro) {
    let cupoDisponible = this.tieneCupoDisponible(idPaseador, cupoTotal);
    let cuposAdescontar = 0;
    if (tamanioPerro === "grande") {
      cuposAdescontar = 4;
    } else if (tamanioPerro === "mediano") {
      cuposAdescontar = 2;
    } else if (tamanioPerro === "chico") {
      cuposAdescontar = 1;
    }

    return cupoDisponible >= cuposAdescontar;
  }
  aceptarCliente(idContratacion) {
    for (let contratacion of this.contrataciones) {
      if (Number(contratacion.idContratacion) === Number(idContratacion)) {
        contratacion.statusContratacion = "confirmada";
        return "Cliente aceptado.";
      }
    }
    return "No se pudo aceptar al cliente.";
  }

  rechazarCliente(idContratacion) {
    for (let contratacion of this.contrataciones) {
      if (Number(contratacion.idContratacion) === Number(idContratacion)) {
        contratacion.statusContratacion = "rechazada";
        return "Cliente rechazado.";
      }
    }
    return "No se pudo rechazar al cliente.";
  }

  procesarSolicitud(idContratacion, idCliente, tamanioPerro) {
    const cuposActuales = this.tieneCupoDisponible(
      usuarioLogueado.idPaseador,
      usuarioLogueado.cupos
    );

    const cuposNecesarios = this.calcCuposConsumePerroCliente(tamanioPerro);
    const cliente = this.obtenerObjeto(this.clientes, "idUsuario", idCliente);
    const tamanioCompatible = this.aceptaTamanio(cliente, usuarioLogueado);

    let resultado = "";

    if (!tamanioCompatible) {
      resultado = "Tamaño incompatible con otros perros asignados.";
    } else if (cuposActuales < cuposNecesarios) {
      resultado = "No hay suficientes cupos disponibles.";
    } else {
      resultado = this.aceptarCliente(idContratacion);

      // Rechazar por tamaño incompatible
      let rechazadasIncompatibles = 0;
      for (let otra of this.contrataciones) {
        if (
          otra.statusContratacion === "pendiente" &&
          otra.paseador.idPaseador === usuarioLogueado.idPaseador
        ) {
          const otroTamanio = otra.cliente.tamanioPerro;
          let esIncompatible = this.esTamanioIncompatible(
            tamanioPerro,
            otroTamanio
          );
          if (esIncompatible) {
            otra.statusContratacion = "rechazada";
            rechazadasIncompatibles++;
          }
        }
      }

      // Rechazar por falta de cupos
      let cuposRestantes = this.tieneCupoDisponible(
        usuarioLogueado.idPaseador,
        usuarioLogueado.cupos
      );
      let rechazadasPorCupos = 0;

      for (let otra of this.contrataciones) {
        if (
          otra.statusContratacion === "pendiente" &&
          otra.paseador.idPaseador === usuarioLogueado.idPaseador
        ) {
          const otroTamanio = otra.cliente.tamanioPerro;
          let esIncompatible = this.esTamanioIncompatible(
            tamanioPerro,
            otroTamanio
          );
          if (!esIncompatible) {
            let cuposNecesariosOtro =
              this.calcCuposConsumePerroCliente(otroTamanio);
            if (cuposRestantes < cuposNecesariosOtro) {
              otra.statusContratacion = "rechazada";
              rechazadasPorCupos++;
            } else {
              cuposRestantes -= cuposNecesariosOtro;
            }
          }
        }
      }

      // MENSAJE EN PANTALLA
      if (rechazadasIncompatibles > 0) {
        resultado += ` Se rechazaron automáticamente ${rechazadasIncompatibles} solicitudes por tamaño incompatible.`;
      }
      if (rechazadasPorCupos > 0) {
        resultado += ` Se rechazaron automáticamente ${rechazadasPorCupos} solicitudes por falta de cupos.`;
      }
    }

    mostrarMsj("msjGestionParaPaseadores", resultado);
    gestionarClientes(usuarioLogueado);
  }

  esTamanioIncompatible(t1, t2) {
    let incompatible = false;

    if (t1 === "chico") {
      if (t2 === "grande") {
        incompatible = true;
      }
    } else if (t1 === "grande") {
      if (t2 === "chico") {
        incompatible = true;
      }
    }

    return incompatible;
  }
}
