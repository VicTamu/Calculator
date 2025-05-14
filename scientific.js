let currentMode = 'math';
let displayValue = '';
let memory = 0;
let lastResult = 0;
let currentOperation = null;
let waitingForOperand = false;

// Mode switching
function switchMode(mode) {
    currentMode = mode;
    const calculator = document.querySelector('.scientific-calculator');
    calculator.classList.remove('math-mode', 'chemistry-mode', 'physics-mode');
    calculator.classList.add(`${mode}-mode`);
    
    // Show all scientific buttons in math mode
    if (mode === 'math') {
        const scientificButtons = document.querySelectorAll('.scientific');
        scientificButtons.forEach(button => {
            button.style.display = 'flex';
        });
    }
    
    // Only hide/show mode-specific buttons (chemistry and physics)
    const buttons = document.querySelectorAll('.chemistry, .physics');
    buttons.forEach(button => {
        button.style.display = 'none';
    });
    
    const modeButtons = document.querySelectorAll(`.${mode}`);
    modeButtons.forEach(button => {
        button.style.display = 'block';
    });
    
    clearDisplay();
}

// Display functions
function updateDisplay() {
    const display = document.getElementById('display');
    display.textContent = displayValue === '' ? '' : displayValue;
}

function clearDisplay() {
    displayValue = '';
    currentOperation = null;
    waitingForOperand = false;
    updateDisplay();
}

function append(value) {
    if (waitingForOperand) {
        displayValue = value;
        waitingForOperand = false;
    } else {
        displayValue = displayValue === '0' ? value : displayValue + value;
    }
    updateDisplay();
}

// Mathematical Functions
function calculate(operation) {
    const value = parseFloat(displayValue);
    
    switch(operation) {
        // Basic Math
        case 'sin':
            displayValue = Math.sin(value * Math.PI / 180).toString();
            break;
        case 'cos':
            displayValue = Math.cos(value * Math.PI / 180).toString();
            break;
        case 'tan':
            displayValue = Math.tan(value * Math.PI / 180).toString();
            break;
        case 'arcsin':
            displayValue = (Math.asin(value) * 180 / Math.PI).toString();
            break;
        case 'arccos':
            displayValue = (Math.acos(value) * 180 / Math.PI).toString();
            break;
        case 'sinh':
            displayValue = Math.sinh(value).toString();
            break;
        case 'cosh':
            displayValue = Math.cosh(value).toString();
            break;
        case 'tanh':
            displayValue = Math.tanh(value).toString();
            break;
        case 'arsinh':
            displayValue = Math.asinh(value).toString();
            break;
        case 'arcosh':
            displayValue = Math.acosh(value).toString();
            break;
        case 'sqrt':
            displayValue = Math.sqrt(value).toString();
            break;
        case 'square':
            displayValue = (value * value).toString();
            break;
        case 'cube':
            displayValue = (value * value * value).toString();
            break;
        case 'log':
            displayValue = Math.log10(value).toString();
            break;
        case 'ln':
            displayValue = Math.log(value).toString();
            break;
        case 'log2':
            displayValue = Math.log2(value).toString();
            break;
        case 'logb':
            promptForValues(['base'], (values) => {
                displayValue = (Math.log(value) / Math.log(values[0])).toString();
                updateDisplay();
            });
            return;
        case 'exp':
            displayValue = Math.exp(value).toString();
            break;
        case 'pi':
            displayValue = Math.PI.toString();
            break;
        case 'e':
            displayValue = Math.E.toString();
            break;
        case 'factorial':
            displayValue = factorial(value).toString();
            break;

        // Chemistry Functions
        case 'molarity':
            // M = moles of solute / liters of solution
            promptForValues(['moles', 'liters'], (values) => {
                displayValue = (values[0] / values[1]).toString();
                updateDisplay();
            });
            return;
        case 'molality':
            // m = moles of solute / kg of solvent
            promptForValues(['moles', 'kg'], (values) => {
                displayValue = (values[0] / values[1]).toString();
                updateDisplay();
            });
            return;
        case 'dilution':
            // M1V1 = M2V2
            promptForValues(['M1', 'V1', 'M2'], (values) => {
                displayValue = ((values[0] * values[1]) / values[2]).toString();
                updateDisplay();
            });
            return;
        case 'ph':
            // pH = -log[H+]
            displayValue = (-Math.log10(value)).toString();
            break;

        // Physics Functions
        case 'velocity':
            // v = d/t
            promptForValues(['distance', 'time'], (values) => {
                displayValue = (values[0] / values[1]).toString();
                updateDisplay();
            });
            return;
        case 'acceleration':
            // a = (v2-v1)/t
            promptForValues(['v2', 'v1', 'time'], (values) => {
                displayValue = ((values[0] - values[1]) / values[2]).toString();
                updateDisplay();
            });
            return;
        case 'force':
            // F = ma
            promptForValues(['mass', 'acceleration'], (values) => {
                displayValue = (values[0] * values[1]).toString();
                updateDisplay();
            });
            return;
        case 'energy':
            // E = mc²
            promptForValues(['mass'], (values) => {
                displayValue = (values[0] * Math.pow(299792458, 2)).toString();
                updateDisplay();
            });
            return;
    }
    
    updateDisplay();
    waitingForOperand = true;
}

