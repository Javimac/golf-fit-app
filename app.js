// --- 1. SISTEMA DE NAVEGACIÓN ---
function showView(viewId) {
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
        view.classList.add('hidden');
    });
    document.getElementById(viewId).classList.remove('hidden');
    document.getElementById(viewId).classList.add('active');

    // Pausar cosas al salir de la pantalla
    if(viewId !== 'workout-view' && isPlaying) pauseTimer();
    if(viewId !== 'metronome-view' && isMetroPlaying) stopMetronome();
}

// Ocultar Splash Screen tras 2 segundos
setTimeout(() => {
    showView('menu-view');
}, 2000);

// Botones del menú
document.getElementById('btn-menu-warmup').addEventListener('click', () => {
    showView('workout-view');
    updateUI(); // Refresca la vista de entrenamiento
});
document.getElementById('btn-menu-metronome').addEventListener('click', () => {
    showView('metronome-view');
});

// --- 2. LÓGICA DE ENTRENAMIENTO (Mantenida) ---
const workout = [
    { nombre: "Movilidad Torácica", duracion: 60, video: "thoracic.mp4" },
    { nombre: "Círculos de Cadera", duracion: 60, video: "hip.mp4" },
    { nombre: "Rotaciones Palo", duracion: 60, video: "stick.mp4" }
];

let currentIndex = 0;
let timeLeft = workout[0].duracion;
let isPlaying = false;
let timerInterval = null;

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
    const currentTask = workout[currentIndex];
    elExerciseName.textContent = currentTask.nombre;
    elTimeLeft.textContent = formatTime(timeLeft);
    
    if (timeLeft <= 3 && timeLeft > 0) elTimeLeft.classList.add('warning-time');
    else elTimeLeft.classList.remove('warning-time');

    const nextTask = workout[currentIndex + 1];
    elNextExercise.textContent = nextTask ? `Siguiente: ${nextTask.nombre}` : "¡Último ejercicio!";
}

function tick() {
    if (timeLeft > 0) { timeLeft--; updateUI(); } 
    else { nextExercise(); }
}

function nextExercise() {
    if (currentIndex < workout.length - 1) {
        currentIndex++; timeLeft = workout[currentIndex].duracion; updateUI();
    } else {
        pauseTimer(); elExerciseName.textContent = "¡Completado!"; elTimeLeft.textContent = "00:00"; btnPlayPause.textContent = "Reiniciar";
    }
}

function playTimer() {
    isPlaying = true; btnPlayPause.textContent = "Pausar"; btnPlayPause.style.backgroundColor = "#ff9800";
    timerInterval = setInterval(tick, 1000);
}

function pauseTimer() {
    isPlaying = false; btnPlayPause.textContent = "Reanudar"; btnPlayPause.style.backgroundColor = "#4CAF50";
    clearInterval(timerInterval);
}

btnPlayPause.addEventListener('click', () => {
    if (elExerciseName.textContent === "¡Completado!") {
        currentIndex = 0; timeLeft = workout[0].duracion; updateUI();
    }
    isPlaying ? pauseTimer() : playTimer();
});
document.getElementById('btn-next').addEventListener('click', nextExercise);
document.getElementById('btn-prev').addEventListener('click', () => {
    if (currentIndex > 0) { currentIndex--; timeLeft = workout[currentIndex].duracion; updateUI(); }
});

// --- 3. LÓGICA DEL METRÓNOMO ---
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
        startMetronome(); // Reinicia con el nuevo ritmo
    }
});

// Usamos la API de Audio nativa para pitidos exactos sin retraso
function playClick() {
    if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    
    osc.connect(gain);
    gain.connect(audioContext.destination);
    
    osc.frequency.value = 800; // Tono agudo
    osc.type = "sine";
    
    gain.gain.setValueAtTime(1, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1); // Pitido muy corto y seco
    
    osc.start(audioContext.currentTime);
    osc.stop(audioContext.currentTime + 0.1);
}

function startMetronome() {
    if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
    if (audioContext.state === 'suspended') audioContext.resume(); // Requisito de navegadores móviles
    
    isMetroPlaying = true;
    btnMetroPlay.textContent = "Detener Metrónomo";
    btnMetroPlay.style.backgroundColor = "#f44336"; // Rojo para parar
    
    playClick(); // Primer pitido inmediato
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
