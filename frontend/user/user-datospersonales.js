
function redirectToUserPage() {
  window.location.href = "user.html";
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

  /***************************************** GET *****************************************/
  
  const formGetElements = [
    { id: 'getEstudiante', url: 'estudiante', target: 'textoGetEstudiante' },
  
  ];
  
  formGetElements.forEach(formElement => {
    const form = document.getElementById(formElement.id);
  
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      let message = '';
  
      const ID_ESTUDIANTE_IDENTIFICADO = localStorage.getItem('ID_ESTUDIANTE');
  
      await fetch(`http://127.0.0.1:3000/admin/${formElement.url}/${ID_ESTUDIANTE_IDENTIFICADO}`, {
        method: 'GET',
      })
        .then((response) => response.json())
        .then(async (data) => {
          if (data.message) {
            message = data.message;
          } else {
            message = await generateGetMessage(formElement, data, ID_ESTUDIANTE_IDENTIFICADO);       
          }
        });
  
      document.getElementById(formElement.target).innerHTML = message;
    });
  });
  
  async function generateGetMessage(formElement, data, ID_ESTUDIANTE_IDENTIFICADO) {
    let message = '';
        // Generate the message based on the response data structure
    if (formElement.id === 'getEstudiante'){
        message = `DNI: ${ID_ESTUDIANTE_IDENTIFICADO} <br /><br /> Nombre: ${data.NOMBRE} <br /><br /> Email: ${data.EMAIL} <br /><br /> Contraseña: ${data.CONTRASEÑA} <br /><br /> Telefono: ${data.TELEFONO} <br /><br /> Asiento por defecto: ${data.ASIENTO_DEFECTO}`;
    };
    return message;
    
  };
  
  
  /***************************************** DELETE *****************************************/
  
  const formDeleteEstudiante = [
    { id: 'deleteEstudiante', url: 'estudiante', target: 'textoDeleteEstudiante' }
  ];
  
  formDeleteEstudiante.forEach(formElement => {
    const form = document.getElementById(formElement.id);
  
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      let message = '';
      const ID_ESTUDIANTE_IDENTIFICADO = localStorage.getItem('ID_ESTUDIANTE');
  
      await fetch(`http://127.0.0.1:3000/admin/${formElement.url}/${ID_ESTUDIANTE_IDENTIFICADO}`, {
        method: 'DELETE',
      })
        .then((response) => response.json())
        .then((data) => {
            message = data.message;
            window.location.href = '../../index.html';
  
        });
      document.getElementById(formElement.target).innerHTML = message;
    });
  });
  
  
  /***************************************** PUT *****************************************/
  
  const formPutEstudiante = [
    { id: 'putEstudiante', url: 'estudianteupdate', target: 'textoPutEstudiante', fields: [ 'NOMBRE', 'EMAIL', 'CONTRASEÑA', 'TELEFONO', 'ASIENTO_DEFECTO'] }
  ];
  
  formPutEstudiante.forEach(formElement => {
    const form = document.getElementById(formElement.id);
  
    desplegableAsientos("ASIENTO_DEFECTO");
    
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      let message = '';
      const formData = {};
      formElement.fields.forEach(field => {
        formData[field] = e.target[field].value;
      });
  
      const ID_ESTUDIANTE_IDENTIFICADO = localStorage.getItem('ID_ESTUDIANTE');
       formData['ID_ESTUDIANTE'] = ID_ESTUDIANTE_IDENTIFICADO;
  
      await fetch(`http://127.0.0.1:3000/admin/${formElement.url}/${ID_ESTUDIANTE_IDENTIFICADO}`, {
        method: 'PUT',
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
      const asientoxdefecto = e.target.ASIENTO_DEFECTO.value;
      if (asientoxdefecto.trim() !== '') {
          localStorage.setItem('ASIENTO_DEFECTO', asientoxdefecto);
          //recargo toda la pagina
          location.reload();
      };
      form.reset();
    });
  });

  