function redirectToRegistrarsePage() {
  window.location.href = "frontend/registro/registro.html";
};

function desplegableAsientos (campo){
  var select = document.getElementById(campo);

  var opciones = ["NORMAL", "ESPECIAL", "SR"];
  for (var i = 0; i < opciones.length; i++) {
    var option = document.createElement("option");
    option.value = opciones[i];
    option.text = opciones[i];
    select.appendChild(option);
  };

};

async function idEstudianteExiste(idEstudiante) {
    const response = await fetch(`http://127.0.0.1:3000/admin/estudiante/${idEstudiante}`, {
      method: 'GET',
    });

    if (response.ok) {
      // Si la respuesta es exitosa (código de estado 200), se considera que el estudiante existe
      return true;
    } else if (response.status === 404) {
      // Si la respuesta es un error 404 (estudiante no encontrado), se considera que el estudiante no existe
      return false;
    };
};

const getAsientoDefecto = async () => {
  const ID_ESTUDIANTE_IDENTIFICADO = localStorage.getItem('ID_ESTUDIANTE');
  const response = await fetch(`http://127.0.0.1:3000/admin/estudiante/${ID_ESTUDIANTE_IDENTIFICADO}`);
  const data = await response.json();
  return data.ASIENTO_DEFECTO;
};

/*-------------------- FECHAS ACTUALIZAR VIAJES --------------------*/

function formatearFecha(fechaISO) {
  const fecha = new Date(fechaISO);
  const year = fecha.getFullYear();
  const month = String(fecha.getMonth() + 1).padStart(2, '0');
  const day = String(fecha.getDate()).padStart(2, '0');
  const fechaFormateada = `${year}-${month}-${day}`;
  return fechaFormateada;
};

const getRutinasDisponibles = async () => {
  const response = await fetch('http://127.0.0.1:3000/admin/rutinas');
  const data = await response.json();
  return data;
};

async function getAutobusByID(ID_AUTOBUS) {
  const response = await fetch(`http://127.0.0.1:3000/admin/autobus/${ID_AUTOBUS}`);
  const data = await response.json();
  return data;
};

async function ViajeExistente(FECHA) {
  const response = await fetch(`http://127.0.0.1:3000/admin/viajeexistente/${FECHA}`, {
    method: 'GET',
  });
  if (response.ok) {
    return true;
  } else if (response.status === 404) {
    return false;
  };
};

async function getFechaUltimaConexion() {
  const response = await fetch(`http://127.0.0.1:3000/admin/readfechaultimaconexion/1`);
  const data = await response.json();
  return data;
};

async function actualizarFechaUltimaConexion(FECHA_ULTIMA_CONEXION) {
  const response = await fetch(`http://127.0.0.1:3000/admin/actualizarfechaultimaconexion/1/${FECHA_ULTIMA_CONEXION}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    }
  });
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
  const data = await response.json();
  return data;
};

async function postViajesNuevos(FECHA_NUEVA){
  // Obtener la fecha actual
  var currentDate = new Date(FECHA_NUEVA);

  var weekdays = [1, 2, 3, 4, 5];

  var rutinas = await getRutinasDisponibles();
   while(!weekdays.includes(currentDate.getDay())){
    // Avanzar al siguiente día
    currentDate.setDate(currentDate.getDate() + 1);
   };
  // Recorrer cada día en el rango de fechas
    if (weekdays.includes(currentDate.getDay())) {
      
      if(await ViajeExistente(formatearFecha(currentDate))){
        //console.log(" el viaje ya existe ");
        return;
      };
      // Recorrer cada rutina y crear un viaje para ese día
      for (var i = 0; i < rutinas.length; i++) {
        var rutina = rutinas[i];

        var fecha = formatearFecha(currentDate);
        var hora = rutina.HORA_SALIDA;
        var linea = rutina.ID_LINEA;
        var autobus = await getAutobusByID(rutina.ID_AUTOBUS);
        var asientoN = autobus.N_ASIENTOS;
        var asientoE = autobus.N_ASIENTOS_ESPECIALES;
        var asientoSR = autobus.N_ASIENTOS_SR;

        // Crear un nuevo objeto de viaje con los datos correspondientes
        await createViaje(fecha, hora, linea, asientoN, asientoE, asientoSR);
      };
  };
};

async function deleteViajesVencidos (FECHA_ANTERIOR){
  const response = await fetch(`http://127.0.0.1:3000/admin/viajes/${FECHA_ANTERIOR}`, {
    method: 'DELETE', 
  });
  const data = await response.json();
  return data;
};

