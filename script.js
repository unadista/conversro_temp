// Referencias a elementos del DOM
const temperatureInput = document.getElementById('temperatureInput');
const fromUnitSelect = document.getElementById('fromUnit');
const toUnitSelect = document.getElementById('toUnit');
const swapBtn = document.getElementById('swapBtn');
const clearBtn = document.getElementById('clearBtn');

const resultValue = document.getElementById('resultValue');
const resultUnit = document.getElementById('resultUnit');
const resultCard = document.getElementById('resultCard');
const tempIndicator = document.getElementById('tempIndicator');
const indicatorIcon = document.getElementById('indicatorIcon');
const indicatorText = document.getElementById('indicatorText');
const errorMessage = document.getElementById('errorMessage');

// Lógica de conversión de unidades
function convertTemperature(value, from, to) {
    if (from === to) return value;

    // Convertir todo primero a Celsius
    let celsius;
    switch (from) {
        case 'C': celsius = value; break;
        case 'F': celsius = (value - 32) * (5 / 9); break;
        case 'K': celsius = value - 273.15; break;
    }

    // Convertir de Celsius a la unidad destino
    switch (to) {
        case 'C': return celsius;
        case 'F': return (celsius * (9 / 5)) + 32;
        case 'K': return celsius + 273.15;
    }
}

// Actualiza el indicador visual de frío/calor según el valor en Celsius
function updateVisualIndicator(celsius) {
    tempIndicator.classList.remove('temp-cold', 'temp-warm', 'temp-hot');

    if (celsius <= 10) {
        tempIndicator.classList.add('temp-cold');
        indicatorIcon.className = 'fa-solid fa-snowflake';
        indicatorText.textContent = 'Clima Frío';
    } else if (celsius > 10 && celsius <= 28) {
        tempIndicator.classList.add('temp-warm');
        indicatorIcon.className = 'fa-solid fa-sun';
        indicatorText.textContent = 'Clima Templado / Agradable';
    } else {
        tempIndicator.classList.add('temp-hot');
        indicatorIcon.className = 'fa-solid fa-fire';
        indicatorText.textContent = 'Clima Caluroso';
    }
}

// Procesa la entrada y realiza los cambios en la UI
function processConversion() {
    const rawValue = temperatureInput.value.trim();

    // Validar entradas vacías o no numéricas
    if (rawValue === '' || isNaN(rawValue)) {
        if (rawValue !== '') {
            errorMessage.style.display = 'block';
        } else {
            errorMessage.style.display = 'none';
        }
        resetResultDisplay();
        return;
    }

    errorMessage.style.display = 'none';
    const val = parseFloat(rawValue);
    const fromUnit = fromUnitSelect.value;
    const toUnit = toUnitSelect.value;

    const converted = convertTemperature(val, fromUnit, toUnit);

    // Formatear decimales si son requeridos
    const formattedResult = Number.isInteger(converted) 
        ? converted.toString() 
        : converted.toFixed(2);

    // Mostrar resultados en la UI
    resultValue.textContent = formattedResult;
    resultUnit.textContent = getUnitSymbol(toUnit);

    // Disparar animación de resultado
    resultCard.classList.remove('animate-pop');
    void resultCard.offsetWidth; // Forzar reflow para reiniciar la animación CSS
    resultCard.classList.add('animate-pop');

    // Obtener equivalente en Celsius para evaluar el indicador visual
    const equivalentCelsius = convertTemperature(val, fromUnit, 'C');
    updateVisualIndicator(equivalentCelsius);
}

// Retorna el símbolo de la unidad elegida
function getUnitSymbol(unit) {
    switch (unit) {
        case 'C': return '°C';
        case 'F': return '°F';
        case 'K': return 'K';
    }
}

// Restablece el componente de resultado
function resetResultDisplay() {
    resultValue.textContent = '--';
    resultUnit.textContent = getUnitSymbol(toUnitSelect.value);
    tempIndicator.className = 'temp-indicator';
    indicatorIcon.className = 'fa-solid fa-minus';
    indicatorText.textContent = 'Ingresa un valor para calcular';
}

// Intercambia las unidades de origen y destino
function swapUnits() {
    const temp = fromUnitSelect.value;
    fromUnitSelect.value = toUnitSelect.value;
    toUnitSelect.value = temp;
    processConversion();
}

// Limpia el formulario
function clearFields() {
    temperatureInput.value = '';
    errorMessage.style.display = 'none';
    resetResultDisplay();
    temperatureInput.focus();
}

// Event Listeners para tiempo real
temperatureInput.addEventListener('input', processConversion);
fromUnitSelect.addEventListener('change', processConversion);
toUnitSelect.addEventListener('change', processConversion);
swapBtn.addEventListener('click', swapUnits);
clearBtn.addEventListener('click', clearFields);
