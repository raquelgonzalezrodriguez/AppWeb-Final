function redirectToIndexPage() {
  window.location.href = "../../index.html";
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
  
  /*------------------------- REGISTRO  -------------------------*/
  
  const formPostElements = [
    { id: 'postEstudiante', url: 'estudiante', target: 'textoPostEstudiante', fields: ['ID_ESTUDIANTE', 'NOMBRE', 'EMAIL', 'CONTRASEÑA', 'TELEFONO', 'ASIENTO_DEFECTO'] }
  ];
  
  formPostElements.forEach(formElement => {
    const form = document.getElementById(formElement.id);
    desplegableAsientos("ASIENTO_DEFECTO");
  
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      let message = '';
      let errorMessage = '';
  
      /* COMPROBACIONES */
      const formData = {};
      formElement.fields.forEach(field => {
        const fieldValue = e.target[field].value;
        formData[field] = fieldValue;
        if (fieldValue.trim() === '') {
          errorMessage += `${field} no puede estar vacío.\n`;
        }
      });
  
      const password = formData['CONTRASEÑA'];
      const confirmPassword = e.target.CONFIRM_CONTRASEÑA.value;
      if (password !== confirmPassword) {
        errorMessage += 'Las contraseñas no coinciden.\n';
      };
  
      const idEstudiante = formData['ID_ESTUDIANTE'];
      const idEstudianteExistente = await idEstudianteExiste(idEstudiante);
      if (idEstudianteExistente) {
        errorMessage += 'El DNI ya existe en la base de datos. Por favor, inicie sesión o elija otro.';
      };
  
      if (errorMessage !== '') {
        alert(errorMessage);
        return;
      };
      console.log(formData);
  
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
      form.reset();
    });
  });