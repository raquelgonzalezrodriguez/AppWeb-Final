// CONSULTA SQL:     
//INSERT INTO HISTORICO_RESERVAS( ID_RESERVA, ID_ESTUDIANTE, ID_LINEA, HORA, TIPO_ASIENTO, FECHA) VALUES ( '55', '47552294R', '1', '08:00:00', 'NORMAL', '2023-05-11');
function redirectToUserDatosPage() {
  window.location.href = "user-datospersonales.html";
};
function redirectToReservasPage() {
  window.location.href = "user-reservas.html";
};
/*-------------------- GET'S ESPECIFICOS --------------------*/

async function getLineaByID(ID_LINEA) {
  const response = await fetch(`http://127.0.0.1:3000/admin/linea/${ID_LINEA}`);
  const data = await response.json();
  return data;
};

async function getReservaByID(ID_RESERVA) {
  const response = await fetch(`http://127.0.0.1:3000/admin/reserva/${ID_RESERVA}`);
  const data = await response.json();
  return data;
};

async function getViajeByID(ID_VIAJE) {
  const response = await fetch(`http://127.0.0.1:3000/admin/viaje/${ID_VIAJE}`);
  const data = await response.json();
  return data;
};

async function reservaRepetida(HORA, FECHA, ID_ESTUDIANTE_IDENTIFICADO) {
  const response = await fetch(`http://127.0.0.1:3000/admin/reservarepetida/${HORA}:00/${FECHA}/${ID_ESTUDIANTE_IDENTIFICADO}`);
  const data = await response.json();
  return data;
};

const getLineasDisponibles = async () => {
  const response = await fetch('http://127.0.0.1:3000/admin/lineas');
  const data = await response.json();
 /*data.forEach((item) => {
    console.log(item);
  });*/
  return data;
};

const getReservasDisponibles = async () => {
  const ID_ESTUDIANTE_IDENTIFICADO = localStorage.getItem('ID_ESTUDIANTE');
  const response = await fetch(`http://127.0.0.1:3000/admin/reservaidentificado/${ID_ESTUDIANTE_IDENTIFICADO}`);
  const data = await response.json();
  return data;
};

/*-------------------- DESPLEGABLES --------------------*/
function desplegableLineas(lineas, select) {
  const option = document.createElement('option');
  option.value = "";
  option.text = "";
  select.appendChild(option);

  lineas.forEach(linea => {
    const option = document.createElement('option');
    option.value = linea.ID_LINEA;
    option.text = `${linea.ORIGEN} - ${linea.DESTINO}`;
    select.appendChild(option);
  });
  return select;
};

function desplegableReservas(reservas, select) {
  select.innerHTML = ""; // Limpiar el contenido existente del select

  const option = document.createElement('option');
  option.value = "";
  option.text = "";
  select.appendChild(option);

  reservas.forEach(reserva => {
    const option = document.createElement('option');
    option.value = reserva.ID_RESERVA;
    option.text = reserva.ID_RESERVA;
    select.appendChild(option);
  });
  return select;
};

function desplegableAsientos (campo){
  var select = document.getElementById(campo);
  const asientodefecto = localStorage.getItem('ASIENTO_DEFECTO');
  var option = document.createElement("option");
  option.value = asientodefecto;
  option.text = asientodefecto;
  select.appendChild(option);
  const option2 = document.createElement('option');
  option2.value = "";
  option2.text = "";
  select.appendChild(option2);

  var opciones = ["NORMAL", "ESPECIAL", "SR"];
  for (var i = 0; i < opciones.length; i++) {
    var option = document.createElement("option");
    option.value = opciones[i];
    option.text = opciones[i];
    select.appendChild(option);
  };

};

async function desplegableHora(selectedLinea, horaSeleccionada) {
  const lineaData = await getLineaByID(selectedLinea);

  const horaInicio = lineaData.HORA_INICIO; // Hora de inicio de la línea
  const horaFin = lineaData.HORA_FIN; // Hora de fin de la línea
  const frecuencia = lineaData.FRECUENCIA; // Frecuencia de la línea

  // Elimina todas las opciones de hora existentes
  horaSeleccionada.innerHTML = '';

  const fechaInicio = new Date(`2000-01-01T${horaInicio}`);
  const fechaFin = new Date(`2000-01-01T${horaFin}`);
  const frecuenciaSegundos = frecuencia * 60; // Convertir la frecuencia a segundos

  let horaActual = fechaInicio;

  while (horaActual <= fechaFin) {
    const option = document.createElement('option');
    const horaFormateada = horaActual.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    option.value = horaFormateada;
    option.text = horaFormateada;
    horaSeleccionada.appendChild(option);

    horaActual.setSeconds(horaActual.getSeconds() + frecuenciaSegundos);
  };
};

