// --- 1. BASE DE DATOS DE RUTINAS ---
const rutinas = {
    calentamiento: [
        { nombre: "Movilidad Torácica", duracion: 60, video: "thoracic.mp4" },
        { nombre: "Círculos de Cadera", duracion: 60, video: "hip.mp4" },
        { nombre: "Rotaciones con Palo", duracion: 60, video: "stick.mp4" }
    ],
    movilidad: [
        { nombre: "Gato-Camello", duracion: 60, video: "cat_camel.mp4" },
        { nombre: "Apertura Psoas-Ilíaco", duracion: 90, video: "psoas.mp4" },
        { nombre: "Rotación Tumbado (Libro)", duracion: 90, video: "book_stretch.mp4" }
    ]
};

let rutinaActiva = rutinas.calentamiento; // Por defecto
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
    document.getElementById(viewId).classList.remove('hidden');
    document.getElementById(viewId).classList.add('active');

    if(viewId !== 'workout-view' && isPlaying) pauseTimer();
    if(viewId !== 'metronome-view' && isMetroPlaying) stopMetronome();
}

setTimeout(() => { showView('menu-view'); }, 2000); // Splash screen

function cargarRutina(tipo, titulo) {
    rutinaActiva = rutinas[tipo];
    document.getElementById('workout-title').textContent = titulo;
    currentIndex = 0;
    timeLeft = rutinaActiva[0].duracion;
    pauseTimer();
    updateUI();
    showView('workout-view');
}

document.getElementById('btn-menu-warmup').addEventListener('click', () => cargarRutina('calentamiento', 'Calentamiento (Tee del 1)'));
document.getElementById('btn-menu-mobility').addEventListener('click', () => cargarRutina('movilidad', 'Movilidad y Estiramientos'));
document.getElementById('btn-menu-metronome').addEventListener('click', () => showView('metronome-view'));

// --- 3. LÓGICA DE ENTRENAMIENTO ---
const elExerciseName = document.getElementById('exercise-name');
const elTimeLeft = document.getElementById('time-left');
const elNextExercise = document.getElementById('next-exercise');
const btnPlayPause = document.getElementById('btn-play-pause');

function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function updateUI() {
    const currentTask = rutinaActiva[currentIndex];
    elExerciseName.textContent = currentTask.nombre;
    elTimeLeft.textContent = formatTime(timeLeft);
    
    if (timeLeft <= 3 && timeLeft > 0) elTimeLeft.classList.add('warning-time');
    else elTimeLeft.classList.remove('warning-time');

    const nextTask = rutinaActiva[currentIndex + 1];
    elNextExercise.textContent = nextTask ? `Siguiente: ${nextTask.nombre}` : "¡Último ejercicio!";
}

function tick() {
    if (timeLeft > 0) { timeLeft--; updateUI(); } 
    else { nextExercise(); }
}

function nextExercise() {
    if (currentIndex < rutinaActiva.length - 1) {
        currentIndex++; timeLeft = rutinaActiva[currentIndex].duracion; updateUI();
    } else {
        pauseTimer(); elExerciseName.textContent = "¡Completado!"; elTimeLeft.textContent = "00:00"; btnPlayPause.textContent = "Reiniciar";
    }
}

function playTimer() {
    isPlaying = true; btnPlayPause.textContent = "Pausar"; btnPlayPause.style.backgroundColor = "#ff9800";
    timerInterval = setInterval(tick, 1000);
}

function pauseTimer() {
    isPlaying = false; btnPlayPause.textContent = "Empezar"; btnPlayPause.style.backgroundColor = "#4CAF50";
    clearInterval(timerInterval);
}

btnPlayPause.addEventListener('click', () => {
    if (elExerciseName.textContent === "¡Completado!") {
        currentIndex = 0; timeLeft = rutinaActiva[0].duracion; updateUI();
    }
    isPlaying ? pauseTimer() : playTimer();
});
document.getElementById('btn-next').addEventListener('click', nextExercise);
document.getElementById('btn-prev').addEventListener('click', () => {
    if (currentIndex > 0) { currentIndex--; timeLeft = rutinaActiva[currentIndex].duracion; updateUI(); }
});


// --- 4. LÓGICA DEL METRÓNOMO (Motor de Audio Corregido) ---
let audioContext = null;
let metroInterval = null;
let isMetroPlaying = false;
let currentBpm = 80;

const elBpmDisplay = document.getElementById('bpm-display');
const sliderBpm = document.getElementById('bpm-slider');
const btnMetroPlay = document.getElementById('btn-metro-play');

sliderBpm.addEventListener('input', (e) => {
    currentBpm = e.target.value;
    elBpmDisplay.textContent = currentBpm;
    if(isMetroPlaying) {
        stopMetronome();
        startMetronome(); 
    }
});

// Función de sonido percusiva y compatible con iOS
function playClick() {
    if (!audioContext) return;
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    
    osc.connect(gain);
    gain.connect(audioContext.destination);
    
    // Usar onda cuadrada suena más fuerte y parecido a un "clic" mecánico
    osc.type = "square";
    osc.frequency.setValueAtTime(800, audioContext.currentTime);
    osc.frequency.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.05); // Caída rápida de frecuencia
    
    gain.gain.setValueAtTime(1, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.05); // Caída rápida de volumen
    
    osc.start(audioContext.currentTime);
    osc.stop(audioContext.currentTime + 0.05);
}

function startMetronome() {
    // Desbloqueo forzado del AudioContext en móviles al pulsar el botón
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
    
    isMetroPlaying = true;
    btnMetroPlay.textContent = "Detener Metrónomo";
    btnMetroPlay.style.backgroundColor = "#f44336"; 
    
    playClick(); 
    const intervalMs = 60000 / currentBpm;
    metroInterval = setInterval(playClick, intervalMs);
}

function stopMetronome() {
    isMetroPlaying = false;
    btnMetroPlay.textContent = "Iniciar Metrónomo";
    btnMetroPlay.style.backgroundColor = "#4CAF50";
    clearInterval(metroInterval);
}

btnMetroPlay.addEventListener('click', () => {
    isMetroPlaying ? stopMetronome() : startMetronome();
});
