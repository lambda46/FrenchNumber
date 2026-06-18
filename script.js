let currentNumber = 0;
let correctCount = 0;
let totalCount = 0;

const minDigitSlider = document.getElementById('minDigitSlider');
const maxDigitSlider = document.getElementById('maxDigitSlider');
const minDigitLabel = document.getElementById('minDigitLabel');
const maxDigitLabel = document.getElementById('maxDigitLabel');
const rangeDisplay = document.getElementById('rangeDisplay');

const numberDisplay = document.getElementById('numberDisplay');
const userInput = document.getElementById('userInput');
const checkBtn = document.getElementById('checkBtn');
const nextBtn = document.getElementById('nextBtn');
const feedback = document.getElementById('feedback');
const scoreDisplay = document.getElementById('scoreDisplay');

// 1〜99
function getBelow100(n) {
    if (n === 0) return "";
    const ones = ["", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf", "dix", "onze", "douze", "treize", "quatorze", "quinze", "seize", "dix-sept", "dix-huit", "dix-neuf"];
    const tens = ["", "", "vingt", "trente", "quarante", "cinquante", "soixante", "soixante", "quatre-vingt", "quatre-vingt"];
    if (n < 20) return ones[n];
    let ten = Math.floor(n / 10);
    let one = n % 10;
    if (ten === 7 || ten === 9) one += 10;
    let result = tens[ten];
    if (n === 80) return "quatre-vingts";
    if (one === 1 || one === 11) {
        if (ten >= 2 && ten <= 7) return result + " et " + ones[one];
    }
    if (one > 0) return result + "-" + ones[one];
    return result;
}

// 100〜999
function getBelow1000(n) {
    if (n === 0) return "";
    if (n < 100) return getBelow100(n);
    let hundreds = Math.floor(n / 100);
    let remainder = n % 100;
    let result = "";
    if (hundreds === 1) result = "cent";
    else {
        result = getBelow100(hundreds) + " cent";
        if (remainder === 0) result += "s";
    }
    if (remainder > 0) result += " " + getBelow100(remainder);
    return result;
}

// 1,000〜999,999 (千の位)
function getBelow1Million(n) {
    if (n === 0) return "";
    if (n < 1000) return getBelow1000(n);
    let thousands = Math.floor(n / 1000);
    let remainder = n % 1000;
    let result = "";
    if (thousands === 1) {
        result = "mille";
    } else {
        result = getBelow1000(thousands) + " mille";
    }
    if (remainder > 0) result += " " + getBelow1000(remainder);
    return result;
}

// 1,000,000〜999,999,999 (百万の位までの総合処理)
function getFrenchSpelling(n) {
    if (n === 0) return "zéro";
    if (n < 1000000) return getBelow1Million(n);

    let millions = Math.floor(n / 1000000);
    let remainder = n % 1000000;
    let result = "";

    if (millions === 1) {
        result = "un million";
    } else {
        result = getBelow1000(millions) + " millions";
    }

    if (remainder > 0) result += " " + getBelow1Million(remainder);
    return result;
}

function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function updateSliders(triggeredBy) {
    let minVal = parseInt(minDigitSlider.value, 10);
    let maxVal = parseInt(maxDigitSlider.value, 10);

    if (minVal > maxVal) {
        if (triggeredBy === 'min') {
            maxDigitSlider.value = minVal;
            maxVal = minVal;
        } else if (triggeredBy === 'max') {
            minDigitSlider.value = maxVal;
            minVal = maxVal;
        }
    }

    minDigitLabel.textContent = `${minVal}桁`;
    maxDigitLabel.textContent = `${maxVal}桁`;

    const minBound = Math.pow(10, minVal - 1);
    const maxBound = Math.pow(10, maxVal) - 1;
    
    rangeDisplay.textContent = `出題範囲: ${formatNumber(minBound)} - ${formatNumber(maxBound)}`;
}

function generateNumber() {
    const minVal = parseInt(minDigitSlider.value, 10);
    const maxVal = parseInt(maxDigitSlider.value, 10);
    
    const minBound = Math.pow(10, minVal - 1);
    const maxBound = Math.pow(10, maxVal) - 1;
    
    // 桁数に応じた範囲で乱数を生成
    currentNumber = Math.floor(Math.random() * (maxBound - minBound + 1)) + minBound;
    numberDisplay.textContent = formatNumber(currentNumber);
    
    userInput.value = '';
    userInput.disabled = false;
    userInput.focus();
    feedback.innerHTML = '';
    checkBtn.disabled = false;
    nextBtn.disabled = true;
}

function checkAnswer() {
    const answer = userInput.value.trim().toLowerCase().replace(/\s+/g, ' ');
    if (answer === '') return;

    const correctAnswer = getFrenchSpelling(currentNumber);
    
    userInput.disabled = true;
    checkBtn.disabled = true;
    nextBtn.disabled = false;
    totalCount++;

    if (answer === correctAnswer) {
        correctCount++;
        feedback.innerHTML = `<span class="correct">正解！</span>`;
    } else {
        feedback.innerHTML = `
            <span class="incorrect">不正解...</span>
            <div class="correct-answer">正解: <strong>${correctAnswer}</strong></div>
        `;
    }
    
    updateScore();
    nextBtn.focus();
}

function updateScore() {
    scoreDisplay.textContent = `正解数: ${correctCount} / 出題数: ${totalCount}`;
}

checkBtn.addEventListener('click', checkAnswer);
nextBtn.addEventListener('click', generateNumber);

minDigitSlider.addEventListener('input', () => {
    updateSliders('min');
    generateNumber();
});
maxDigitSlider.addEventListener('input', () => {
    updateSliders('max');
    generateNumber();
});

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') checkAnswer();
});

updateSliders('init');
generateNumber();