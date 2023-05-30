function redirectToUserPage() {
  window.location.href = "user.html";
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
  
    
  /***************************************** GET *****************************************/
  
  const formGetElements = [
    { id: 'getReservas', url: 'reservaidentificado', target: 'textoGetReserva' },
    { id: 'getHistoricoReservas', url: 'historicoreservasidentificado', target: 'textoGetHistoricoReservas' }
  
  ];
  
  formGetElements.forEach(formElement => {
    const form = document.getElementById(formElement.id);
  
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      let message = '';
       await moverHistoricoReservas();
  
      const ID_ESTUDIANTE_IDENTIFICADO = localStorage.getItem('ID_ESTUDIANTE');
  
      await fetch(`http://127.0.0.1:3000/admin/${formElement.url}/${ID_ESTUDIANTE_IDENTIFICADO}`, {
        method: 'GET',
      })
        .then((response) => response.json())
        .then(async (data) => {
          if (data.message) {
            message = data.message;
          } else {
            message = await generateGetMessage(formElement, data);       
          }
        });
  
      document.getElementById(formElement.target).innerHTML = message;
      //actualizarReservas();
    });
  });
  
  async function generateGetMessage(formElement, data) {
    let message = '';
        // Generate the message based on the response data structure
     if (formElement.id === 'getReservas'){
      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        const lineaData = await getLineaByID(item.ID_LINEA);
        const origen = lineaData.ORIGEN;
        const destino = lineaData.DESTINO;
        //message += `ID-Reserva: ${item.ID_RESERVA} | Origen: ${origen} | Destino: ${destino} | Hora: ${item.HORA} | Fecha: ${formatearFechas(item)} | Tipo de asiento: ${item.TIPO_ASIENTO} <br><br>`;
        message += `ID-Reserva: ${item.ID_RESERVA} <br /> ${origen} - ${destino} | ${item.HORA} | ${formatearFechas(item)} | ${item.TIPO_ASIENTO} <br><br>`;
      };
    }else if (formElement.id === 'getHistoricoReservas'){
      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        const lineaData = await getLineaByID(item.ID_LINEA);
        const origen = lineaData.ORIGEN;
        const destino = lineaData.DESTINO;
        //message += `ID-Reserva: ${item.ID_RESERVA} | Origen: ${origen} | Destino: ${destino} | Hora: ${item.HORA} | Fecha: ${formatearFechas(item)} | Tipo de asiento: ${item.TIPO_ASIENTO} <br><br>`;
        message += `ID-Reserva: ${item.ID_RESERVA} <br /> ${origen} - ${destino} | ${item.HORA} | ${formatearFechas(item)} | ${item.TIPO_ASIENTO} <br><br>`;

      };
    };
    return message;
    
  };
  
  
  /***************************************** DELETE *****************************************/
  
  const formDeleteReserva = [
    { id: 'deleteReserva', url: 'reservaidentificado', target: 'textoDeleteReserva' }
  ];
  
  formDeleteReserva.forEach(async formElement => {
    const form = document.getElementById(formElement.id);
    var select = document.getElementById("ID_RESERVA_DELETE");
    
    //Desplegable Reservas
    const reservasDisponibles = await getReservasDisponibles();
    const reservaSelect = desplegableReservas(reservasDisponibles, select);
    
  
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      let message = '';
      const ID_ESTUDIANTE_IDENTIFICADO = localStorage.getItem('ID_ESTUDIANTE');
      const idreserva = reservaSelect.value;
  
      const reserva = await getReservaByID(idreserva);
      const tipoAsiento = reserva.TIPO_ASIENTO;
      let viaje = await viajeEncontrado2(formatearFechaHistorico(reserva.FECHA), reserva.HORA, reserva.ID_LINEA);
      await incrementarAsiento(viaje, tipoAsiento);
  
      await fetch(`http://127.0.0.1:3000/admin/${formElement.url}/${ID_ESTUDIANTE_IDENTIFICADO}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ID_RESERVA: idreserva}),
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
  

  
  /***************************************** PUT *****************************************/
  
  
  const formPutReserva = [
    { id: 'putReserva', url: 'reservaupdate', target: 'textoPutReserva' }
  ];
  
  formPutReserva.forEach(async formElement => {
    const form = document.getElementById(formElement.id);
    var select = document.getElementById("ID_RESERVA_PUT");
    const horaSeleccionada = document.getElementById('HORA_PUT');
  
    limitarCalendario("FECHA_PUT");
    desplegableAsientos("TIPO_ASIENTO_PUT");
   
    //Desplegable Reservas
    const reservasDisponibles = await getReservasDisponibles();
    const reservaSelect = desplegableReservas(reservasDisponibles, select);
  
    // Agregar evento de cambio (horas) al desplegable de ID de reserva
    reservaSelect.addEventListener('change', async () => {
      const selectedReserva = await getReservaByID(reservaSelect.value);
      
      var selectedLinea = selectedReserva.ID_LINEA;
      await desplegableHora(selectedLinea, horaSeleccionada);
    });  
  
  
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      let message = '';
      const ID_ESTUDIANTE_IDENTIFICADO = localStorage.getItem('ID_ESTUDIANTE');
  
    // Lo pongo asi por que si lo hago con formData me coge el _PUT de los nombres y entonces no funciona
      const ID_RESERVA = reservaSelect.value;
      const HORA = horaSeleccionada.value;
      const TIPO_ASIENTO = e.target.TIPO_ASIENTO_PUT.value;
      const FECHA = e.target.FECHA_PUT.value;
      const ID_ESTUDIANTE = ID_ESTUDIANTE_IDENTIFICADO;
  
      //Incrementamos el valor de la reserva antigua
      const reserva = await getReservaByID(ID_RESERVA);
      const tipoAsiento = reserva.TIPO_ASIENTO;
      let viajeAnterior = await viajeEncontrado2(formatearFechaHistorico(reserva.FECHA), reserva.HORA, reserva.ID_LINEA);
      await incrementarAsiento(viajeAnterior, tipoAsiento);
      
      //Decrementamos el valor de la reserva nueva
      let viajeNuevo = await viajeEncontrado(FECHA, HORA, reserva.ID_LINEA);
      if(!await decrementarAsiento(viajeNuevo, TIPO_ASIENTO)){
        return;
      };
  
  
      await fetch(`http://127.0.0.1:3000/admin/${formElement.url}/${ID_ESTUDIANTE_IDENTIFICADO}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ID_ESTUDIANTE: ID_ESTUDIANTE, ID_RESERVA: ID_RESERVA, HORA: HORA, TIPO_ASIENTO: TIPO_ASIENTO, FECHA: FECHA }),
  
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
  
  