// Constants for the tank dimensions and wall thickness
let diameter = 1.54; // meters
let length = 2.73; // meters
let wallThickness = 4; // millimeters

let effectiveRadius = diameter / 2 - wallThickness / 1000;
let effectiveLength = length - 2 * (wallThickness / 1000);

let volumeInLiters =
    Math.PI * Math.pow(effectiveRadius, 2) * effectiveLength * 1000;

let tankInfo;
let input;
let button;
let liquidVolume;
let canvas;

// Populate the page with the tank information
populateTankInfo();

// Create input and button elements for user interaction
populateInputAndButton();

// Create a field to display the liquid volume
drawLiquidVolumenField();

// Create a canvas to visually represent the tank and liquid level
createCanvas();

button.addEventListener("click", onClick);

function onClick() {
    const level = parseFloat(input.value);
    if (isNaN(level)) {
        liquidVolume.textContent = "Por favor, ingresa un número válido para el nivel del líquido.";
        putQuestionMarkOnCanvas()
        return;
    }
    if (level < 0) {
        liquidVolume.textContent = "El nivel del líquido no puede ser negativo.";
        putQuestionMarkOnCanvas()
        return;
    }
    if (level > 154) {
        liquidVolume.textContent = "El nivel del líquido no puede ser mayor a 154 cm.";
        putQuestionMarkOnCanvas()
        return;
    }
    const liquidHeight = (level) / 100; // Convert cm to meters
    const coveredAreaByLiquid =
        Math.pow(effectiveRadius, 2) *
        Math.acos((effectiveRadius - liquidHeight) / effectiveRadius) -
        (effectiveRadius - liquidHeight) *
        Math.sqrt(
            2 * effectiveRadius * liquidHeight - Math.pow(liquidHeight, 2),
        );
    const liquidVolumeInLiters = Math.round(level > 153 ? volumeInLiters :
        coveredAreaByLiquid * effectiveLength * 1000,
    ); // Convert cubic meters to liters
    liquidVolume.textContent = `Quedan ${liquidVolumeInLiters} litros`;

    const percentage = Math.round((level / 154) * 100);

    // add descriptive text based on the input and level of the tank
    if (percentage === 0) {
        liquidVolume.textContent += " - El tanque está vacío.";
    }
    else if (percentage > 0 && percentage < 25) {
        liquidVolume.textContent += " - El tanque está casi vacío.";
    }
    else if (percentage >= 25 && percentage < 50) {
        liquidVolume.textContent += " - El tanque está parcialmente lleno.";
    }
    else if (percentage === 50) {
        liquidVolume.textContent += " - El tanque está a la mitad.";
    }
    else if (percentage >= 50 && percentage < 75) {
        liquidVolume.textContent += " - El tanque está más de la mitad lleno.";
    }
    else if (percentage >= 75 && percentage < 100) {
        liquidVolume.textContent += " - El tanque está casi lleno.";
    } else {
        liquidVolume.textContent += " - El tanque está lleno.";
    }

    // draw the tank with the liquid level on the canvas
    drawTank(level, liquidHeight);
}

function populateTankInfo() {
    tankInfo = document.createElement("div");
    tankInfo.innerHTML = `
        <h1>Información del Tanque</h1>
        <p><strong>Diámetro:</strong> ${diameter} metros</p>
        <p><strong>Longitud:</strong> ${length} metros</p>
        <p><strong>Grosor de la Pared:</strong> ${wallThickness} milímetros</p>
        <p><strong>Volumen Efectivo:</strong> ${Math.round(volumeInLiters)} litros</p>
    `;
    document.body.appendChild(tankInfo);
}

function populateInputAndButton() {
    input = document.createElement("input");
    input.type = "number";
    input.placeholder = "Nivel del líquido (cm)";
    input.min = 0;
    input.max = 154;
    input.style.marginTop = "20px";
    input.style.width = "178px";
    tankInfo.appendChild(input);
    tankInfo.appendChild(document.createElement("br"));

    button = document.createElement("button");
    button.textContent = "Calcular Volumen de Líquido";
    button.style.marginTop = "10px";
    tankInfo.appendChild(button);
}

function drawLiquidVolumenField() {
    liquidVolume = document.createElement("p");
    liquidVolume.style.marginTop = "20px";
    tankInfo.appendChild(liquidVolume);
}

function createCanvas() {
    canvas = document.createElement("canvas");
    canvas.width = 200;
    canvas.height = 200;
    tankInfo.appendChild(canvas);
    drawEmptyTank();
}

// clear canvas and draw an empty tank with a question mark on it when the input is invalid
function putQuestionMarkOnCanvas() {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.arc(100, 100, 90, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.stroke();
    ctx.fillStyle = "red";
    ctx.font = "24px Arial";
    ctx.textAlign = "center";
    ctx.fillText("?", 100, 110);
}

// draw a half circle representing the tank and fill it with a color representing the liquid level
function drawTank(level, liquidHeight) {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.arc(100, 100, 90, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.stroke();
    ctx.fillStyle = "#ADD8E6"; // Light blue color for the liquid
    ctx.beginPath();
    ctx.arc(100, 100, 90, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.clip();
    ctx.fillRect(10, 190 - (liquidHeight / effectiveRadius) * 90, 190, (liquidHeight / effectiveRadius) * 90);

    // write the percentage of the tank on top of the canvas
    ctx.fillStyle = "black";
    ctx.font = "16px Arial";
    ctx.textAlign = "center";
    ctx.fillText(Math.round((level / 154) * 100) + "%", 100, 110);
}

// dram empty circle on canvas at the beginning
function drawEmptyTank() {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.arc(100, 100, 90, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.stroke();
}