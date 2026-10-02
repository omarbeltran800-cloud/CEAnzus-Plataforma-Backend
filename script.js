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
// --- HU-02: Sistema Anti-Screen y Detector de Manipulación del DOM ---
function inicializarAntiScreenSecurity() {
    // 1. Inyectamos dinámicamente la capa de marca de agua en el body
    const watermark = document.createElement('div');
    watermark.id = 'watermark-overlay';
    document.body.appendChild(watermark);

    // 2. Creamos el MutationObserver (El Perro Guardián)
    const watchdog = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            // Si detectamos que se removieron elementos del DOM
            if (mutation.removedNodes.length > 0) {
                mutation.removedNodes.forEach((node) => {
                    // Verificamo si el elemento borrado fue nuestra capa de seguridad
                    if (node.id === 'watermark-overlay') {
                        console.warn("🚨 ALERTA DE SEGURIDAD DOM: Intento de remoción de marca de agua detectado.");
                        
                        // Acción correctiva (RN04): Bloquear y expulsar de la sesión
                        alert("⚠️ Violación de políticas de seguridad visual detectada. La sesión será finalizada.");
                        document.body.innerHTML = `
                            <div style="display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #032B69; color: white; font-family: sans-serif; text-align: center; flex-direction: column;">
                                <h1 style="color: #FF924D; font-size: 3rem; margin-bottom: 20px;">SESIÓN FINALIZADA</h1>
                                <p style="font-size: 1.2rem;">Se ha detectado la alteración de la capa de protección Anti-Screen.</p>
                                <p style="font-size: 1rem; color: #74D353; margin-top: 10px;">Código de incidencia: SEC-ERR-403</p>
                            </div>
                        `;
                    }
                });
            }
        });
    });

    // Ponemos a vigilar al observador sobre todo el cuerpo del documento
    watchdog.observe(document.body, { childList: true });
}

// Ejecutamos la seguridad al cargar por completo la ventana
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

// --- HU-02: Sistema Anti-Screen y Detector de Manipulación del DOM ---
function inicializarAntiScreenSecurity() {
    if (document.getElementById('watermark-overlay')) return;
    
    // 1. Inyectamos dinámicamente la capa de marca de agua en el body
    const watermark = document.createElement('div');
    watermark.id = 'watermark-overlay';
    document.body.appendChild(watermark);

    // 2. Creamos el MutationObserver (El Perro Guardián)
    const watchdog = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            // Si detectamos que se removieron elementos del DOM
            if (mutation.removedNodes.length > 0) {
                mutation.removedNodes.forEach((node) => {
                    // Verificamos si el elemento borrado fue nuestra capa de seguridad
                    if (node.id === 'watermark-overlay') {
                        console.warn("🚨 ALERTA DE SEGURIDAD DOM: Intento de remoción de marca de agua detectado.");
                        
                        // Acción correctiva (RN04): Bloquear y expulsar de la sesión
                        alert("⚠️ Violación de políticas de seguridad visual detectada. La sesión será finalizada.");
                        document.body.innerHTML = `
                            <div style="display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #032B69; color: white; font-family: sans-serif; text-align: center; flex-direction: column;">
                                <h1 style="color: #FF924D; font-size: 3rem; margin-bottom: 20px;">SESIÓN FINALIZADA</h1>
                                <p style="font-size: 1.2rem;">Se ha detectado la alteración de la capa de protección Anti-Screen.</p>
                                <p style="font-size: 1rem; color: #74D353; margin-top: 10px;">Código de incidencia: SEC-ERR-403</p>
                            </div>
                        `;
                    }
                });
            }
        });
    });

    // Ponemos a vigilar al observador sobre todo el cuerpo del documento
    watchdog.observe(document.body, { childList: true });
}

// Ejecutar inmediatamente si ya cargó, o esperar al evento
if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', inicializarAntiScreenSecurity);
} else {
    inicializarAntiScreenSecurity();
}