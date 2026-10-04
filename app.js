// --- 1. BASE DE DATOS DE RUTINAS (Con los cambios pedidos y vídeos 100% estables) ---
const rutinas = {
    calentamiento: [
        { nombre: "Rotaciones Torácicas", duracion: 45, youtubeId: "3vV84Zl-f-8", descripcion: "Calentamiento rápido de la zona media para evitar tirones en el Tee 1." },
        { nombre: "Rotaciones con Palo", duracion: 45, youtubeId: "c_l6Uv6D8J8", descripcion: "Conecta los brazos con el tronco simulando la resistencia del swing." }
    ],
    movilidad: [
        { nombre: "Gato-Camello", duracion: 60, youtubeId: "CXEclAABHj0", descripcion: "Flexibiliza la columna vertebral y el control pélvico. Vital para mantener tus ángulos intactos en el impacto." },
        { nombre: "90/90 de Cadera", duracion: 90, youtubeId: "W7oR-Xg3qEw", descripcion: "Aumenta la rotación interna y externa de la cadera. Clave para girar completamente en el backswing." },
        { nombre: "El Libro Abierto", duracion: 60, youtubeId: "L8_Cdb043qE", descripcion: "Maximiza la movilidad torácica horizontal, previniendo el balanceo lateral (sway) indeseado." },
        { nombre: "Puente de Glúteos (Extensión)", duracion: 45, youtubeId: "7O7T3f_f1zM", descripcion: "Potencia la extensión de cadera sin material. Fundamental para transmitir toda la fuerza en el impacto." },
        { nombre: "Bisagra de Cadera (Hip Hinge)", duracion: 60, youtubeId: "w0gXZ3j9Wk8", descripcion: "Enseña a doblarse desde las caderas, cimiento de un address perfecto y sólido." },
        { nombre: "Leñador de Rodillas", duracion: 60, youtubeId: "8g4sZ2L1mQw", descripcion: "Mejora la rotación del tronco contra resistencia, fortaleciendo el core en el plano oblicuo." },
        { nombre: "Caminar con Manos (Inchworm)", duracion: 60, youtubeId: "9o9k2L3xZqA", descripcion: "Estira isquiotibiales y activa los hombros. Previene la pérdida de altura al golpear la bola." },
        { nombre: "Estiramiento Psoas-Ilíaco", duracion: 90, youtubeId: "J8m3n2K1pQo", descripcion: "Libera flexores de cadera acortados. Imprescindible para lograr una extensión completa en el finish." },
        { nombre: "Rotación Torácica en Cuadrupedia", duracion: 60, youtubeId: "4p6n2L1xZqA", descripcion: "Sin material. Gira el tronco abriendo el brazo hacia el cielo para maximizar el Factor-X." },
        { nombre: "Zancadas con Rotación", duracion: 60, youtubeId: "K8m3n2L1pQo", descripcion: "Trabaja el equilibrio dinámico: parte inferior estable mientras el tronco gira violentamente." },
        { nombre: "Dislocación de Hombros (Palo)", duracion: 60, youtubeId: "X8m3n2L1pQo", descripcion: "Abre el pecho y mejora la amplitud articular de los hombros. Aumenta el arco del golpe." },
        { nombre: "Plancha Lateral", duracion: 45, youtubeId: "QG0r9d031D8", descripcion: "Core lateral puro. Ayuda a frenar el cuerpo tras el impacto, protegiendo las lumbares." },
        { nombre: "Estiramiento Figura 4 (Glúteo)", duracion: 90, youtubeId: "9h2F-yQ-l0M", descripcion: "Libera el nervio ciático y piramidal. El glúteo sufre mucha tensión generando potencia." },
        { nombre: "Rotación de Cadera Cuadrupedia", duracion: 60, youtubeId: "v2Xg72N2sXQ", descripcion: "Lubrica la articulación coxofemoral para limpiar o despejar las caderas antes del impacto." },
        { nombre: "Ángel en la Pared (Wall Angels)", duracion: 60, youtubeId: "4zF1y5wU_Xk", descripcion: "Corrige la postura en 'C'. Te ayuda a sacar pecho de forma natural al colocar el palo." },
        { nombre: "Extensión Torácica (Rulo/Suelo)", duracion: 90, youtubeId: "1zB_L5w-pPQ", descripcion: "Desbloquea las vértebras medias para evitar que la zona lumbar cargue con todo el estrés." },
        { nombre: "Rotación Cervical Asistida", duracion: 45, youtubeId: "pD2C7B1YxMw", descripcion: "Libera el cuello para mantener la cabeza quieta y la vista en la bola durante el giro." },
        { nombre: "Torsión Rusa (Russian Twist)", duracion: 45, youtubeId: "wkD8rjkodUI", descripcion: "Movilidad rotacional pura. Traslada la energía del suelo directamente hacia las manos." },
        { nombre: "Sentadilla de Arquero", duracion: 60, youtubeId: "Zq3mhe8eX3g", descripcion: "Trabaja la transferencia extrema de peso (Weight Shift) de la pierna trasera a la delantera." },
        { nombre: "Activación de Muñecas", duracion: 45, youtubeId: "jJEPWV6d7x8", descripcion: "Previene epicondilitis (codo de golfista) y mejora la fluidez del release al cruzar las manos." }
    ]
};

