window.addEventListener("load", inicio);

function inicio() {
  ocultarSeccion();
  document
    .querySelector("#btnRegistro")
    .addEventListener("click", registrarUsuario);
  document.querySelector("#btnLogin").addEventListener("click", iniciarSesion);
  document.querySelector("#btnSeccionListadoPerrosAsignados").addEventListener("click", listarPerrosAsignados);
  let btnSecciones = document.querySelectorAll(".btnSeccion");

  for (let i = 0; i < btnSecciones.length; i++) {
    btnSecciones[i].addEventListener("click", mostrarSeccion);
  }
  ocultarBotones();
  document.querySelector("#btnSeccionLogin").style.display = "block";
  document.querySelector("#btnSeccionRegistro").style.display = "block";
  document.querySelector("#seccionLogin").style.display = "block";
  document
    .querySelector("#btnSeccionLogout")
    .addEventListener("click", cerrarSesion);
  document
    .querySelector("#btnSeccionListadoPaseadores")
    .addEventListener("click", listarPaseadores);
}

let usuarioLogueado = null;
let sistema = new Sistema();

//-------------------REGISTRO-------------------------------------------
function registrarUsuario() {
  let nombreUsuario = document.querySelector("#txtUsuario").value.toLowerCase();
  let contraseniaUsuario = document.querySelector("#txtContrasenia").value;
  let nombrePerroUsuario = document.querySelector("#txtNombrePerro").value;
  let tamanioPerroUsuario = document.querySelector("#slcTamanioPerro").value;
  sistema.validarRegistro(
    nombreUsuario,
    contraseniaUsuario,
    nombrePerroUsuario,
    tamanioPerroUsuario
  );
}
//----------------------INICIO DE SESION---------------------------------
function iniciarSesion() {
  let usuario = document.querySelector("#txtUsuarioLogin").value;
  let contrasenia = document.querySelector("#txtContraseniaLogin").value;
  usuarioLogueado = sistema.validarLogin(usuario, contrasenia);

  if (usuarioLogueado !== null) {
    if (usuarioLogueado.tipoUsuario === "cliente") {
      crearTablaPaseadoresDisponibles(usuarioLogueado);
      gestorContratacion(usuarioLogueado);
    }
    if (usuarioLogueado.tipoUsuario === "paseador") {
      gestionarClientes(usuarioLogueado);
    }

    mostrarMsj("errorLogin", "");
    mostrarMsj("loginExitoso", "Credenciales ingresadas son correctas");
    document.querySelector("#txtUsuarioLogin").value = "";
    document.querySelector("#txtContraseniaLogin").value = "";
    mostrarMenuOcultandoLoginYregistro(usuarioLogueado);
  } else {
    mostrarMsj("loginExitoso", "");
    mostrarMsj("errorLogin", "Credenciales incorrectas, pruebe nuevamente");
  }
}

function mostrarMsj(id, mensaje) {
  document.querySelector(`#${id}`).innerHTML = mensaje;
}

//CERRAR SESION

function cerrarSesion() {
  usuarioLogueado = null;
  mostrarMsj("errorLogin", "");
  mostrarMsj("loginExitoso", "");
  ocultarSeccion();
  document.querySelector("#seccionLogin").style.display = "block";
  document.querySelector("#nombreUsuarioLogueado").innerHTML = "";
  mostrarBotones("inicio");
}

// -----------------------TABLA CONTRATACIONES-------------------------
// Funcion contratar paseador (new)
function contratarPaseador() {
  let existeContratacionPendiente =
    sistema.verificarSiContratacionEsPendiente(usuarioLogueado);
  let existeContratacionConfirmada =
    sistema.verificarSiContratacionEsConfirmada(usuarioLogueado);
  if (existeContratacionPendiente) {
    alert(
      "Ya tienes una contratación pendiente. Debes cancelarla antes de contratar otro paseador."
    );
  } else if (existeContratacionConfirmada) {
    alert(
      "Ya tienes una contratación Confirmada. No puedes contratar otro paseador."
    );
    return;
  } else {
    let idPaseadorAcontratar = Number(this.getAttribute("data-paseador"));
    let objPaseador = sistema.obtenerObjeto(
      sistema.paseadores,
      "idPaseador",
      idPaseadorAcontratar
    );
    let idUltimaContratacion = 0;
    if (sistema.contrataciones.length > 0) {
      idUltimaContratacion =
        sistema.contrataciones[sistema.contrataciones.length - 1]
          .idContratacion + 1;
    }
    let nuevaContratacion = new Contratacion(
      idUltimaContratacion,
      "pendiente",
      usuarioLogueado,
      objPaseador
    );
    sistema.guardarContratacion(nuevaContratacion);
    gestorContratacion(usuarioLogueado); // actualizar tabla
    mostrarMsj("msjSinContratacionesPendientes", "");
  }
}

