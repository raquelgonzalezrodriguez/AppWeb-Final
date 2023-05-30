function redirectToUserLineasPage() {
  window.location.href = "linea.html";
};
function redirectToAutobusesPage() {
  window.location.href = "autobus.html";
};
function redirectToUserConductoresPage() {
  window.location.href = "conductor.html";
};
function redirectToRutinasPage() {
  window.location.href = "rutina.html";
};
function redirectToViajesPage() {
  window.location.href = "viaje.html";
};

function formatearFechaActual(fechaISO) {
  const fecha = new Date(fechaISO);
  const year = fecha.getFullYear();
  const month = String(fecha.getMonth() + 1).padStart(2, '0');
  const day = String(fecha.getDate()).padStart(2, '0');
  const fechaFormateada = `${day}-${month}-${year}`;
  return fechaFormateada;
};

function formatearFechaViaje(fechaISO) {
  const fecha = new Date(fechaISO);
  const year = fecha.getFullYear();
  const month = String(fecha.getMonth() + 1).padStart(2, '0');
  const day = String(fecha.getDate()).padStart(2, '0');
  const fechaFormateada = `${year}-${month}-${day}`;
  return fechaFormateada;
};

/*-------------------- RELLENAR VIAJES --------------------*/
const getRutinasDisponibles = async () => {
  const response = await fetch('http://127.0.0.1:3000/admin/rutinas');
  const data = await response.json();
  return data;
};

async function createViaje(fecha, hora, linea, asientoN, asientoE, asientoSR) {
  const formData = {};
  formData['FECHA'] = fecha;
  formData['HORA_SALIDA'] = hora;
  formData['ID_LINEA'] = linea;
  formData['N_ASIENTOS'] = asientoN;
  formData['N_ASIENTOS_ESPECIALES'] = asientoE;
  formData['N_ASIENTOS_SR'] = asientoSR;

  const response = await fetch(`http://127.0.0.1:3000/admin/viaje`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });
  console.log("HE LLEGADO AQUI -----");
  const data = await response.json();
  return data;
};

async function rellenarViajes(){
  console.log("entro");
  // Obtener la fecha actual
  var currentDate = new Date();

  // Definir la fecha de inicio y fin para los próximos 2 meses
  var startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
  startDate.setDate(startDate.getDate() + 1); // Sumar 1 día para empezar desde mañana
  var endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 2, 0); // 1 MES mas

  var weekdays = [1, 2, 3, 4, 5];

  var rutinas = await getRutinasDisponibles();
   
  console.log("currentDate1: "+formatearFechaViaje(currentDate));
  console.log("endDate1: "+formatearFechaViaje(endDate));

  // Recorrer cada día en el rango de fechas
  var currentDate = startDate;
  while (currentDate <= endDate) {
    if (weekdays.includes(currentDate.getDay())) {

      // Recorrer cada rutina y crear un viaje para ese día
      for (var i = 0; i < rutinas.length; i++) {
        var rutina = rutinas[i];

        var fecha = formatearFechaViaje(currentDate);
        var hora = rutina.HORA_SALIDA;
        var linea = rutina.ID_LINEA;
        var autobus = await getAutobusByID(rutina.ID_AUTOBUS);
        var asientoN = autobus.N_ASIENTOS;
        var asientoE = autobus.N_ASIENTOS_ESPECIALES;
        var asientoSR = autobus.N_ASIENTOS_SR;

        console.log("CREATE VIAJE: ");
        console.log("fecha: "+fecha);
        console.log("hora: "+hora);
        console.log("linea: "+linea);
        console.log("asientoN: "+asientoN);
        console.log("asientoE: "+asientoE);
        console.log("asientoSR: "+asientoSR);

        // Crear un nuevo objeto de viaje con los datos correspondientes
        await createViaje(fecha, hora, linea, asientoN, asientoE, asientoSR);
        console.log("viaje creado");
      };
    };
    // Avanzar al siguiente día
    currentDate.setDate(currentDate.getDate() + 1);
  };
};
// ESTO HAY QUE VOLVER A HACERLO CUANDO SE TENGAN TODOS LOS DATOS DE LA BASE DE DATOS 
//CORRECTAMENTE, BORRAR TODA LA TABLA Y VOLVER A GENERAR LA DEL MES ENTERO OTRA VEZ
//rellenarViajes();
/*-------------------- GET'S ESPECIFICOS --------------------*/

