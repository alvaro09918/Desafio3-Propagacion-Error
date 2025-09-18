// Función para calcular el decaimiento radiactivo del carbono-14
function calculateCarbonDating() {
    try {
        const f0 = parseFloat(document.getElementById('f0').value);
        const ft = parseFloat(document.getElementById('ft').value);
        const halfLife = parseFloat(document.getElementById('halfLife').value);

        if (isNaN(f0) || isNaN(ft) || isNaN(halfLife) || f0 <= 0 || ft <= 0 || halfLife <= 0) {
            throw new Error('Por favor, ingrese valores válidos y positivos.');
        }

        if (ft > f0) {
            throw new Error('La cantidad actual no puede ser mayor que la inicial.');
        }

        // Calcular la constante de decaimiento k
        const k = Math.log(2) / halfLife;

        // Calcular la edad usando t = ln(f0/ft) / k
        const age = Math.log(f0 / ft) / k;

        const resultDiv = document.getElementById('carbonResult');
        resultDiv.innerHTML = `
            <h4>Resultado:</h4>
            <div class="success">
                <p><strong>Edad estimada:</strong> ${age.toFixed(2)} años</p>
                <p><strong>Constante de decaimiento (k):</strong> ${k.toExponential(6)} año⁻¹</p>
            </div>
            <div class="steps">
                <h5>Cálculos paso a paso:</h5>
                <ol>
                    <li>k = ln(2) / vida_media = ${k.toExponential(6)}</li>
                    <li>t = ln(f₀/f(t)) / k</li>
                    <li>t = ln(${f0}/${ft}) / ${k.toExponential(6)}</li>
                    <li>t = ${Math.log(f0/ft).toFixed(6)} / ${k.toExponential(6)}</li>
                    <li>t = ${age.toFixed(2)} años</li>
                </ol>
            </div>
        `;
    } catch (error) {
        const resultDiv = document.getElementById('carbonResult');
        resultDiv.innerHTML = `
            <h4>Error:</h4>
            <p class="error">${error.message}</p>
        `;
    }
}

// Función para calcular la ley de enfriamiento de Newton
function calculateNewtonCooling() {
    try {
        const T0 = parseFloat(document.getElementById('t0').value);
        const Ts = parseFloat(document.getElementById('ts').value);
        const T1 = parseFloat(document.getElementById('t1').value);
        const targetTime = parseFloat(document.getElementById('targetTime').value);

        if (isNaN(T0) || isNaN(Ts) || isNaN(T1) || isNaN(targetTime)) {
            throw new Error('Por favor, ingrese valores válidos.');
        }

        if (targetTime < 0) {
            throw new Error('El tiempo no puede ser negativo.');
        }

        // Calcular la constante k usando los datos de 1 hora
        // T1 = Ts + (T0 - Ts) * e^(-k*1)
        // Despejando k: k = -ln((T1 - Ts)/(T0 - Ts))
        
        if (T0 === Ts) {
            throw new Error('La temperatura inicial no puede ser igual a la temperatura del entorno.');
        }

        const ratio = (T1 - Ts) / (T0 - Ts);
        
        if (ratio <= 0) {
            throw new Error('Los valores de temperatura son inconsistentes con el modelo de enfriamiento.');
        }

        const k = -Math.log(ratio);

        // Calcular la temperatura en el tiempo objetivo
        const Tt = Ts + (T0 - Ts) * Math.exp(-k * targetTime);

        const resultDiv = document.getElementById('newtonResult');
        resultDiv.innerHTML = `
            <h4>Resultado:</h4>
            <div class="success">
                <p><strong>Temperatura a las ${targetTime} horas:</strong> ${Tt.toFixed(2)}°F</p>
                <p><strong>Constante de enfriamiento (k):</strong> ${k.toFixed(6)} h⁻¹</p>
            </div>
            <div class="steps">
                <h5>Cálculos paso a paso:</h5>
                <ol>
                    <li>Usando T(1) = ${T1}°F para encontrar k:</li>
                    <li>k = -ln((T₁ - Ts)/(T₀ - Ts))</li>
                    <li>k = -ln((${T1} - ${Ts})/(${T0} - ${Ts}))</li>
                    <li>k = -ln(${ratio.toFixed(6)}) = ${k.toFixed(6)}</li>
                    <li>T(${targetTime}) = ${Ts} + (${T0} - ${Ts}) × e^(-${k.toFixed(6)} × ${targetTime})</li>
                    <li>T(${targetTime}) = ${Tt.toFixed(2)}°F</li>
                </ol>
            </div>
            <div class="formula">
                Ecuación final: T(t) = ${Ts} + ${(T0-Ts).toFixed(2)} × e^(-${k.toFixed(6)}t)
            </div>
        `;
    } catch (error) {
        const resultDiv = document.getElementById('newtonResult');
        resultDiv.innerHTML = `
            <h4>Error:</h4>
            <p class="error">${error.message}</p>
        `;
    }
}

// Función para configurar los event listeners cuando se carga la página
function setupEventListeners() {
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            // Auto-calcular después de un pequeño delay
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                if (this.id.includes('f0') || this.id.includes('ft') || this.id.includes('halfLife')) {
                    calculateCarbonDating();
                } else {
                    calculateNewtonCooling();
                }
            }, 500);
        });
    });
}

// Inicializar la aplicación cuando se carga el DOM
document.addEventListener('DOMContentLoaded', function() {
    // Configurar los event listeners para inputs
    setupEventListeners();
    
    // Cálculo inicial con valores por defecto
    calculateCarbonDating();
    calculateNewtonCooling();
});