//CREAR TABLA CON PASEADORES DISPONIBLES PARA CONTRATAR
function crearTablaPaseadoresDisponibles(clienteActivo) {
  let cuerpoTabla = document.querySelector("#tblContrataciones");
  cuerpoTabla.innerHTML = "";
  let cuposDisponiblesPaseador = 0;
  let aceptaTamanio = false;
  let cuposConsumePerroCliente = sistema.calcCuposConsumePerroCliente(
    clienteActivo.tamanioPerro
  );
  for (let i = 0; i < sistema.paseadores.length; i++) {
    //Guardo en la variable aceptaTamanio el valor booleano true en caso de que el perro del cliente pueda viajar con los perros que tiene ya asignados el paseador, en caso de no poder se guarda un false
    let paseador = sistema.paseadores[i];
    aceptaTamanio = sistema.aceptaTamanio(clienteActivo, paseador);
    //Guardo el valor de los cupos disponibles por paseador
    cuposDisponiblesPaseador = sistema.tieneCupoDisponible(
      paseador.idPaseador,
      paseador.cupos
    );
    if (cuposDisponiblesPaseador >= cuposConsumePerroCliente && aceptaTamanio) {
      cuerpoTabla.innerHTML += `<tr>
          <td>${paseador.nombre}</td>
          <td>${cuposDisponiblesPaseador}</td>
          <td> ${paseador.usuario}</td>
          <td><input type="button" value="Contratar" class="btnContratar" data-paseador="${paseador.idPaseador}"></td>
          </tr>`;
    }
  }
  //Asigno a botones la funcion de contratarPaseador
  let btnsContratar = document.querySelectorAll(".btnContratar");
  for (let i = 0; i < btnsContratar.length; i++) {
    btnsContratar[i].addEventListener("click", contratarPaseador);
  }
}

// -----------TABLA GESTION CONTRATACION LOGUEADO COMO CLIENTE-------------------------
function gestorContratacion(clienteActivo) {
  let cuerpoTabla = document.querySelector("#tblGestionContratacion");
  cuerpoTabla.innerHTML = "";

  let existeContratacionPendiente =
    sistema.verificarSiContratacionEsPendiente(clienteActivo);
  if (!existeContratacionPendiente) {
    mostrarMsj(
      "msjSinContratacionesPendientes",
      "No existen contrataciones pendientes"
    );
  }

  for (let i = 0; i < sistema.contrataciones.length; i++) {
    let contratacion = sistema.contrataciones[i];

    if (contratacion.cliente.idUsuario === clienteActivo.idUsuario) {
      let idPaseador = contratacion.paseador.idPaseador;
      let estado = contratacion.statusContratacion;
      let idContratacion = contratacion.idContratacion;

      let paseadorNombre = "";
      for (let j = 0; j < sistema.paseadores.length; j++) {
        if (sistema.paseadores[j].idPaseador === idPaseador) {
          paseadorNombre = sistema.paseadores[j].nombre;
          break;
        }
      }

      if (paseadorNombre !== "" && estado !== "") {
        let fila = `<tr>
    <td>${paseadorNombre}</td>
    <td>${estado}</td>`;

        if (estado === "pendiente") {
          fila += `
      <td>
        <input type="button" value="CANCELAR" class="btnCancelar" data-id="${idContratacion}">
      </td>`;
        } else {
          fila += `<td></td>`;
        }

        fila += `</tr>`;
        cuerpoTabla.innerHTML += fila;
      }
    }
  }

  let botonesCancelar = document.querySelectorAll(".btnCancelar");
  for (let i = 0; i < botonesCancelar.length; i++) {
    botonesCancelar[i].addEventListener("click", cancelarContratacion);
  }
}