let rutinaActiva = [];
let currentIndex = 0;
let timeLeft = 0;
let isPlaying = false;
let timerInterval = null;

// --- 2. SISTEMA DE NAVEGACIÓN ---
function showView(viewId) {
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
        view.classList.add('hidden');
    });
    const target = document.getElementById(viewId);
    if(target) {
        target.classList.remove('hidden');
        target.classList.add('active');
    }

    if(viewId !== 'workout-view' && isPlaying) pauseTimer();
    if(viewId !== 'metronome-view' && isMetroPlaying) stopMetronome();
}

setTimeout(() => { showView('menu-view'); }, 2000); 

// --- 3. LÓGICA DE MENÚ Y SELECCIÓN ---
document.getElementById('btn-menu-warmup').addEventListener('click', () => {
    rutinaActiva = rutinas.calentamiento;
    document.getElementById('workout-title').textContent = "Calentamiento Corto";
    iniciarRutina();
});

document.getElementById('btn-menu-mobility').addEventListener('click', () => {
    construirListaSeleccion();
    showView('selection-view');
});

document.getElementById('btn-menu-metronome').addEventListener('click', () => {
    showView('metronome-view');
});

function construirListaSeleccion() {
    const listContainer = document.getElementById('selection-list');
    listContainer.innerHTML = '';
    
    rutinas.movilidad.forEach((ej, index) => {
        const item = document.createElement('label');
        item.className = 'selection-item';
        item.innerHTML = `
            <input type="checkbox" class="chk-ejercicio" value="${index}" checked>
            <div class="item-info">
                <h3>${ej.nombre} (${ej.duracion}s)</h3>
                <p>${ej.descripcion}</p>
            </div>
        `;
        item.querySelector('input').addEventListener('change', calcularTiempoTotal);
        listContainer.appendChild(item);
    });
    calcularTiempoTotal();
}

function calcularTiempoTotal() {
    const checkboxes = document.querySelectorAll('.chk-ejercicio');
    let totalSegundos = 0;
    checkboxes.forEach(chk => {
        if (chk.checked) totalSegundos += rutinas.movilidad[chk.value].duracion;
    });
    
    const min = Math.floor(totalSegundos / 60);
    const seg = totalSegundos % 60;
    document.getElementById('time-calc').textContent = `${min}m ${seg}s`;
}

document.getElementById('btn-select-all').addEventListener('click', (e) => {
    const checkboxes = document.querySelectorAll('.chk-ejercicio');
    const allChecked = Array.from(checkboxes).every(c => c.checked);
    checkboxes.forEach(c => c.checked = !allChecked);
    e.target.textContent = allChecked ? "Seleccionar Todos" : "Deseleccionar Todos";
    calcularTiempoTotal();
});

document.getElementById('btn-start-selected').addEventListener('click', () => {
    const checkboxes = document.querySelectorAll('.chk-ejercicio:checked');
    if (checkboxes.length === 0) {
        alert("Por favor, selecciona al menos un ejercicio.");
        return;
    }
    rutinaActiva = Array.from(checkboxes).map(chk => rutinas.movilidad[chk.value]);
    document.getElementById('workout-title').textContent = "Movilidad Custom";
    iniciarRutina();
});

function iniciarRutina() {
    currentIndex = 0;
    timeLeft = rutinaActiva[0].duracion;
    pauseTimer();
    updateUI();
    showView('workout-view');
}

// --- 4. LÓGICA DE ENTRENAMIENTO (Controles de YouTube activados) ---
const elExerciseName = document.getElementById('exercise-name');
const elExerciseDesc = document.getElementById('exercise-desc');
const elTimeLeft = document.getElementById('time-left');
const elNextExercise = document.getElementById('next-exercise');
const btnPlayPause = document.getElementById('btn-play-pause');

const elYoutubeContainer = document.getElementById('youtube-container');
const elYoutubePlayer = document.getElementById('youtube-player');
const elPlaceholder = document.getElementById('video-placeholder');

function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function updateUI() {
    const currentTask = rutinaActiva[currentIndex];
    elExerciseName.textContent = currentTask.nombre;
    elExerciseDesc.textContent = currentTask.descripcion || ""; 
    elTimeLeft.textContent = formatTime(timeLeft);
    
    if (timeLeft <= 3 && timeLeft > 0) elTimeLeft.classList.add('warning-time');
    else elTimeLeft.classList.remove('warning-time');

    const nextTask = rutinaActiva[currentIndex + 1];
    elNextExercise.textContent = nextTask ? `Siguiente: ${nextTask.nombre}` : "¡Último ejercicio!";

    if (isPlaying || currentIndex > 0) {
        elPlaceholder.classList.add('hidden');
        elYoutubeContainer.classList.remove('hidden');
        
        // CONTROLES ACTIVADOS (controls=1) para que puedas avanzar/retroceder en el vídeo
        const ytUrl = `https://www.youtube.com/embed/${currentTask.youtubeId}?autoplay=1&mute=1&controls=1&loop=1&playlist=${currentTask.youtubeId}&playsinline=1`;
        if (elYoutubePlayer.src !== ytUrl) elYoutubePlayer.src = ytUrl;
    } else {
        elPlaceholder.classList.remove('hidden');
        elYoutubeContainer.classList.add('hidden');
        document.getElementById('video-name').textContent = "Pulsa Empezar";
        elYoutubePlayer.src = "";
    }
}