async function getLineaByID(ID_LINEA) {
  const response = await fetch(`http://127.0.0.1:3000/admin/linea/${ID_LINEA}`);
  const data = await response.json();
  return data;
};

async function getAutobusByID(ID_AUTOBUS) {
  const response = await fetch(`http://127.0.0.1:3000/admin/autobus/${ID_AUTOBUS}`);
  const data = await response.json();
  return data;
};

async function getAutobusesXlinea(ID_LINEA) {
  const response = await fetch(`http://127.0.0.1:3000/admin/autobusesxlinea/${ID_LINEA}`);
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

const getAutobusesDisponibles = async () => {
  const response = await fetch('http://127.0.0.1:3000/admin/autobuses');
  const data = await response.json();
  return data;
};

const getConductoresDisponibles = async () => {
  const response = await fetch('http://127.0.0.1:3000/admin/conductores');
  const data = await response.json();
  return data;
};

const getConductoresSinAutobusAsignadoDisponibles = async () => {
  const response = await fetch('http://127.0.0.1:3000/admin/conductoressinautobusasignado');
  const data = await response.json();
  return data;
};


/*-------------------- DESPLEGABLES --------------------*/

function desplegableLineas(lineas, select) {
  select.innerHTML = ""; // Limpiar el contenido existente del select
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

function desplegableAutobuses(autobuses, select) {
  select.innerHTML = ""; // Limpiar el contenido existente del select
  const option = document.createElement('option');
  option.value = "";
  option.text = "";
  select.appendChild(option);

  autobuses.forEach(autobus => {
    const option = document.createElement('option');
    option.value = autobus.ID_AUTOBUS;
    option.text = autobus.ID_AUTOBUS;
    select.appendChild(option);
  });
  return select;
};

function desplegableConductores(conductores, select) {
  select.innerHTML = ""; // Limpiar el contenido existente del select
  const option = document.createElement('option');
  option.value = "";
  option.text = "";
  select.appendChild(option);

  conductores.forEach(conductor => {
    const option = document.createElement('option');
    option.value = conductor.ID_CONDUCTOR;
    option.text = conductor.ID_CONDUCTOR;
    select.appendChild(option);
  });
  return select;
};

function desplegableRutinas(rutinas, select) {
  select.innerHTML = ""; // Limpiar el contenido existente del select
  const option = document.createElement('option');
  option.value = "";
  option.text = "";
  select.appendChild(option);

  rutinas.forEach(rutina => {
    const option = document.createElement('option');
    option.value = rutina.ID_RUTINA;
    option.text = rutina.ID_RUTINA;
    select.appendChild(option);
  });
  return select;
};

function desplegableTipoMotor (select){
  select.innerHTML = ""; // Limpiar el contenido existente del select
  const option2 = document.createElement('option');
  option2.value = "";
  option2.text = "";
  select.appendChild(option2);

  var opciones = ["ELECTRICO", "GASOLINA", "DIESEL", "GAS"];
  for (var i = 0; i < opciones.length; i++) {
    var option = document.createElement("option");
    option.value = opciones[i];
    option.text = opciones[i];
    select.appendChild(option);
  };
  return select;
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
    //console.log("Hora:", horaActual);
  };
};

/*-------------------- IDENTIFICADORES EXISTENTES --------------------*/

async function idLineaExiste(idLinea) {
  const response = await fetch(`http://127.0.0.1:3000/admin/linea/${idLinea}`, {
    method: 'GET',
  });
  if (response.ok) {
    return true;
  } else if (response.status === 404) {
    return false;
  };
};

async function idAutobusExiste(idAutobus) {
  const response = await fetch(`http://127.0.0.1:3000/admin/autobus/${idAutobus}`, {
    method: 'GET',
  });
  if (response.ok) {
    return true;
  } else if (response.status === 404) {
    return false;
  };
};

async function idConductorExiste(idConductor) {
  const response = await fetch(`http://127.0.0.1:3000/admin/conductor/${idConductor}`, {
    method: 'GET',
  });
  if (response.ok) {
    return true;
  } else if (response.status === 404) {
    return false;
  };
};

/*-------------------- ACTUALIZAR INFO --------------------*/

function eliminarInformacionMostrada() {
  const elementos = [ "textoGetLinea", "textoGetLineas", 
                      "textoGetAutobus", "textoGetAutobuses", "textoGetAutobusesXlinea",
                      "textoGetConductor", "textoGetConductores" ];

  for (let i = 0; i < elementos.length; i++) {
    const elemento = elementos[i];
    document.getElementById(elemento).innerHTML = "";
  }
};

const actualizarDesplegableLineas = async () => {
  const lineasDisponibles = await getLineasDisponibles();
  let selectIds = [ "ID_LINEAS_GET_LINEA", "ID_LINEAS_PUT_LINEA", "ID_LINEAS_DELETE_LINEA",
                     "ID_LINEAS_GET_AUTOBUS", "ID_LINEAS_POST_AUTOBUS", "ID_LINEAS_PUT_AUTOBUS",
                     "ID_LINEAS_POST_RUTINA", "ID_LINEAS_PUT_RUTINA" ];

  for (let i = 0; i < selectIds.length; i++) {
    let selectId = selectIds[i];
    let select = document.getElementById(selectId);
    select = desplegableLineas(lineasDisponibles, select);
  };
};

const actualizarDesplegableAutobuses = async () => {
  const autobusesDisponibles = await getAutobusesDisponibles();
  let selectIds = [ "ID_AUTOBUSES_GET_AUTOBUS", "ID_AUTOBUSES_PUT_AUTOBUS", "ID_AUTOBUSES_DELETE_AUTOBUS",
                    "ID_AUTOBUS_POST_RUTINA", "ID_AUTOBUS_PUT_RUTINA" ];

  for (let i = 0; i < selectIds.length; i++) {
    let selectId = selectIds[i];
    let select = document.getElementById(selectId);
    select = desplegableAutobuses(autobusesDisponibles, select);
  };
};

/*const actualizarDesplegableAutobusesXLinea = async () => {
  const autobusesDisponibles = await getAutobusesDisponibles();
  let selectIds = ["ID_AUTOBUS_POST_RUTINA", "ID_AUTOBUS_PUT_RUTINA" ];

  for (let i = 0; i < selectIds.length; i++) {
    let selectId = selectIds[i];
    let select = document.getElementById(selectId);
    select = desplegableAutobuses(autobusesDisponibles, select);
  };
};*/

const actualizarDesplegableConductores = async () => {
  const conductoresDisponibles = await getConductoresDisponibles();
  let selectIds = [ "ID_CONDUCTORES_GET_CONDUCTOR", "ID_CONDUCTORES_PUT_CONDUCTOR", "ID_CONDUCTORES_DELETE_CONDUCTOR" ];

  for (let i = 0; i < selectIds.length; i++) {
    let selectId = selectIds[i];
    let select = document.getElementById(selectId);
    select = desplegableConductores(conductoresDisponibles, select);
  };
};

const actualizarDesplegableConductoresSinAutobusAsignado = async () => {
  const conductoresDisponibles = await getConductoresSinAutobusAsignadoDisponibles();
  let selectIds = [ "ID_CONDUCTORES_POST_AUTOBUS", "ID_CONDUCTORES_PUT_AUTOBUS" ];

  for (let i = 0; i < selectIds.length; i++) {
    let selectId = selectIds[i];
    let select = document.getElementById(selectId);
    select = desplegableConductores(conductoresDisponibles, select);
  };
};

const actualizarDesplegableRutinas = async () => {
  const rutinasDisponibles = await getRutinasDisponibles();
  let selectIds = [ "ID_RUTINAS_GET_RUTINA", "ID_RUTINAS_PUT_RUTINA", "ID_RUTINAS_DELETE_RUTINA" ];

  for (let i = 0; i < selectIds.length; i++) {
    let selectId = selectIds[i];
    let select = document.getElementById(selectId);
    select = desplegableRutinas(rutinasDisponibles, select);
  };
};


/***************************************** GET *****************************************/

const formGetUnElements = [
    { id: 'getLinea', url: 'linea', target: 'textoGetLinea' },
    { id: 'getAutobus', url: 'autobus', target: 'textoGetAutobus'},
    { id: 'getAutobusesXlinea', url: 'autobusesxlinea', target: 'textoGetAutobusesXlinea'},
    { id: 'getConductor', url: 'conductor', target: 'textoGetConductor' },
    { id: 'getRutina', url: 'rutina', target: 'textoGetRutina' }
  ];
   
  formGetUnElements.forEach(async formElement => {
    const form = document.getElementById(formElement.id);
    const lineasDisponibles = await getLineasDisponibles();
    const autobusesDisponibles = await getAutobusesDisponibles();
    const conductoresDisponibles = await getConductoresDisponibles();
    const rutinasDisponibles = await getRutinasDisponibles();

    let elementoSelect;

    if (formElement.id === 'getLinea'){
      var select = document.getElementById("ID_LINEAS_GET_LINEA");
      elementoSelect = desplegableLineas(lineasDisponibles, select);
    } else if (formElement.id === 'getAutobus'){
      var select = document.getElementById("ID_AUTOBUSES_GET_AUTOBUS");
      elementoSelect = desplegableAutobuses(autobusesDisponibles, select);
    }else if (formElement.id === 'getAutobusesXlinea'){
      var select = document.getElementById("ID_LINEAS_GET_AUTOBUS");
      elementoSelect = desplegableLineas(lineasDisponibles, select);
    }else if (formElement.id === 'getConductor'){
      var select = document.getElementById("ID_CONDUCTORES_GET_CONDUCTOR");
      elementoSelect = desplegableConductores(conductoresDisponibles, select);
    }else if (formElement.id === 'getRutina'){
      var select = document.getElementById("ID_RUTINAS_GET_RUTINA");
      elementoSelect = desplegableRutinas(rutinasDisponibles, select);
    };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      let message = '';
      const formid = elementoSelect.value;
      if (formid.trim() === '') {
        alert('El identificador no puede estar vacío.');
        return;
      };

      await fetch(`http://127.0.0.1:3000/admin/${formElement.url}/${formid}`, {
        method: 'GET',
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message) {
            message = data.message;
          } else {
            message = generateGetMessage(formElement, data);
          }
        });
  
      document.getElementById(formElement.target).innerHTML = message;
    });
  });

  const formGetVariosElements = [
    { id: 'getLineas', url: 'lineas', target: 'textoGetLineas' },
    { id: 'getAutobuses', url: 'autobuses', target: 'textoGetAutobuses' },
    { id: 'getConductores', url: 'conductores', target: 'textoGetConductores' },
    { id: 'getRutinas', url: 'rutinas', target: 'textoGetRutinas' },
    { id: 'getViajes', url: 'viajes', target: 'textoGetViajes' }
  ];
   
  formGetVariosElements.forEach(formElement => {
    const form = document.getElementById(formElement.id);
  
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      let message = '';
  
      await fetch(`http://127.0.0.1:3000/admin/${formElement.url}`, {
        method: 'GET',
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message) {
            message = data.message;
          } else {
            message = generateGetMessage(formElement, data);
          }
        });
  
      document.getElementById(formElement.target).innerHTML = message;
    });
  });
  
  function generateGetMessage(formElement, data) {
    let message = '';
        // Generate the message based on the response data structure
    if (formElement.id === 'getLinea'){
      document.getElementById("textoGetLineas").innerHTML = "";
        message = `ID-Linea: ${data.ID_LINEA} | Origen: ${data.ORIGEN} | Destino: ${data.DESTINO} | Frecuencia: ${data.FRECUENCIA} min. | Hora-Inicio: ${data.HORA_INICIO} | Hora-Fin: ${data.HORA_FIN}`;

    }else if (formElement.id === 'getAutobus'){
      document.getElementById("textoGetAutobuses").innerHTML = "";
      document.getElementById("textoGetAutobusesXlinea").innerHTML = "";
        message = `ID-Autobus: ${data.ID_AUTOBUS} | ID-Linea: ${data.ID_LINEA} | ID-Conductor: ${data.ID_CONDUCTOR} | Tipo-Motor: ${data.TIPO_MOTOR} | N-Asientos: ${data.N_ASIENTOS} | N-Asientos-Especiales: ${data.N_ASIENTOS_ESPECIALES} | N-Asientos-Silla de Ruedas: ${data.N_ASIENTOS_SR}`;

    }else if (formElement.id === 'getConductor'){
      document.getElementById("textoGetConductores").innerHTML = "";
        message = `ID-Conductor: ${data.ID_CONDUCTOR} | Nombre: ${data.NOMBRE}`;

    }else if (formElement.id === 'getRutina'){
      document.getElementById("textoGetRutinas").innerHTML = "";
        message = `ID-Rutina: ${data.ID_RUTINA} | ID-Linea: ${data.ID_LINEA} | Hora-Salida: ${data.HORA_SALIDA} | ID-Autobus: ${data.ID_AUTOBUS}`;

    }else if (formElement.id === 'getLineas'){
      document.getElementById("textoGetLinea").innerHTML = "";
      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        message += `ID-Linea: ${item.ID_LINEA} | Origen: ${item.ORIGEN} | Destino: ${item.DESTINO} | Frecuencia: ${item.FRECUENCIA} min. | Hora-Inicio: ${item.HORA_INICIO} | Hora-Fin: ${item.HORA_FIN}<br><br>`;
      };
    }else if (formElement.id === 'getAutobuses'){
      document.getElementById("textoGetAutobus").innerHTML = "";
      document.getElementById("textoGetAutobusesXlinea").innerHTML = "";
      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        message += `ID-Autobus: ${item.ID_AUTOBUS} | ID-Linea: ${item.ID_LINEA} | ID-Conductor: ${item.ID_CONDUCTOR} | Tipo-Motor: ${item.TIPO_MOTOR} | N-Asientos: ${item.N_ASIENTOS} | N-Asientos-Especiales: ${item.N_ASIENTOS_ESPECIALES} | N-Asientos-Silla de Ruedas: ${item.N_ASIENTOS_SR}<br><br>`;
      };
    }else if (formElement.id === 'getAutobusesXlinea'){
      document.getElementById("textoGetAutobus").innerHTML = "";
      document.getElementById("textoGetAutobuses").innerHTML = "";
      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        message += `ID-Autobus: ${item.ID_AUTOBUS} | ID-Linea: ${item.ID_LINEA} | ID-Conductor: ${item.ID_CONDUCTOR} | Tipo-Motor: ${item.TIPO_MOTOR} | N-Asientos: ${item.N_ASIENTOS} | N-Asientos-Especiales: ${item.N_ASIENTOS_ESPECIALES} | N-Asientos-Silla de Ruedas: ${item.N_ASIENTOS_SR}<br><br>`;
      };
    }else if (formElement.id === 'getConductores'){
      document.getElementById("textoGetConductor").innerHTML = "";
      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        message += `ID-Conductor: ${item.ID_CONDUCTOR} | Nombre: ${item.NOMBRE}<br><br>`;
      };
    }else if (formElement.id === 'getRutinas'){
      document.getElementById("textoGetRutina").innerHTML = "";
      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        message += `ID-Rutina: ${item.ID_RUTINA} | ID-Linea: ${item.ID_LINEA} | Hora-Salida: ${item.HORA_SALIDA} | ID-Autobus: ${item.ID_AUTOBUS}<br><br>`;
      };
    }else if (formElement.id === 'getViajes'){
      document.getElementById("textoGetViajes").innerHTML = "";
      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        message += `ID-Viaje: ${item.ID_VIAJE} | Fecha: ${formatearFechaActual(item.FECHA)} | Hora-Salida: ${item.HORA_SALIDA} | ID-Linea: ${item.ID_LINEA} | N-Asientos: ${item.N_ASIENTOS} | N-Asientos-Especiales: ${item.N_ASIENTOS_ESPECIALES} | N-Asientos-Silla de Ruedas: ${item.N_ASIENTOS_SR}<br><br>`;
      };
    };
    return message;
  };
  
  
  /***************************************** POST *****************************************/
  
  const formPostElements = [
    { id: 'postLinea', url: 'linea', target: 'textoPostLinea', fields: ['ID_LINEA', 'ORIGEN', 'DESTINO', 'FRECUENCIA', 'HORA_INICIO', 'HORA_FIN'] },
    { id: 'postAutobus', url: 'autobus', target: 'textoPostAutobus', fields: ['ID_AUTOBUS', 'N_ASIENTOS', 'N_ASIENTOS_ESPECIALES', 'N_ASIENTOS_SR'] },
    { id: 'postConductor', url: 'conductor', target: 'textoPostConductor', fields: ['ID_CONDUCTOR', 'NOMBRE'] },
    { id: 'postRutina', url: 'rutina', target: 'textoPostRutina' }
];
  
  formPostElements.forEach(async formElement => {
    const form = document.getElementById(formElement.id);
    const lineasDisponibles = await getLineasDisponibles();
    const conductoresSinAutobusDisponibles = await getConductoresSinAutobusAsignadoDisponibles();
    let lineaSelect, conductorSelect, motorSelect, autobusSelect;

    if (formElement.id === 'postAutobus'){
      var selectL = document.getElementById("ID_LINEAS_POST_AUTOBUS");
      lineaSelect = desplegableLineas(lineasDisponibles, selectL);
      var selectC = document.getElementById("ID_CONDUCTORES_POST_AUTOBUS");
      conductorSelect = desplegableConductores(conductoresSinAutobusDisponibles, selectC);
      var selectM = document.getElementById("TIPO_MOTOR_POST_AUTOBUS");
      motorSelect = desplegableTipoMotor(selectM);
    } else if (formElement.id === 'postRutina'){
      var selectL = document.getElementById("ID_LINEAS_POST_RUTINA");
      lineaSelect = desplegableLineas(lineasDisponibles, selectL);
      var horaSeleccionada = document.getElementById('HORA_SALIDA_POST_RUTINA');
      var selectA = document.getElementById("ID_AUTOBUS_POST_RUTINA");
      lineaSelect.addEventListener('change', async () => {
        const selectedLinea = lineaSelect.value;
        await desplegableHora(selectedLinea, horaSeleccionada);
        var autobusesDisponibles = await getAutobusesXlinea(selectedLinea);
        autobusSelect = desplegableAutobuses(autobusesDisponibles, selectA);
      }); 
    };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      let message = '';
      let errorMessage = '';
      let shouldSubmit = true; // Variable de control
      let idLineaExistente, idAutobusExistente, idConductorExistente = false;
      const formData = {};
      if (formElement.id !== 'postRutina'){
        formElement.fields.forEach(field => {
          const fieldValue = e.target[field].value;
          formData[field] = fieldValue;
          if (!shouldSubmit) {
            return; // Salir de la función async
          };
          if (fieldValue.trim() === '') {
            alert('No puede haber campos vacíos.');
            shouldSubmit = false;
            return;
          };
        });
      };
      if (!shouldSubmit) {
        return; // Salir de la función async
      };
      console.log(formData);
      if (formElement.id === 'postLinea'){
        const idLinea = formData['ID_LINEA'];
        idLineaExistente = await idLineaExiste(idLinea);

      } else if (formElement.id === 'postAutobus'){
        formData['ID_LINEA'] = lineaSelect.value; // Agregar el valor seleccionado de ID_LINEA
        formData['ID_CONDUCTOR'] = conductorSelect.value;
        formData['TIPO_MOTOR'] = motorSelect.value;

        const idAutobus = formData['ID_AUTOBUS'];
        idAutobusExistente = await idAutobusExiste(idAutobus);

      } else if (formElement.id === 'postConductor'){
        const idConductor = formData['ID_CONDUCTOR'];
        idConductorExistente = await idConductorExiste(idConductor);

      } else if (formElement.id === 'postRutina'){
        formData['ID_LINEA'] = lineaSelect.value; // Agregar el valor seleccionado de ID_LINEA
        formData['HORA_SALIDA'] = horaSeleccionada.value; // Agregar el valor seleccionado de HORA
        formData['ID_AUTOBUS'] = autobusSelect.value;

      };

      // Comprobamos que los id no existen
      if (idLineaExistente || idAutobusExistente || idConductorExistente) {
        errorMessage += 'El Identificador ya existe en la base de datos. Por favor, elija otro.';
      };

      if (errorMessage !== '') {
        alert(errorMessage);
        return;
      };

      await fetch(`http://127.0.0.1:3000/admin/${formElement.url}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
        .then((response) => {
          if (response.status === 500) {
            alert('Los campos añadidos no son correctos, reviselo.');
            shouldSubmit = false;
            return;
          };
          return response.json();
        })
        .then((data) => {
          message = data.message;
        });

      document.getElementById(formElement.target).innerHTML = message;
      eliminarInformacionMostrada();
      actualizarDesplegableLineas();
      actualizarDesplegableAutobuses();
      actualizarDesplegableConductores();
      actualizarDesplegableRutinas();
      actualizarDesplegableConductoresSinAutobusAsignado();
      form.reset();
    });
  });

  /***************************************** PUT *****************************************/
  
  const formPutElements = [
    { id: 'putLinea', url: 'linea', target: 'textoPutLinea', fields: ['ORIGEN', 'DESTINO', 'FRECUENCIA', 'HORA_INICIO', 'HORA_FIN'] },
    { id: 'putAutobus', url: 'autobus', target: 'textoPutAutobus', fields: [ 'N_ASIENTOS', 'N_ASIENTOS_ESPECIALES', 'N_ASIENTOS_SR'] },
    { id: 'putConductor', url: 'conductor', target: 'textoPutConductor', fields: ['NOMBRE'] },
    { id: 'putRutina', url: 'rutina', target: 'textoPutRutina', fields: ['ID_LINEA', 'HORA_SALIDA', 'ID_AUTOBUS' ] }

  ];
  
  formPutElements.forEach(async formElement => {
    const form = document.getElementById(formElement.id);
    const lineasDisponibles = await getLineasDisponibles();
    const autobusesDisponibles = await getAutobusesDisponibles();
    const conductoresDisponibles = await getConductoresDisponibles();
    const conductoresSinAutobusDisponibles = await getConductoresSinAutobusAsignadoDisponibles();
    const rutinasDisponibles = await getRutinasDisponibles();

    let lineaSelect, autobusSelect, conductorSelect, motorSelect, rutinaSelect;

    
    if (formElement.id === 'putLinea'){
      var select = document.getElementById("ID_LINEAS_PUT_LINEA");
      lineaSelect = desplegableLineas(lineasDisponibles, select);
    } else if (formElement.id === 'putAutobus'){
      var selectA = document.getElementById("ID_AUTOBUSES_PUT_AUTOBUS");
      autobusSelect = desplegableAutobuses(autobusesDisponibles, selectA);
      var selectL = document.getElementById("ID_LINEAS_PUT_AUTOBUS");
      lineaSelect = desplegableLineas(lineasDisponibles, selectL);
      var selectC = document.getElementById("ID_CONDUCTORES_PUT_AUTOBUS");
      conductorSelect = desplegableConductores(conductoresSinAutobusDisponibles, selectC);
      var selectM = document.getElementById("TIPO_MOTOR_PUT_AUTOBUS");
      motorSelect = desplegableTipoMotor(selectM);
    } else if (formElement.id === 'putConductor'){
      var selectC = document.getElementById("ID_CONDUCTORES_PUT_CONDUCTOR");
      conductorSelect = desplegableConductores(conductoresDisponibles, selectC);
    }else if (formElement.id === 'putRutina'){
      var selectR = document.getElementById("ID_RUTINAS_PUT_RUTINA");
      rutinaSelect = desplegableRutinas(rutinasDisponibles, selectR);
      var selectL = document.getElementById("ID_LINEAS_PUT_RUTINA");
      lineaSelect = desplegableLineas(lineasDisponibles, selectL);
      var horaSeleccionada = document.getElementById('HORA_SALIDA_PUT_RUTINA');
      var selectA = document.getElementById("ID_AUTOBUS_PUT_RUTINA");
      lineaSelect.addEventListener('change', async () => {
        const selectedLinea = lineaSelect.value;
        await desplegableHora(selectedLinea, horaSeleccionada);
        var autobusesXlineaDisponibles = await getAutobusesXlinea(selectedLinea);
        autobusSelect = desplegableAutobuses(autobusesXlineaDisponibles, selectA);
      }); 
    };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      let message = '';
      let formid;
      let shouldSubmit = true; // Variable de control

      const formData = {};
      formElement.fields.forEach(field => {
        const fieldValue = e.target[field].value;
        formData[field] = fieldValue;
        if (formElement.id === 'putConductor' && fieldValue.trim() === '') {
          alert('El nombre no puede estar vacío.');
          shouldSubmit = false; // Actualizar la variable de control
          return;
        };
      });
      if (!shouldSubmit) {
        return; // Salir de la función async
      };

        if (formElement.id === 'putLinea'){
        formid = lineaSelect.value; // Agregar el valor seleccionado de ID_LINEA
      } else if (formElement.id === 'putAutobus'){
        formid = autobusSelect.value;
        formData['ID_LINEA'] = lineaSelect.value;
        formData['ID_CONDUCTOR'] = conductorSelect.value;
        formData['TIPO_MOTOR'] = motorSelect.value;
      } else if (formElement.id === 'putConductor'){
        formid = conductorSelect.value;
      }else if (formElement.id === 'putRutina'){
        formid = rutinaSelect.value;
        formData['ID_LINEA'] = lineaSelect.value;
        formData['HORA'] = horaSeleccionada.value;
        formData['ID_AUTOBUS'] = autobusSelect.value;
      };

      if (formid.trim() === '') {
        alert('El identificador no puede estar vacío.');
        return;
      };

      await fetch(`http://127.0.0.1:3000/admin/${formElement.url}/${formid}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      .then((response) => {
        if (response.status === 500) {
          alert('Los campos añadidos no son correctos, introduzca el tipo de dato correcto.');
          shouldSubmit = false;
          return;
        };
        return response.json();
      })
      .then((data) => {
        message = data.message;
      });
      document.getElementById(formElement.target).innerHTML = message;
      eliminarInformacionMostrada();
      actualizarDesplegableLineas();
      actualizarDesplegableAutobuses();
      actualizarDesplegableConductores();
      actualizarDesplegableRutinas();

      actualizarDesplegableConductoresSinAutobusAsignado();
      form.reset();
    });
  });

  
  
  /***************************************** DELETE *****************************************/
  
  const formDeleteElements = [
    { id: 'deleteLinea', url: 'linea', target: 'textoDeleteLinea' },
    { id: 'deleteAutobus', url: 'autobus', target: 'textoDeleteAutobus' },
    { id: 'deleteConductor', url: 'conductor', target: 'textoDeleteConductor' },
    { id: 'deleteRutina', url: 'rutina', target: 'textoDeleteRutina' }
  ];
  
  formDeleteElements.forEach(async formElement => {
    const form = document.getElementById(formElement.id);
    const lineasDisponibles = await getLineasDisponibles();
    const autobusesDisponibles = await getAutobusesDisponibles();
    const conductoresDisponibles = await getConductoresDisponibles();
    const rutinasDisponibles = await getRutinasDisponibles();
    let elementoSelect;

    if (formElement.id === 'deleteLinea'){
      var select = document.getElementById("ID_LINEAS_DELETE_LINEA");
      elementoSelect = desplegableLineas(lineasDisponibles, select);
    } else if (formElement.id === 'deleteAutobus'){
      var select = document.getElementById("ID_AUTOBUSES_DELETE_AUTOBUS");
      elementoSelect = desplegableAutobuses(autobusesDisponibles, select);
    }else if (formElement.id === 'deleteConductor'){
      var select = document.getElementById("ID_CONDUCTORES_DELETE_CONDUCTOR");
      elementoSelect = desplegableConductores(conductoresDisponibles, select);
    }else if (formElement.id === 'deleteRutina'){
      var select = document.getElementById("ID_RUTINAS_DELETE_RUTINA");
      elementoSelect = desplegableRutinas(rutinasDisponibles, select);
    };
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      let message = '';
      const formid = elementoSelect.value;
      if (formid.trim() === '') {
        alert('El identificador no puede estar vacío.');
        return;
      };
      await fetch(`http://127.0.0.1:3000/admin/${formElement.url}/${formid}`, {
        method: 'DELETE',
      })
        .then((response) => response.json())
        .then((data) => {
            message = data.message;
        });
  
      document.getElementById(formElement.target).innerHTML = message;
      eliminarInformacionMostrada();
      actualizarDesplegableLineas();
      actualizarDesplegableAutobuses();
      actualizarDesplegableConductores();
      actualizarDesplegableRutinas();
      actualizarDesplegableConductoresSinAutobusAsignado();
      form.reset();
    });
  });
  