//------------------------SECCION LISTADO DE PASEADORES------------------------
function listarPaseadores() {
  let cuerpoTabla = document.querySelector("#tblListadoPaseadores");
  cuerpoTabla.innerHTML = "";

  let paseadorNombre = "";
  let perrosAsignados = 0;

  for (let i = 0; i < sistema.paseadores.length; i++) {
    let paseador = sistema.paseadores[i];

    paseadorNombre = sistema.paseadores[i].nombre;
    perrosAsignados = sistema.cantidadPerrosAsignados(paseador.idPaseador);
    if (paseadorNombre !== "" && perrosAsignados !== "") {
      cuerpoTabla.innerHTML += ` 
        <tr>
        <td>${paseadorNombre}</td>
        <td>${perrosAsignados}</td>
        </tr>`;
    }
  }
}
//------------------------SECCION LISTADO PERROS ASIGNADOS--------------------------
function listarPerrosAsignados() {
  const cuerpoTabla = document.querySelector("#tblPerrosAsignados");
  const info = document.querySelector("#infoPerrosAsignados");

  cuerpoTabla.innerHTML = ""; // Limpiar la tabla
  info.innerHTML = "";        // Limpiar el mensaje

  const paseador = sistema.obtenerObjeto(sistema.paseadores, "idPaseador", usuarioLogueado.idPaseador);

  let cuposOcupados = 0;
  let tienePerrosAsignados = false;

  for (let contratacion of sistema.contrataciones) {
    if (
      contratacion.statusContratacion === "confirmada" &&
      contratacion.paseador.idPaseador === paseador.idPaseador
    ) {
      const cliente = contratacion.cliente;

      cuerpoTabla.innerHTML += `
        <tr>
          <td>${cliente.nombrePerro}</td>
          <td>${cliente.tamanioPerro}</td>
        </tr>
      `;

      cuposOcupados += sistema.calcCuposConsumePerroCliente(cliente.tamanioPerro);
      tienePerrosAsignados = true;
    }
  }

if (tienePerrosAsignados) {
  const cuposMaximos = paseador.cupos;
  const porcentaje = Math.round((cuposOcupados / cuposMaximos) * 100);

  info.innerHTML = `
    <strong>Cupos ocupados:</strong> ${cuposOcupados}<br>
    <strong>Cupos máximos:</strong> ${cuposMaximos}<br>
    <strong>Porcentaje asignado:</strong> ${porcentaje}%
  `;
} else {
  info.innerHTML = `<strong>No hay perros asignados actualmente.</strong>`;
}
}


// -----------------------        PASEADORES        -------------------------
// -----------------------TABLA GESTION DE CLIENTES -------------------------
function gestionarClientes(usuarioLogueado) {
  const cuerpoTabla = document.querySelector("#tblGestionParaPaseadores");
  cuerpoTabla.innerHTML = "";

  // Mostrar cupos disponibles
  const cuposDisponibles = sistema.tieneCupoDisponible(
    usuarioLogueado.idPaseador,
    usuarioLogueado.cupos
  );

  if (cuposDisponibles > 0) {
    mostrarMsj(
      "msjCantidadCupos",
      `Cupos disponibles: ${cuposDisponibles}/${usuarioLogueado.cupos}`
    );
  } else {
    mostrarMsj("msjCantidadCupos", "No tienes más lugares en tu camioneta");
  }

  for (let i = 0; i < sistema.contrataciones.length; i++) {
    const contratacion = sistema.contrataciones[i];
    const cliente = contratacion.cliente;
    const paseador = contratacion.paseador;

    const contratacionValida =
      cliente &&
      paseador &&
      paseador.idPaseador === usuarioLogueado.idPaseador &&
      cliente.usuario &&
      cliente.nombrePerro &&
      cliente.tamanioPerro;

    if (contratacionValida) {
      const idContratacion = contratacion.idContratacion;
      const estado = contratacion.statusContratacion;
      const idCliente = cliente.idUsuario;
      const clienteNombre = cliente.usuario;
      const nombrePerro = cliente.nombrePerro;
      const tamanioPerro = cliente.tamanioPerro;

      let fila = `
        <tr>
          <td>${clienteNombre}</td>
          <td>${nombrePerro}</td>
          <td>${tamanioPerro}</td>
      `;

      if (estado === "confirmada") {
        fila += `<td colspan="2">Solicitud confirmada</td>`;
      } else if (estado === "pendiente") {
        fila += `
          <td colspan="2">
            <input type="button" value="Procesar" class="btnProcesar"
              data-contratacion="${idContratacion}"
              data-cliente="${idCliente}"
              data-tamanio="${tamanioPerro}">
          </td>`;
      } else if (estado === "rechazada") {
        fila += `<td colspan="2">Solicitud rechazada</td>`;
       }else if(estado === "cancelada"){
         fila += `<td colspan="2">Solicitud cancelada</td>`;
        } 
      fila += `</tr>`;
      cuerpoTabla.innerHTML += fila;
    }
  }

  // Asignar eventos a los botones "Procesar"
  const botonesProcesar = document.querySelectorAll(".btnProcesar");
  for (let i = 0; i < botonesProcesar.length; i++) {
    botonesProcesar[i].addEventListener("click", function () {
      const idContratacion = Number(this.getAttribute("data-contratacion"));
      const idCliente = Number(this.getAttribute("data-cliente"));
      const tamanioPerro = this.getAttribute("data-tamanio");

      sistema.procesarSolicitud(idContratacion, idCliente, tamanioPerro);
      gestionarClientes(usuarioLogueado);
    });
  }
}




