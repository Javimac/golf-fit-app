// Base de datos local de la rutina
const workout = [
    { nombre: "Movilidad Torácica en Cuadrupedia", duracion: 60, video: "thoracic_quad.mp4" },
    { nombre: "Círculos de Cadera Dinámicos", duracion: 60, video: "hip_circles.mp4" },
    { nombre: "Rotaciones con Palo", duracion: 60, video: "stick_rotations.mp4" },
    { nombre: "Monster Walks", duracion: 90, video: "monster_walks.mp4" },
    { nombre: "Descanso Activo", duracion: 30, video: "rest.mp4" }
];

let currentIndex = 0;
let timeLeft = workout[0].duracion;
let isPlaying = false;
let timerInterval = null;

// Elementos del DOM
const elExerciseName = document.getElementById('exercise-name');
const elTimeLeft = document.getElementById('time-left');
const elNextExercise = document.getElementById('next-exercise');
const elVideoName = document.getElementById('video-name');
const btnPlayPause = document.getElementById('btn-play-pause');
const btnNext = document.getElementById('btn-next');
const btnPrev = document.getElementById('btn-prev');

function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function updateUI() {
    const currentTask = workout[currentIndex];
    elExerciseName.textContent = currentTask.nombre;
    elTimeLeft.textContent = formatTime(timeLeft);
    elVideoName.textContent = `Clip en bucle: ${currentTask.video}`;
    
    // Alerta visual en los últimos 3 segundos
    if (timeLeft <= 3 && timeLeft > 0) {
        elTimeLeft.classList.add('warning-time');
    } else {
        elTimeLeft.classList.remove('warning-time');
    }

    const nextTask = workout[currentIndex + 1];
    elNextExercise.textContent = nextTask ? `Siguiente: ${nextTask.nombre}` : "¡Último ejercicio!";
}

function nextExercise() {
    if (currentIndex < workout.length - 1) {
        currentIndex++;
        timeLeft = workout[currentIndex].duracion;
        updateUI();
    } else {
        pauseTimer();
        elExerciseName.textContent = "¡Rutina Completada!";
        elTimeLeft.textContent = "00:00";
        btnPlayPause.textContent = "Reiniciar";
    }
}

function prevExercise() {
    if (currentIndex > 0) {
        currentIndex--;
        timeLeft = workout[currentIndex].duracion;
        updateUI();
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

function playTimer() {
    isPlaying = true;
    btnPlayPause.textContent = "Pausar";
    btnPlayPause.style.backgroundColor = "#ff9800";
    timerInterval = setInterval(tick, 1000);
}

function pauseTimer() {
    isPlaying = false;
    btnPlayPause.textContent = "Reanudar";
    btnPlayPause.style.backgroundColor = "#4CAF50";
    clearInterval(timerInterval);
}

// Event Listeners
btnPlayPause.addEventListener('click', () => {
    if (elExerciseName.textContent === "¡Rutina Completada!") {
        currentIndex = 0;
        timeLeft = workout[0].duracion;
        updateUI();
    }
    isPlaying ? pauseTimer() : playTimer();
});

btnNext.addEventListener('click', nextExercise);
btnPrev.addEventListener('click', prevExercise);

// Inicializar la vista
updateUI();