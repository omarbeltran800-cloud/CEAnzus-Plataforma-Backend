
const btnVolver = document.getElementById('btn-volver');


btnVolver.addEventListener('click', () => {

    const confirmarSalida = confirm("¿Estás seguro de que deseas salir de la sesión actual?");

    if (confirmarSalida) {

        alert("Saliendo de la clase... (Simulación de redirección)");
    } else {
      
        console.log("Salida cancelada por el alumno.");
    }
});

const chatInput = document.getElementById('chat-input');
const btnSend = document.getElementById('btn-send');
const chatMessages = document.getElementById('chat-messages');

btnSend.addEventListener('click', () => {
   
    const mensaje = chatInput.value.trim(); 

    
    if (mensaje === "") {
        console.log("Envío bloqueado: El mensaje está vacío.");
        return; 
    }

    
    const nuevoMensaje = document.createElement('div');
    
    
    nuevoMensaje.style.backgroundColor = 'var(--btn-green-dark)';
    nuevoMensaje.style.color = 'white';
    nuevoMensaje.style.padding = '8px 15px';
    nuevoMensaje.style.borderRadius = '20px';
    nuevoMensaje.style.marginBottom = '10px';
    nuevoMensaje.style.display = 'inline-block';
    nuevoMensaje.textContent = mensaje;

   
    chatMessages.appendChild(nuevoMensaje);

    
    chatInput.value = "";
    

    chatMessages.scrollTop = chatMessages.scrollHeight;
});


chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        btnSend.click();
    }
});

async function cargarGrabaciones() {
    try {
        const response = await fetch('/api/recordings');
        const resultado = await response.json();

        if (resultado.success) {
            console.log("Grabaciones obtenidas con éxito:", resultado.data);
            
        } else {
            console.error("El servidor indicó un fallo al traer las grabaciones.");
        }
    } catch (error) {
        console.error("Error de conexión al intentar obtener las grabaciones:", error);
    }
}


async function cargarGrabaciones() {
    const listContainer = document.getElementById('recordings-list');
    
    
    if (!listContainer) return; 

    try {
        const response = await fetch('/api/recordings');
        const resultado = await response.json();

      
        listContainer.innerHTML = '';

        if (resultado.success && resultado.data.length > 0) {
            
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
            
            listContainer.innerHTML = '<p class="empty-message">Aún no hay grabaciones disponibles para esta sesión.</p>';
        }
    } catch (error) {
        console.error("Error de conexión al intentar obtener las grabaciones:", error);
        listContainer.innerHTML = '<p class="empty-message" style="color: red;">Error al cargar las grabaciones.</p>';
    }
}


cargarGrabaciones();



const btnMic = document.getElementById('btnMic'); 
const btnCam = document.getElementById('btnCam'); 


let streamMic = null;
let streamCam = null;

if (btnMic) {
    btnMic.addEventListener('click', async function() {
        
        if (streamMic) {
            streamMic.getTracks().forEach(track => track.stop());
            streamMic = null;
            this.style.backgroundColor = ''; 
            this.style.color = '';
        } else {
        
            try {
                streamMic = await navigator.mediaDevices.getUserMedia({ audio: true });
                this.style.backgroundColor = 'red'; 
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
        
        if (streamCam) {
            streamCam.getTracks().forEach(track => track.stop());
            streamCam = null;
            this.style.backgroundColor = ''; 
            this.style.color = '';
        } else {
           
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

const canvas = document.getElementById('pizarraLienzo');
const ctx = canvas.getContext('2d');


const socket = io();

let dibujando = false;


ctx.lineWidth = 3;
ctx.lineCap = 'round';
ctx.strokeStyle = '#032B69'; 

canvas.addEventListener('mousedown', (e) => {
    dibujando = true;
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
   
    socket.emit('iniciar_trazo', { x: e.offsetX, y: e.offsetY });
});

canvas.addEventListener('mousemove', (e) => {
    if (!dibujando) return;
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
   
    socket.emit('dibujar', { x: e.offsetX, y: e.offsetY });
});

canvas.addEventListener('mouseup', () => {
    dibujando = false;
    ctx.closePath();
});

canvas.addEventListener('mouseout', () => {
    dibujando = false;
});


socket.on('iniciar_trazo', (datos) => {
    ctx.beginPath();
    ctx.moveTo(datos.x, datos.y);
});

socket.on('dibujar', (datos) => {
    ctx.lineTo(datos.x, datos.y);
    ctx.stroke();
});