// -----------------------NAVEGACIÓN-----------------------------------

//OCULTAR SECCION
function ocultarSeccion() {
  let secciones = document.querySelectorAll(".seccion");
  for (let i = 0; i < secciones.length; i++) {
    secciones[i].style.display = "none";
  }
}

//MOSTRAR SECCION
function mostrarSeccion() {
  ocultarSeccion();
  let idBtn = this.getAttribute("id");
  switch (idBtn) {
    case "btnSeccionLogin":
      document.querySelector("#seccionLogin").style.display = "block";
      break;
    case "btnSeccionRegistro":
      document.querySelector("#seccionRegistro").style.display = "block";
      break;
    case "btnSeccionContratar":
      document.querySelector("#seccionContrataciones").style.display = "block";
      break;
    case "btnMisContrataciones":
      document.querySelector("#seccionGestionContratacion").style.display =
        "block";
      break;
    case "btnSeccionListadoPaseadores":
      document.querySelector("#seccionListadoPaseadores").style.display =
        "block";
      break;
    case "btnSeccionListadoPerrosAsignados":
        document.querySelector('#seccionListadoPerrosAsignados').style.display = 'block';
  }
}

//MOSTRAR BOTONERA
function mostrarBotones(tipo) {
  ocultarBotones();
  let botonesMostrar = document.querySelectorAll("." + tipo);
  for (let i = 0; i < botonesMostrar.length; i++) {
    const botonMostrar = botonesMostrar[i];
    botonMostrar.style.display = "block";
  }
}

//OCULTAR BOTONERA
function ocultarBotones() {
  let botonesOcultar = document.querySelectorAll(".btnSeccion");
  for (let i = 0; i < botonesOcultar.length; i++) {
    const botonOcultar = botonesOcultar[i];
    botonOcultar.style.display = "none";
  }
}
//MOSTRAR EL MENU OCULTANDO LOGIN Y REGISTRO PARA CUANDO EL USUARIO ESTÉ LOGUEADO
function mostrarMenuOcultandoLoginYregistro(usuarioLogueado) {
  ocultarSeccion();
  ocultarBotones();

  if (usuarioLogueado.tipoUsuario === "cliente") {
    document.querySelector("#seccionContrataciones").style.display = "block";
    mostrarBotones("cliente");
  } else if (usuarioLogueado.tipoUsuario === "paseador") {
    // Mostrar alguna sección específica para paseadores si querés
    mostrarBotones("paseador");
    document.querySelector("#seccionGestionParaPaseadores").style.display =
      "block";
  }
  document.querySelector("#seccionLogin").style.display = "none";
  document.querySelector("#seccionRegistro").style.display = "none";
  document.querySelector("#nombreUsuarioLogueado").style.display = "block";
  document.querySelector("#nombreUsuarioLogueado").innerHTML =
    usuarioLogueado.usuario;
}
//LIMPIAR CAMPOS DEL LOGIN
function limpiarRegistro() {
  document.querySelector("#txtUsuario").value = "";
  document.querySelector("#txtContrasenia").value = "";
  document.querySelector("#txtNombrePerro").value = "";
}
//CANCELAR CONTRATACION
function cancelarContratacion() {
  let id = Number(this.getAttribute("data-id"));
  let mensaje = sistema.cancelarContratacion(id);
  mostrarMsj("msjCancelacionContratacion", mensaje);
  gestorContratacion(usuarioLogueado); // Refrescar la tabla
  mostrarMsj("msjSinContratacionesPendientes", "");
}
