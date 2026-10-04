// Seleccionamos el botón de volver usando su ID
const btnVolver = document.getElementById('btn-volver');

// Agregamos el evento de clic al botón
btnVolver.addEventListener('click', () => {
    // RN01: Modal de confirmación de salida
    const confirmarSalida = confirm("¿Estás seguro de que deseas salir de la sesión actual?");

    if (confirmarSalida) {
        // Si el alumno acepta salir
        alert("Saliendo de la clase... (Simulación de redirección)");
    } else {
        // Si el alumno cancela, se queda en la sala
        console.log("Salida cancelada por el alumno.");
    }
});
// --- Lógica del Chat (Escenario 2) ---
const chatInput = document.getElementById('chat-input');
const btnSend = document.getElementById('btn-send');
const chatMessages = document.getElementById('chat-messages');

btnSend.addEventListener('click', () => {
    // La función .trim() elimina los espacios en blanco al inicio y al final
    const mensaje = chatInput.value.trim(); 

    // Validación: Si está vacío tras quitar los espacios, bloqueamos el envío
    if (mensaje === "") {
        console.log("Envío bloqueado: El mensaje está vacío.");
        return; 
    }

    // Si el texto es válido, creamos el globo del mensaje
    const nuevoMensaje = document.createElement('div');
    
    // Le aplicamos el diseño estilo "píldora" verde que pide la HU-01
    nuevoMensaje.style.backgroundColor = 'var(--btn-green-dark)';
    nuevoMensaje.style.color = 'white';
    nuevoMensaje.style.padding = '8px 15px';
    nuevoMensaje.style.borderRadius = '20px';
    nuevoMensaje.style.marginBottom = '10px';
    nuevoMensaje.style.display = 'inline-block';
    nuevoMensaje.textContent = mensaje;

    // Metemos el globo de texto al área del chat
    chatMessages.appendChild(nuevoMensaje);

    // Limpiamos la caja de texto para escribir el siguiente
    chatInput.value = "";
    
    // Forzamos el scroll hacia abajo para ver siempre el mensaje más reciente
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Truco extra: Permitir que se envíe también al presionar la tecla "Enter"
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        btnSend.click();
    }
});
// Función para cargar y mostrar las grabaciones de la HU-03
async function cargarGrabaciones() {
    try {
        const response = await fetch('/api/recordings');
        const resultado = await response.json();

        if (resultado.success) {
            console.log("Grabaciones obtenidas con éxito:", resultado.data);
            // Aquí puedes mapear los datos para pintarlos en tu HTML cuando gustes
        } else {
            console.error("El servidor indicó un fallo al traer las grabaciones.");
        }
    } catch (error) {
        console.error("Error de conexión al intentar obtener las grabaciones:", error);
    }
}

// Ejecutamos la función al cargar la vista si es necesario
// cargarGrabaciones();// Función para cargar y mostrar las grabaciones de la HU-03 en el HTML
async function cargarGrabaciones() {
    const listContainer = document.getElementById('recordings-list');
    
    // Validamos que el contenedor exista en la vista antes de intentar llenarlo
    if (!listContainer) return; 

    try {
        const response = await fetch('/api/recordings');
        const resultado = await response.json();

        // Limpiamos el mensaje de "Cargando grabaciones..."
        listContainer.innerHTML = '';

        if (resultado.success && resultado.data.length > 0) {
            // Mapeamos los datos y creamos un elemento 'li' por cada grabación
            resultado.data.forEach(grabacion => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <div class="recording-item">
                        <strong>${grabacion.name}</strong> - ${grabacion.date}
                        <br>
                        <a href="${grabacion.url}" target="_blank">▶ Ver Grabación</a>
                    </div>
                `;
                listContainer.appendChild(li);
            });
        } else {
            // Si el arreglo viene vacío (como pasa ahorita), mostramos un mensaje amigable
            listContainer.innerHTML = '<p class="empty-message">Aún no hay grabaciones disponibles para esta sesión.</p>';
        }
    } catch (error) {
        console.error("Error de conexión al intentar obtener las grabaciones:", error);
        listContainer.innerHTML = '<p class="empty-message" style="color: red;">Error al cargar las grabaciones.</p>';
    }
}

// Ejecutamos la función inmediatamente al cargar la vista
cargarGrabaciones();