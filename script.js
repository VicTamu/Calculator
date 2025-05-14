const display = document.getElementById('display');
let memory = 0;

function toggleMenu() {
  const menu = document.getElementById('dropdownMenu');
  menu.classList.toggle('show');
}

function switchCalculator(type) {
  const simpleCalc = document.getElementById('simpleCalculator');
  const scientificCalc = document.getElementById('scientificCalculator');
  
  if (type === 'simple') {
    simpleCalc.style.display = 'block';
    scientificCalc.style.display = 'none';
  } else if (type === 'scientific') {
    simpleCalc.style.display = 'none';
    scientificCalc.style.display = 'block';
  }
  
  // Close the menu after selection
  document.getElementById('dropdownMenu').classList.remove('show');
}

// Close menu when clicking outside
document.addEventListener('click', function(event) {
  const menu = document.getElementById('dropdownMenu');
  const menuIcon = document.querySelector('.menu-icon');
  
  if (!menuIcon.contains(event.target) && !menu.contains(event.target)) {
    menu.classList.remove('show');
  }
});

function append(value) {
  if (display.textContent === '0' || display.textContent === '') {
    display.textContent = value;
  } else {
    display.textContent += value;
  }
}

function calculate() {
  try {
    display.textContent = eval(display.textContent);
  } catch {
    display.textContent = 'Error';
  }
}

function clearDisplay() {
  display.textContent = '';
}

function memoryStore() {
  try {
    memory = eval(display.textContent);
  } catch {
    display.textContent = 'Error';
  }
}

function memoryRecall() {
  display.textContent += memory;
}

function memoryClear() {
  memory = 0;
}

function deleteLast() {
  display.textContent = display.textContent.slice(0, -1);
}

// Keyboard support for calculator
window.addEventListener('keydown', function(event) {
  // Prevent default behavior for calculator keys
  if (['Enter', 'Escape', 'Backspace', '+', '-', '*', '/', '.', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(event.key)) {
    event.preventDefault();
  }

  if (event.key === 'Enter') {
    calculate();
  } else if (event.key === 'Escape') {
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
  } else if (event.key === 'm' && event.ctrlKey) {
    // Memory shortcuts
    if (event.shiftKey) {
      memoryStore(); // Ctrl + Shift + M for Memory Store
    } else if (event.altKey) {
      memoryClear(); // Ctrl + Alt + M for Memory Clear
    } else {
      memoryRecall(); // Ctrl + M for Memory Recall
    }
  }
});