// Helper Functions
function factorial(n) {
    if (n < 0) return NaN;
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}

function promptForValues(labels, callback) {
    const unitOptions = {
        mass: [
            { label: 'kg', factor: 1 },
            { label: 'g', factor: 0.001 },
            { label: 'lb', factor: 0.453592 }
        ],
        distance: [
            { label: 'm', factor: 1 },
            { label: 'km', factor: 1000 },
            { label: 'cm', factor: 0.01 },
            { label: 'mm', factor: 0.001 },
            { label: 'mi', factor: 1609.34 },
            { label: 'ft', factor: 0.3048 }
        ],
        time: [
            { label: 's', factor: 1 },
            { label: 'min', factor: 60 },
            { label: 'h', factor: 3600 }
        ],
        acceleration: [
            { label: 'm/s²', factor: 1 }
        ],
        kg: [
            { label: 'kg', factor: 1 }
        ],
        liters: [
            { label: 'L', factor: 1 },
            { label: 'mL', factor: 0.001 }
        ]
    };

    const inlineInputs = document.getElementById('inline-inputs');
    inlineInputs.innerHTML = '';
    inlineInputs.style.display = 'flex';
    inlineInputs.style.gap = '12px';
    inlineInputs.style.justifyContent = 'center';
    
    // Create input fields for each label
    const inputFields = labels.map(label => {
        const wrapper = document.createElement('div');
        wrapper.style.display = 'flex';
        wrapper.style.flexDirection = 'column';
        wrapper.style.alignItems = 'center';
        wrapper.style.marginRight = '8px';
        const input = document.createElement('input');
        input.type = 'number';
        input.placeholder = label.charAt(0).toUpperCase() + label.slice(1);
        input.style.padding = '6px 10px';
        input.style.borderRadius = '6px';
        input.style.border = '1.5px solid #bdbdbd';
        input.style.fontSize = '1em';
        input.style.width = '90px';
        input.style.marginBottom = '4px';
        input.required = true;
        wrapper.appendChild(input);
        // Add unit selector if available
        let unitSelect = null;
        if (unitOptions[label]) {
            unitSelect = document.createElement('select');
            unitSelect.style.marginTop = '2px';
            unitSelect.style.padding = '4px 8px';
            unitSelect.style.borderRadius = '6px';
            unitSelect.style.border = '1.5px solid #bdbdbd';
            unitSelect.style.fontSize = '0.95em';
            unitOptions[label].forEach(opt => {
                const option = document.createElement('option');
                option.value = opt.factor;
                option.textContent = opt.label;
                unitSelect.appendChild(option);
            });
            wrapper.appendChild(unitSelect);
        }
        const labelElem = document.createElement('span');
        labelElem.textContent = label.charAt(0).toUpperCase() + label.slice(1);
        labelElem.style.fontSize = '0.95em';
        labelElem.style.color = '#fdbb2d';
        wrapper.appendChild(labelElem);
        inlineInputs.appendChild(wrapper);
        return { input, unitSelect };
    });

    // Create submit button
    const submitBtn = document.createElement('button');
    submitBtn.textContent = 'Calculate';
    submitBtn.style.padding = '8px 18px';
    submitBtn.style.marginLeft = '12px';
    submitBtn.style.borderRadius = '8px';
    submitBtn.style.background = 'linear-gradient(135deg, #1a2a6c 0%, #fdbb2d 100%)';
    submitBtn.style.color = '#fff';
    submitBtn.style.fontWeight = '600';
    submitBtn.style.fontSize = '1.1em';
    submitBtn.style.border = 'none';
    submitBtn.style.cursor = 'pointer';
    submitBtn.style.boxShadow = '0 2px 8px rgba(26,42,108,0.10)';
    submitBtn.onmouseover = () => {
        submitBtn.style.background = 'linear-gradient(135deg, #fdbb2d 0%, #1a2a6c 100%)';
        submitBtn.style.color = '#1a2a6c';
    };
    submitBtn.onmouseout = () => {
        submitBtn.style.background = 'linear-gradient(135deg, #1a2a6c 0%, #fdbb2d 100%)';
        submitBtn.style.color = '#fff';
    };
    
    // Handle submit
    submitBtn.onclick = () => {
        const values = inputFields.map(({ input, unitSelect }, idx) => {
            let val = parseFloat(input.value);
            if (isNaN(val)) return NaN;
            if (unitSelect) {
                const factor = parseFloat(unitSelect.value);
                val = val * factor; // Convert to SI unit
            }
            return val;
        });
        if (values.some(isNaN)) {
            // Optionally, show an error or shake the fields
            inputFields.forEach(({ input }, idx) => {
                if (isNaN(parseFloat(input.value))) {
                    input.style.borderColor = '#b21f1f';
                } else {
                    input.style.borderColor = '#bdbdbd';
                }
            });
            return;
        }
        inlineInputs.style.display = 'none';
        inlineInputs.innerHTML = '';
        callback(values);
    };
    inlineInputs.appendChild(submitBtn);
}

