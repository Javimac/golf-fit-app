// --- 1. BASE DE DATOS DE RUTINAS ---
const rutinas = {
    calentamiento: [
        { nombre: "Movilidad Torácica en Cuadrupedia", duracion: 60 },
        { nombre: "Círculos de Cadera Dinámicos", duracion: 60 },
        { nombre: "Rotaciones con Palo", duracion: 60 }
    ],
    movilidad: [
        { nombre: "Gato-Camello", duracion: 60 },
        { nombre: "Apertura Psoas-Ilíaco", duracion: 90 },
        { nombre: "Rotación Tumbado (Libro)", duracion: 90 }
    ]
};

let rutinaActiva = rutinas.calentamiento;
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

setTimeout(() => { showView('menu-view'); }, 2000); // Quitar Splash Screen

function cargarRutina(tipo, titulo) {
    rutinaActiva = rutinas[tipo];
    document.getElementById('workout-title').textContent = titulo;
    currentIndex = 0;
    timeLeft = rutinaActiva[0].duracion;
    pauseTimer();
    updateUI();
    showView('workout-view');
}

document.getElementById('btn-menu-warmup').addEventListener('click', () => cargarRutina('calentamiento', 'Calentamiento'));
document.getElementById('btn-menu-mobility').addEventListener('click', () => cargarRutina('movilidad', 'Movilidad'));
document.getElementById('btn-menu-metronome').addEventListener('click', () => showView('metronome-view'));

// --- 3. LÓGICA DE ENTRENAMIENTO ---
const elExerciseName = document.getElementById('exercise-name');
const elTimeLeft = document.getElementById('time-left');
const elNextExercise = document.getElementById('next-exercise');
const btnPlayPause = document.getElementById('btn-play-pause');

const elCssAnimator = document.getElementById('css-animator');
const elAnimatedTorso = document.getElementById('animated-torso');
const elPlaceholder = document.getElementById('video-placeholder');

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

    // Activar Animación CSS
    if (isPlaying || currentIndex > 0) {
        elPlaceholder.classList.add('hidden');
        elCssAnimator.classList.remove('hidden');
        elAnimatedTorso.setAttribute('class', 'anim-rotation');
    } else {
        elPlaceholder.classList.remove('hidden');
        elCssAnimator.classList.add('hidden');
        document.getElementById('video-name').textContent = "Pulsa Empezar para animar";
        elAnimatedTorso.setAttribute('class', '');
    }
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
        elCssAnimator.classList.add('hidden');
        elPlaceholder.classList.remove('hidden');
        document.getElementById('video-name').textContent = "Rutina finalizada";
    }
}

function playTimer() {
    isPlaying = true; btnPlayPause.textContent = "Pausar"; btnPlayPause.style.backgroundColor = "#ff9800";
    timerInterval = setInterval(tick, 1000);
    updateUI(); // Arranca la animación
}

function pauseTimer() {
    isPlaying = false; btnPlayPause.textContent = "Empezar"; btnPlayPause.style.backgroundColor = "#4CAF50";
    clearInterval(timerInterval);
    elAnimatedTorso.setAttribute('class', ''); // Pausa la animación
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

// --- 4. LÓGICA DEL METRÓNOMO ---
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

function playClick() {
    if (!audioContext) return;
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    
    osc.connect(gain);
    gain.connect(audioContext.destination);
    
    osc.type = "square";
    osc.frequency.setValueAtTime(800, audioContext.currentTime);
    osc.frequency.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.05);
    
    gain.gain.setValueAtTime(1, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.05);
    
    osc.start(audioContext.currentTime);
    osc.stop(audioContext.currentTime + 0.05);
}

function startMetronome() {
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
