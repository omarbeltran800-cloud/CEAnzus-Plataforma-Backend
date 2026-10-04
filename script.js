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


// --- Lógica de Botones de Control Inferiores ---
const btnMic = document.getElementById('btnMic'); 
const btnCam = document.getElementById('btnCam'); 

// Variables para guardar los permisos y apagar el hardware después
let streamMic = null;
let streamCam = null;

if (btnMic) {
    btnMic.addEventListener('click', async function() {
        // Si el micrófono ya está prendido, lo apagamos
        if (streamMic) {
            streamMic.getTracks().forEach(track => track.stop());
            streamMic = null;
            this.style.backgroundColor = ''; // Regresa a color original
            this.style.color = '';
        } else {
            // Si está apagado, pedimos permiso al navegador
            try {
                streamMic = await navigator.mediaDevices.getUserMedia({ audio: true });
                this.style.backgroundColor = 'red'; // Se pinta rojo indicando "En Vivo"
                this.style.color = 'white';
            } catch (error) {
                console.error('Error al acceder al micrófono:', error);
                alert('Se requiere permiso para usar el micrófono.');
            }
        }
    });
}

if (btnCam) {
    btnCam.addEventListener('click', async function() {
        // Si la cámara ya está prendida, la apagamos
        if (streamCam) {
            streamCam.getTracks().forEach(track => track.stop());
            streamCam = null;
            this.style.backgroundColor = ''; 
            this.style.color = '';
        } else {
            // Si está apagada, pedimos permiso de video
            try {
                streamCam = await navigator.mediaDevices.getUserMedia({ video: true });
                this.style.backgroundColor = 'red'; 
                this.style.color = 'white';
            } catch (error) {
                console.error('Error al acceder a la cámara:', error);
                alert('Se requiere permiso para usar la cámara.');
            }
        }
    });
}
// --- Lógica de Pizarra Interactiva (HU-04) ---
const canvas = document.getElementById('pizarraLienzo');
const ctx = canvas.getContext('2d');

// Inicializar Socket.IO en el cliente
const socket = io();

let dibujando = false;

// Configuración visual del trazo
ctx.lineWidth = 3;
ctx.lineCap = 'round';
ctx.strokeStyle = '#032B69'; // Color azul marino
// --- Eventos de Dibujo Local y Emisión ---
canvas.addEventListener('mousedown', (e) => {
    dibujando = true;
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
    // Avisar al servidor que empezamos a trazar
    socket.emit('iniciar_trazo', { x: e.offsetX, y: e.offsetY });
});

canvas.addEventListener('mousemove', (e) => {
    if (!dibujando) return;
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    // Enviar coordenadas continuas al servidor
    socket.emit('dibujar', { x: e.offsetX, y: e.offsetY });
});

canvas.addEventListener('mouseup', () => {
    dibujando = false;
    ctx.closePath();
});

canvas.addEventListener('mouseout', () => {
    dibujando = false;
});

// --- Recibir Trazos de Otros Usuarios ---
socket.on('iniciar_trazo', (datos) => {
    ctx.beginPath();
    ctx.moveTo(datos.x, datos.y);
});

socket.on('dibujar', (datos) => {
    ctx.lineTo(datos.x, datos.y);
    ctx.stroke();
});