// Menu Toggle
function toggleMenu() {
    const menu = document.getElementById('dropdownMenu');
    menu.classList.toggle('show');
}

// Close menu when clicking outside
window.onclick = function(event) {
    if (!event.target.matches('.menu-icon') && !event.target.matches('.menu-icon i')) {
        const menu = document.getElementById('dropdownMenu');
        if (menu.classList.contains('show')) {
            menu.classList.remove('show');
        }
    }
}

// Initialize calculator
document.addEventListener('DOMContentLoaded', () => {
    // Ensure calculator starts in math mode
    const calculator = document.querySelector('.scientific-calculator');
    calculator.classList.add('math-mode');
    
    // Show all scientific buttons
    const scientificButtons = document.querySelectorAll('.scientific');
    scientificButtons.forEach(button => {
        button.style.display = 'flex';
    });
    
    switchMode('math');
});

// Keyboard support for scientific calculator
window.addEventListener('keydown', function(event) {
    // If focus is on an input (e.g., inline input fields), let the browser handle it
    if (document.activeElement && document.activeElement.tagName === 'INPUT') return;

    if (event.key === 'Enter') {
        event.preventDefault();
        calculate();
    } else if (event.key === 'Escape') {
        event.preventDefault();
        clearDisplay();
    } else if (/^[0-9]$/.test(event.key)) {
        append(event.key);
    } else if (event.key === '.') {
        append('.');
    } else if (event.key === '+') {
        append('+');
    } else if (event.key === '-') {
        append('-');
    } else if (event.key === '*' || event.key === 'x' || event.key === 'X') {
        append('*');
    } else if (event.key === '/') {
        append('/');
    } else if (event.key === 'Backspace') {
        deleteLast();
    }
}); 