/*-------------------- ACTUALIZAR DESPLEGABLES --------------------*/
const actualizarDesplegableReservasDelete = async () => {
  const reservasDisponibles = await getReservasDisponibles();
  let select = document.getElementById("ID_RESERVA_DELETE"); // o el ID correspondiente
  select = desplegableReservas(reservasDisponibles, select);
};

const actualizarDesplegableReservasPut = async () => {
  const reservasDisponibles = await getReservasDisponibles();
  let select = document.getElementById("ID_RESERVA_PUT"); // o el ID correspondiente
  select = desplegableReservas(reservasDisponibles, select);
};

function actualizarReservas(){
  document.getElementById("textoGetReserva").innerHTML = "";
};

/*--------------------  FORMATEAR FECHAS --------------------*/
function formatearFechas (item){
    // Obtener la fecha en formato ISO 8601 (ejemplo: "4444-04-03T22:00:00.000Z")
    const fechaISO = item.FECHA;
    // Crear un objeto de fecha utilizando el valor ISO 8601
    const fecha = new Date(fechaISO);
    // Obtener los componentes de fecha individuales
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const day = String(fecha.getDate()).padStart(2, '0');
    // Crear la representación de la fecha en el formato deseado ("4444-04-03")
    const fechaFormateada = `${day}-${month}-${year}`;
    
    return fechaFormateada;
};

function formatearFechaActual(fechaISO) {
  const fecha = new Date(fechaISO);
  const year = fecha.getFullYear();
  const month = String(fecha.getMonth() + 1).padStart(2, '0');
  const day = String(fecha.getDate()).padStart(2, '0');
  const fechaFormateada = `${day}-${month}-${year}`;
  return fechaFormateada;
};

function formatearFechaHistorico(fechaISO) {
  const fecha = new Date(fechaISO);
  const year = fecha.getFullYear();
  const month = String(fecha.getMonth() + 1).padStart(2, '0');
  const day = String(fecha.getDate()).padStart(2, '0');
  const fechaFormateada = `${year}-${month}-${day}`;
  return fechaFormateada;
};
/*--------------------  LIMITAR CALENDARIO --------------------*/

function esFinDeSemana(date) {
  var dia = date.getDay(); // 0: Domingo, 1: Lunes, ..., 6: Sábado
  return dia === 0 || dia === 6;
};

function limitarCalendario(campo) {
  var fechaInput = document.getElementById(campo);

  // Configura el atributo "min" en el campo date para establecer la fecha mínima permitida
  var fechaMinima = new Date();
  fechaMinima.setDate(fechaMinima.getDate() + 1); // Configura la fecha mínima para mañana
  fechaInput.setAttribute("min", fechaMinima.toISOString().split("T")[0]);

  // Configura el atributo "max" en el campo date para establecer la fecha máxima permitida (3 meses desde la fecha actual)
  var fechaMaxima = new Date();
  fechaMaxima.setMonth(fechaMaxima.getMonth() + 3); // Configura la fecha máxima para 3 meses desde la fecha actual
  fechaInput.setAttribute("max", fechaMaxima.toISOString().split("T")[0]);

  // Agrega un evento al campo date para deshabilitar los días no laborables
  fechaInput.addEventListener("input", function () {
    var fechaSeleccionada = new Date(this.value);
    if (esFinDeSemana(fechaSeleccionada)) {
      this.value = ""; // Limpia la fecha si es un fin de semana
      alert("Por favor, selecciona un día laborable (de lunes a viernes).");
    }
  });
};

/*--------------------  HISTORICO DE RESERVAS --------------------*/

