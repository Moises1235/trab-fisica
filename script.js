// Get canvas and context
const canvas = document.getElementById('waveCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size dynamically
canvas.width = window.innerWidth * 0.6;
canvas.height = 400;

// Default parameters
let amplitude = 100;
let frequency = 1;
let speed = 2;
let wavelength = 300; // Initial wavelength, will be recalculated
let time = 0;
let waveType = 'sine'; // Default wave type
let isPaused = false; // Control pause state

// Input controls
const amplitudeSlider = document.getElementById('amplitude');
const frequencySlider = document.getElementById('frequency');
const wavelengthSlider = document.getElementById('wavelength');
const speedSlider = document.getElementById('speed');

// Display values
const amplitudeValue = document.getElementById('amplitudeValue');
const frequencyValue = document.getElementById('frequencyValue');
const wavelengthValue = document.getElementById('wavelengthValue');
const speedValue = document.getElementById('speedValue');

// Button to start simulation
const startSimulationBtn = document.getElementById('startSimulationBtn');
const simulationSection = document.getElementById('simulationSection');
const explanation = document.getElementById('explanation');

// Set up wave type buttons
const sineWaveBtn = document.getElementById('sineWaveBtn');
const triangleWaveBtn = document.getElementById('triangleWaveBtn');
const squareWaveBtn = document.getElementById('squareWaveBtn');

// Event listeners for wave type selection
sineWaveBtn.addEventListener('click', () => {
    waveType = 'sine';
    updateExplanation();
    if (isPaused) drawWave(); // Update immediately if paused
});

triangleWaveBtn.addEventListener('click', () => {
    waveType = 'triangle';
    updateExplanation();
    if (isPaused) drawWave(); // Update immediately if paused
});

squareWaveBtn.addEventListener('click', () => {
    waveType = 'square';
    updateExplanation();
    if (isPaused) drawWave(); // Update immediately if paused
});

// Slider event listeners
amplitudeSlider.addEventListener('input', () => {
    amplitude = parseFloat(amplitudeSlider.value);
    updateDisplay();
});
frequencySlider.addEventListener('input', () => {
    frequency = parseFloat(frequencySlider.value);
    wavelength = calculateWavelength(frequency); // Adjust wavelength based on frequency
    updateDisplay();
});
wavelengthSlider.addEventListener('input', () => {
    wavelength = parseFloat(wavelengthSlider.value);
    frequency = calculateFrequency(wavelength); // Adjust frequency based on wavelength
    updateDisplay();
});
speedSlider.addEventListener('input', () => {
    speed = parseFloat(speedSlider.value);
    updateDisplay();
});

// Display values
function updateDisplay() {
    amplitudeValue.textContent = amplitude.toFixed(0);
    frequencyValue.textContent = frequency.toFixed(1);
    wavelengthValue.textContent = wavelength.toFixed(0);
    speedValue.textContent = speed.toFixed(0);

    amplitudeSlider.value = amplitude;
    frequencySlider.value = frequency;
    wavelengthSlider.value = wavelength;
    speedSlider.value = speed;
}

// Function to calculate wavelength based on frequency
function calculateWavelength(frequency) {
    const waveSpeed = 200; // You can change this value if needed, it's the speed of the wave
    return waveSpeed / frequency;
}

// Function to calculate frequency based on wavelength
function calculateFrequency(wavelength) {
    const waveSpeed = 200; // You can change this value if needed, it's the speed of the wave
    return waveSpeed / wavelength;
}

function updateExplanation() {
    if (waveType === 'sine') {
        explanation.innerHTML = '<p>A onda senoidal é caracterizada por seu movimento suave e contínuo. Ela é ideal para representar muitos fenômenos naturais, como luz, som e ondas de rádio, pois não apresenta interrupções abruptas.</p>';
        // Alterar as cores diretamente no JavaScript
        explanation.style.backgroundColor = '#f0f8ff'; // Cor de fundo
        explanation.style.color = '#333'; // Cor do texto
        explanation.style.borderColor = '#2193b0'; // Cor da borda
    } else if (waveType === 'triangle') {
        explanation.innerHTML = '<p>A onda triangular é uma forma que se alterna entre picos e vales com transições lineares. Ela tem uma aparência de "dente de serra" suave, sendo útil para representar sinais de modulação e alguns tipos de sinais de áudio.</p>';
        // Alterar as cores para onda triangular
        explanation.style.backgroundColor = '#fff5e1';
        explanation.style.color = '#4f4f4f';
        explanation.style.borderColor = '#f39c12';
    } else if (waveType === 'square') {
        explanation.innerHTML = '<p>A onda quadrada alterna abruptamente entre dois níveis de amplitude. Sua transição é instantânea, e é comum em circuitos digitais e sinais de controle, pois representa uma forma de "ligado/desligado".</p>';
        // Alterar as cores para onda quadrada
        explanation.style.backgroundColor = '#d6eaf8';
        explanation.style.color = '#250';
        explanation.style.borderColor = '#2980b9';
    }
    explanation.style.display = 'block';
}

// Function to draw the wave
function drawWave() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerY = canvas.height / 2; // Centralize the Y axis

    // Define stroke colors based on wave type
    if (waveType === 'sine') {
        ctx.strokeStyle = '#2193b0'; // Blue for sine wave
    } else if (waveType === 'triangle') {
        ctx.strokeStyle = '#f39c12'; // Orange for triangle wave
    } else if (waveType === 'square') {
        ctx.strokeStyle = '#e74c3c'; // Red for square wave
    }

    ctx.lineWidth = 2;
    ctx.beginPath();

    for (let x = 0; x < canvas.width; x++) {
        let y;
        const phaseShift = speed * time; // Smooth time-based movement

        if (waveType === 'sine') {
            y = centerY + amplitude * Math.sin((2 * Math.PI * x) / wavelength - phaseShift);
        } else if (waveType === 'triangle') {
            // Adjusting formula to create a triangular wave
            const t = (x / wavelength + phaseShift) % 1;  // Ensure smooth transition over time
            // Make the wave smooth and triangular, with correct oscillation
            y = centerY + amplitude * (2 * Math.abs(t - 0.5) - 1); // Creating triangular wave pattern
        } else if (waveType === 'square') {
            y = centerY + amplitude * (Math.sin((2 * Math.PI * x) / wavelength - phaseShift) > 0 ? 1 : -1);
        }

        if (x === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    ctx.stroke();

    time += 0.02; // Increment time for smoother animation
}

// Loop animation
function animate() {
    if (!isPaused) {
        drawWave();
    }
    requestAnimationFrame(animate);
}

// Start simulation
startSimulationBtn.addEventListener('click', () => {
    document.getElementById('theorySection').style.opacity = 0;
    setTimeout(() => {
        document.getElementById('theorySection').style.display = 'none';
        simulationSection.style.display = 'block';
        setTimeout(() => {
            simulationSection.style.opacity = 1;
        }, 100);
        animate();
    }, 500);
});

// Initialize display
updateDisplay();
