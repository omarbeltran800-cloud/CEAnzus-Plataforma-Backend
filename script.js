// --- HU-02: Capa Anti-Screen Security (RN04) ---
function inicializarAntiScreenSecurity() {
    const overlay = document.createElement('div');
    overlay.id = 'watermark-overlay';
    document.body.appendChild(overlay);
}
inicializarAntiScreenSecurity();

// --- HU-02: Controles Multimedia Locales (RN02 / RN03) ---
const btnMic = document.getElementById('btn-mic');
const btnCam = document.getElementById('btn-cam');

let localStreamMic = null;
let localStreamCam = null;

if (btnMic) {
    let micActivo = false;
    btnMic.addEventListener('click', async () => {
        try {
            if (!micActivo) {
                localStreamMic = await navigator.mediaDevices.getUserMedia({ audio: true });
                micActivo = true;
                btnMic.style.backgroundColor = '#74D353'; // Verde
            } else {
                if (localStreamMic) localStreamMic.getAudioTracks().forEach(track => track.stop());
                micActivo = false;
                btnMic.style.backgroundColor = 'white';
            }
        } catch (error) {
            alert("No se pudo acceder al micrófono.");
        }
    });
}

if (btnCam) {
    let camActiva = false;
    btnCam.addEventListener('click', async () => {
        try {
            if (!camActiva) {
                localStreamCam = await navigator.mediaDevices.getUserMedia({ video: true });
                camActiva = true;
                btnCam.style.backgroundColor = '#74D353'; // Verde
            } else {
                if (localStreamCam) localStreamCam.getVideoTracks().forEach(track => track.stop());
                camActiva = false;
                btnCam.style.backgroundColor = 'white';
            }
        } catch (error) {
            alert("No se pudo acceder a la cámara.");
        }
    });
}

// --- HU-01: Funciones Anteriores (Volver y Chat) ---

// Botón Volver
const btnVolver = document.querySelector('.btn-volver');
if (btnVolver) {
    btnVolver.addEventListener('click', () => {
        const confirmar = confirm("¿Estás seguro de salir de la sesión?");
        if (confirmar) {
            console.log("Saliendo de la sesión...");
            // Aquí puedes agregar la redirección si tienes otra página: window.location.href = 'inicio.html';
        }
    });
}

// Lógica del Chat
const btnEnviar = document.querySelector('.btn-enviar');
const chatInput = document.querySelector('.chat-input-area input');
const chatBox = document.querySelectorAll('.caja-gris')[0]; // Selecciona la primera caja gris (la del chat)

if (btnEnviar && chatInput && chatBox) {
    // Configurar la caja para que los mensajes se vean bien
    chatBox.style.overflowY = 'auto';
    chatBox.style.padding = '15px';
    chatBox.style.display = 'flex';
    chatBox.style.flexDirection = 'column';
    chatBox.style.gap = '10px';

    btnEnviar.addEventListener('click', () => {
        const mensaje = chatInput.value.trim();
        if (mensaje !== "") {
            const msgElement = document.createElement('div');
            msgElement.textContent = "Tú: " + mensaje;
            msgElement.style.backgroundColor = "#e6eff5";
            msgElement.style.padding = "10px 15px";
            msgElement.style.borderRadius = "15px";
            msgElement.style.color = "#003366";
            msgElement.style.alignSelf = "flex-end";
            
            chatBox.appendChild(msgElement);
            chatInput.value = ""; // Limpiar el input
            chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll hacia abajo
        }
    });

    // Permitir enviar el mensaje con la tecla Enter
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            btnEnviar.click();
        }
    });
}