async function postReservaHistorica (reserva){
  const ID_RESERVA = reserva.ID_RESERVA;
  const ID_ESTUDIANTE = reserva.ID_ESTUDIANTE;
  const ID_LINEA = reserva.ID_LINEA;
  const HORA = reserva.HORA;
  const TIPO_ASIENTO = reserva.TIPO_ASIENTO;
  const FECHA = formatearFechaHistorico(reserva.FECHA);

  const response = await fetch(`http://127.0.0.1:3000/admin/reservahistorico`, {
    method: 'POST', 
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ID_RESERVA: ID_RESERVA, ID_ESTUDIANTE: ID_ESTUDIANTE, ID_LINEA: ID_LINEA, HORA: HORA, TIPO_ASIENTO: TIPO_ASIENTO, FECHA: FECHA }),
  });
  const data = await response.json();
  return data;
};

async function deleteReservaVencida (reserva){
  const ID_RESERVA = reserva.ID_RESERVA;

  const response = await fetch(`http://127.0.0.1:3000/admin/reserva/${ID_RESERVA}`, {
    method: 'DELETE', 
    body: JSON.stringify({ID_RESERVA: ID_RESERVA}),
  });
  const data = await response.json();
  return data;
};

async function moverHistoricoReservas (){
  const reservasDisponibles = await getReservasDisponibles();
  const fechaActual = new Date();
  const fechaActualISO = formatearFechaActual(fechaActual);
  let transaccionRealizada = false; 

  reservasDisponibles.forEach(async reserva => {
    const fechaReservaISO = formatearFechaActual(reserva.FECHA);
      // La fecha de reserva es anterior a la fecha actual
    if(fechaReservaISO < fechaActualISO){
      await deleteReservaVencida(reserva);
      await postReservaHistorica(reserva);
      transaccionRealizada = true;
    };
  });
  return transaccionRealizada;
};

/*--------------------  PLAZAS AUTOBUSES --------------------*/
async function viajeEncontrado(FECHA, HORA_SALIDA, ID_LINEA) {
  const response = await fetch(`http://127.0.0.1:3000/admin/viajeencontrado/${FECHA}/${HORA_SALIDA}:00/${ID_LINEA}`);
  const data = await response.json();
  return data;
};

async function viajeEncontrado2(FECHA, HORA_SALIDA, ID_LINEA) {
  const response = await fetch(`http://127.0.0.1:3000/admin/viajeencontrado/${FECHA}/${HORA_SALIDA}/${ID_LINEA}`);
  const data = await response.json();
  return data;
};

async function actualizarAsientosViajeNormal(ID_VIAJE, N_ASIENTOS) {
  const response = await fetch(`http://127.0.0.1:3000/admin/actualizarasientonormal/${ID_VIAJE}/${N_ASIENTOS}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    }
  });
  const data = await response.json();
  return data;
};

async function actualizarAsientosViajeEspecial(ID_VIAJE, N_ASIENTOS_ESPECIALES) {
  const response = await fetch(`http://127.0.0.1:3000/admin/actualizarasientoespecial/${ID_VIAJE}/${N_ASIENTOS_ESPECIALES}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    }
  });
  const data = await response.json();
  return data;
};