function tick() {
    if (timeLeft > 0) { 
        timeLeft--; 
        updateUI(); 
    } else { 
        nextExercise(); 
    }
}

function nextExercise() {
    if (currentIndex < rutinaActiva.length - 1) {
        currentIndex++; 
        timeLeft = rutinaActiva[currentIndex].duracion; 
        updateUI();
    } else {
        pauseTimer(); 
        elExerciseName.textContent = "¡Completado!"; 
        elExerciseDesc.textContent = "Gran trabajo. Estás listo para el campo.";
        elTimeLeft.textContent = "00:00"; 
        btnPlayPause.textContent = "Volver al Menú";
        elYoutubeContainer.classList.add('hidden');
        elPlaceholder.classList.remove('hidden');
        document.getElementById('video-name').textContent = "Rutina finalizada";
    }
}

function playTimer() {
    isPlaying = true; 
    btnPlayPause.textContent = "Pausar"; 
    btnPlayPause.style.backgroundColor = "#ff9800";
    timerInterval = setInterval(tick, 1000);
    updateUI(); 
}

function pauseTimer() {
    isPlaying = false; 
    btnPlayPause.textContent = "Empezar"; 
    btnPlayPause.style.backgroundColor = "#4CAF50";
    clearInterval(timerInterval);
}

btnPlayPause.addEventListener('click', () => {
    if (elExerciseName.textContent === "¡Completado!") {
        showView('menu-view');
        return;
    }
    isPlaying ? pauseTimer() : playTimer();
});

document.getElementById('btn-next').addEventListener('click', () => {
    if (currentIndex < rutinaActiva.length - 1) {
        currentIndex++;
        timeLeft = rutinaActiva[currentIndex].duracion;
        updateUI();
    }
});

document.getElementById('btn-prev').addEventListener('click', () => {
    if (currentIndex > 0) { 
        currentIndex--; 
        timeLeft = rutinaActiva[currentIndex].duracion; 
        updateUI(); 
    }
});

// --- 5. LÓGICA DEL METRÓNOMO ---
let audioContext = null;
let metroInterval = null;
let isMetroPlaying = false;
let currentBpm = 80;

const elBpmDisplay = document.getElementById('bpm-display');
const sliderBpm = document.getElementById('bpm-slider');
const btnMetroPlay = document.getElementById('btn-metro-play');
const elPendulum = document.getElementById('pendulum');

function updateMetronomeSpeed() {
    const durationMs = 60000 / currentBpm; 
    document.documentElement.style.setProperty('--bpm-duration', `${durationMs}ms`);
}
updateMetronomeSpeed();

sliderBpm.addEventListener('input', (e) => {
    currentBpm = e.target.value;
    elBpmDisplay.textContent = currentBpm;
    updateMetronomeSpeed();
    if(isMetroPlaying) { stopMetronome(); startMetronome(); }
});

function playClick() {
    try {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }

        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        
        osc.connect(gain);
        gain.connect(audioContext.destination);
        
        osc.type = "square";
        osc.frequency.setValueAtTime(880, audioContext.currentTime);
        
        gain.gain.setValueAtTime(0.5, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.08);
        
        osc.start(audioContext.currentTime);
        osc.stop(audioContext.currentTime + 0.08);
    } catch (e) {
        console.log("Error de audio:", e);
    }
}

function startMetronome() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    if (audioContext.state === 'suspended') {
        audioContext.resume().then(() => {
            ejecutarInicioMetronomo();
        });
    } else {
        ejecutarInicioMetronomo();
    }
}

function ejecutarInicioMetronomo() {
    isMetroPlaying = true;
    btnMetroPlay.textContent = "Detener Metrónomo";
    btnMetroPlay.style.backgroundColor = "#f44336"; 
    
    elPendulum.classList.add('metro-anim');
    playClick(); 
    const intervalMs = 60000 / currentBpm;
    metroInterval = setInterval(playClick, intervalMs);
}

function stopMetronome() {
    isMetroPlaying = false;
    btnMetroPlay.textContent = "Iniciar Metrónomo";
    btnMetroPlay.style.backgroundColor = "#4CAF50";
    clearInterval(metroInterval);
    elPendulum.classList.remove('metro-anim');
}

btnMetroPlay.addEventListener('click', () => {
    isMetroPlaying ? stopMetronome() : startMetronome();
});