function obtenerFechaAnterior() {
  var fecha_actual = new Date();
  fecha_actual.setDate(fecha_actual.getDate() - 1); // Restar un día a la fecha actual
  return formatearFecha(fecha_actual);
};

function obtenerFechaNueva() {
  var fecha_actual = new Date();
  fecha_actual.setMonth(fecha_actual.getMonth() + 1); // Sumar un mes a la fecha actual
  fecha_actual.setDate(fecha_actual.getDate() + 1); // Sumar un día a la fecha actual
  return formatearFecha(fecha_actual);
};

async function actualizarTablaViajes(){
  // Borrar viajes pasados de fecha
  var FECHA_ANTERIOR = obtenerFechaAnterior();
  await deleteViajesVencidos(FECHA_ANTERIOR);
  // Añadir viajes nuevos
  var FECHA_NUEVA = obtenerFechaNueva();
  console.log("Fecha nueva: "+ FECHA_NUEVA);
  await postViajesNuevos(FECHA_NUEVA);      
};

async function actualizarTablaViajesYFechaUltimaConexion(){
  var fecha = new Date();
  var fecha_actual = formatearFecha(fecha);
  var ultimaConexion = await getFechaUltimaConexion();
  var fecha_UltimaConexion = formatearFecha(ultimaConexion.FECHA_ULTIMA_CONEXION);
console.log("fecha nueva: "+obtenerFechaNueva());
  if (fecha_actual != fecha_UltimaConexion){
    fecha_UltimaConexion = fecha_actual;
    await actualizarFechaUltimaConexion(fecha_UltimaConexion); //actualizo la fecha en la bbdd para que no vuelva a entrar hasta que no pase 1 o + dias
    await actualizarTablaViajes(); // borrar el dia pasado(hoy -1) y meter un dia nuevo (1 mes + 1 dia) -> seria tantos dias como sea la diferencia entre las fechas
  }
};


/*-------------------- INICIO DE SESION  --------------------*/
// Obtener referencias a los elementos del formulario
const loginForm = document.getElementById('login-form');
const usernameInput = document.getElementById('ID_ESTUDIANTE');
const passwordInput = document.getElementById('CONTRASEÑA');

actualizarTablaViajesYFechaUltimaConexion();

// Agregar un evento de escucha al formulario de inicio de sesión
loginForm.addEventListener('submit', function(event) {
  event.preventDefault(); // Evitar que el formulario se envíe automáticamente

  // Obtener los valores ingresados ​​por el usuario
  const username = usernameInput.value;
  const password = passwordInput.value;

  // Realizar una solicitud al backend para verificar las credenciales
  fetch(`http://127.0.0.1:3000/admin/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ ID_ESTUDIANTE: username, CONTRASEÑA: password })
  })
    .then(response => response.json())
    .then(async data => {
      if (data.userExists) {
        if (data.isValidPassword) {
          if (username === 'raquel' && password === 'admin1234') {
            // Redirigir al administrador
            window.location.href = 'frontend/admin/admin.html';
          } else {
            // Redirigir al usuario normal
            // Después de verificar las credenciales y decidir redirigir al usuario a user.html
            // Guardar el valor de ID_ESTUDIANTE en localStorage
            localStorage.setItem('ID_ESTUDIANTE', username);
            const asientoxdefecto = await getAsientoDefecto();
            console.log("asiento por defecto: "+ asientoxdefecto);
            localStorage.setItem('ASIENTO_DEFECTO', asientoxdefecto);
            console.log('USERNAME ->>> '+username);
            window.location.href = 'frontend/user/user.html';
          }
        } else {
          // Contraseña incorrecta, mostrar mensaje de alarma
          alert('Contraseña incorrecta. Por favor, intenta nuevamente.');
        }
      } else {
        // El usuario no existe, mostrar mensaje de alarma
        alert('El usuario no existe. Por favor, regístrate para iniciar sesión.');
      }
    })
    .catch(error => {
      console.error('Error al verificar las credenciales:', error);
      // Mostrar mensaje de error en caso de falla
      alert('Error al verificar las credenciales. Por favor, intenta nuevamente.');
    });
});