async function actualizarAsientosViajeSR(ID_VIAJE, N_ASIENTOS_SR) {
  const response = await fetch(`http://127.0.0.1:3000/admin/actualizarasientosr/${ID_VIAJE}/${N_ASIENTOS_SR}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    }
  });
  const data = await response.json();
  return data;
};

async function incrementarAsiento(viajes, tipoAsiento){
  for (const viaje of viajes) {
      if (tipoAsiento === 'NORMAL'){
        let asientoN = viaje.N_ASIENTOS + 1;
        await actualizarAsientosViajeNormal(viaje.ID_VIAJE,asientoN);
      } else if (tipoAsiento === 'ESPECIAL'){
        let asientoE = viaje.N_ASIENTOS_ESPECIALES + 1;
        await actualizarAsientosViajeEspecial(viaje.ID_VIAJE,asientoE);
      } else if (tipoAsiento === 'SR'){
        let asientoS = viaje.N_ASIENTOS_SR + 1;
        await actualizarAsientosViajeSR(viaje.ID_VIAJE,asientoS);
      };
  };
};

async function decrementarAsiento(viajes, tipoAsiento){
  let correcto = true;
  for (const viaje of viajes) {
    if (tipoAsiento === 'NORMAL'){
      if(viaje.N_ASIENTOS == 0){
        correcto = false;
        alert("Tipo de asiento completo. Cambie el tipo de asiento o el horario.");
        return;
      };
      let asientoN = viaje.N_ASIENTOS - 1;
      await actualizarAsientosViajeNormal(viaje.ID_VIAJE,asientoN);
    } else if (tipoAsiento === 'ESPECIAL'){
      if(viaje.N_ASIENTOS_ESPECIALES == 0){
        correcto = false;
        alert("Tipo de asiento completo. Cambie el tipo de asiento o el horario.");
        return;
      };
      let asientoE = viaje.N_ASIENTOS_ESPECIALES - 1;
      await actualizarAsientosViajeEspecial(viaje.ID_VIAJE,asientoE);
    } else if (tipoAsiento === 'SR'){
      if(viaje.N_ASIENTOS_SR == 0){
        correcto = false;
        alert("Tipo de asiento completo. Cambie el tipo de asiento o el horario.");
        return;
      };
      let asientoS = viaje.N_ASIENTOS_SR - 1;
      await actualizarAsientosViajeSR(viaje.ID_VIAJE,asientoS);
    };
  };
  return correcto;
};

  
/***************************************** POST *****************************************/

const formPostReserva = [
  { id: 'postReserva', url: 'reserva', target: 'textoPostReserva', fields: [ 'TIPO_ASIENTO', 'FECHA'] }
];

formPostReserva.forEach(async formElement => {
  const form = document.getElementById(formElement.id);
  var select = document.getElementById("ID_LINEAS");
  const horaSeleccionada = document.getElementById('HORA');

  limitarCalendario("FECHA");
  //Desplegable Asientos
  desplegableAsientos("TIPO_ASIENTO");
    //Desplegable Lineas
  const lineasDisponibles = await getLineasDisponibles();
  const lineaSelect = desplegableLineas(lineasDisponibles, select);

  // Agregar evento de cambio (horas) al desplegable de ID de línea
  lineaSelect.addEventListener('change', async () => {
    const selectedLinea = lineaSelect.value;
    await desplegableHora(selectedLinea, horaSeleccionada);
  });     

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    let message = '';

    // COMPROBACION: No puede haber campos vacío
    const formData = {};
    formElement.fields.forEach(field => {
      const fieldValue = e.target[field].value;
      formData[field] = fieldValue;
      if (fieldValue.trim() === '') {
        alert('No puede haber campos vacío.');
        return;
      };
    });
      
     const ID_ESTUDIANTE_IDENTIFICADO = localStorage.getItem('ID_ESTUDIANTE');
     formData['ID_ESTUDIANTE'] = ID_ESTUDIANTE_IDENTIFICADO;
     formData['ID_LINEA'] = lineaSelect.value; // Agregar el valor seleccionado de ID_LINEA
     formData['HORA'] = horaSeleccionada.value; // Agregar el valor seleccionado de HORA

     //COMPROBACION: No reservas repetidas en fecha y hora
     let HORA = horaSeleccionada.value;
     let FECHA = e.target.FECHA.value;
     const reservasRepetidas = await reservaRepetida(HORA, FECHA, ID_ESTUDIANTE_IDENTIFICADO);
     if (reservasRepetidas.length >= 1){
      alert('No puede crear reservas con fecha y hora idénticas.');
      return;
     };

    // COMPROBACION: solo 5 reservas por estudiante
     const reservasDisponibles = await getReservasDisponibles();
     if (reservasDisponibles.length >= 5){
      alert('Solo puede tener 5 reservas activas, elimine alguna.');
      return;
     };

     const tipoAsiento = e.target.TIPO_ASIENTO.value;
     let viaje = await viajeEncontrado(FECHA, HORA, lineaSelect.value);
      if(!await decrementarAsiento(viaje, tipoAsiento)){
        return;
      };

     await fetch(`http://127.0.0.1:3000/admin/${formElement.url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        message = data.message;
      });

    document.getElementById(formElement.target).innerHTML = message;
    actualizarDesplegableReservasDelete();
    actualizarDesplegableReservasPut();
    actualizarReservas();
    form.reset();
  });
});


