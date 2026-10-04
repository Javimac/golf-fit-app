// --- 1. BASE DE DATOS DE RUTINAS YOUTUBE ---
const rutinas = {
    calentamiento: [
        { nombre: "Rotaciones Torácicas", duracion: 60, youtubeId: "uGl-AG4C1Wc" }, 
        { nombre: "Limpiaparabrisas Cadera", duracion: 60, youtubeId: "t4Zz6-aG8Iw" },
        { nombre: "Rotaciones con Palo", duracion: 60, youtubeId: "Y8Xy891KIfE" }
    ],
    // Los 10 Mejores Ejercicios de Movilidad para Golf con identificadores reales
    movilidad: [
        { nombre: "Leñador de Rodillas", duracion: 60, youtubeId: "AP3UoYYV2QU" },
        { nombre: "90/90 de Cadera", duracion: 60, youtubeId: "t4Zz6-aG8Iw" },
        { nombre: "Caminar con Manos", duracion: 60, youtubeId: "XFnK5X8hKB0" },
        { nombre: "Rotación Torácica (Silla)", duracion: 60, youtubeId: "uGl-AG4C1Wc" },
        { nombre: "Gato-Vaca", duracion: 60, youtubeId: "CE_5RWjFA3Q" },
        { nombre: "El Libro Abierto", duracion: 60, youtubeId: "DmDnNGnFq2Q" },
        { nombre: "Inclinación Pélvica", duracion: 60, youtubeId: "44D6Xc2Fkek" },
        { nombre: "Zancadas Suaves", duracion: 60, youtubeId: "MxfTNXSfiYI" },
        { nombre: "Hombros con Palo", duracion: 60, youtubeId: "Y8Xy891KIfE" },
        { nombre: "Activación de Muñecas", duracion: 60, youtubeId: "jJEPWV6d7x8" }
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

setTimeout(() => { showView('menu-view'); }, 2000); 

function cargarRutina(tipo, titulo) {
    rutinaActiva = rutinas[tipo];
    document.getElementById('workout-title').textContent = titulo;
    currentIndex = 0;
    timeLeft = rutinaActiva[0].duracion;
    pauseTimer();
    updateUI();
    showView('workout-view');
}

document.getElementById('btn-menu-warmup').addEventListener('click', () => cargarRutina('calentamiento', 'Calentamiento Corto'));
document.getElementById('btn-menu-mobility').addEventListener('click', () => cargarRutina('movilidad', 'Movilidad de Golf'));
document.getElementById('btn-menu-metronome').addEventListener('click', () => showView('metronome-view'));

// --- 3. LÓGICA DE ENTRENAMIENTO (CON YOUTUBE INCRUSTADO) ---
const elExerciseName = document.getElementById('exercise-name');
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
    elTimeLeft.textContent = formatTime(timeLeft);
    
    if (timeLeft <= 3 && timeLeft > 0) elTimeLeft.classList.add('warning-time');
    else elTimeLeft.classList.remove('warning-time');

    const nextTask = rutinaActiva[currentIndex + 1];
    elNextExercise.textContent = nextTask ? `Siguiente: ${nextTask.nombre}` : "¡Último ejercicio!";

    if (isPlaying || currentIndex > 0) {
        elPlaceholder.classList.add('hidden');
        elYoutubeContainer.classList.remove('hidden');
        
        // URL con autoplay silencioso en bucle
        const ytUrl = `https://www.youtube.com/embed/${currentTask.youtubeId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${currentTask.youtubeId}&playsinline=1`;
        
        if (elYoutubePlayer.src !== ytUrl) elYoutubePlayer.src = ytUrl;
    } else {
        elPlaceholder.classList.remove('hidden');
        elYoutubeContainer.classList.add('hidden');
        document.getElementById('video-name').textContent = "Pulsa Empezar para cargar ejercicio";
        elYoutubePlayer.src = "";
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
        pauseTimer(); 
        elExerciseName.textContent = "¡Completado!"; 
        elTimeLeft.textContent = "00:00"; 
        btnPlayPause.textContent = "Reiniciar";
        elYoutubeContainer.classList.add('hidden');
        elPlaceholder.classList.remove('hidden');
        document.getElementById('video-name').textContent = "Rutina finalizada";
    }
}

function playTimer() {
    isPlaying = true; btnPlayPause.textContent = "Pausar"; btnPlayPause.style.backgroundColor = "#ff9800";
    timerInterval = setInterval(tick, 1000);
    updateUI(); 
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

// --- 4. LÓGICA DEL METRÓNOMO CON PÉNDULO VISUAL ---
let audioContext = null;
let metroInterval = null;
let isMetroPlaying = false;
let currentBpm = 80;

const elBpmDisplay = document.getElementById('bpm-display');
const sliderBpm = document.getElementById('bpm-slider');
const btnMetroPlay = document.getElementById('btn-metro-play');
const elPendulum = document.getElementById('pendulum');

// Ajusta la velocidad de la animación en función de los BPM (CSS Variable)
function updateMetronomeSpeed() {
    const durationMs = 60000 / currentBpm; 
    document.documentElement.style.setProperty('--bpm-duration', `${durationMs}ms`);
}
updateMetronomeSpeed(); // Llamada inicial

sliderBpm.addEventListener('input', (e) => {
    currentBpm = e.target.value;
    elBpmDisplay.textContent = currentBpm;
    updateMetronomeSpeed();
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
    if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
    if (audioContext.state === 'suspended') audioContext.resume();
    
    isMetroPlaying = true;
    btnMetroPlay.textContent = "Detener Metrónomo";
    btnMetroPlay.style.backgroundColor = "#f44336"; 
    
    // Iniciar Animación
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
    
    // Detener Animación
    elPendulum.classList.remove('metro-anim');
}

btnMetroPlay.addEventListener('click', () => {
    isMetroPlaying ? stopMetronome() : startMetronome();
});
