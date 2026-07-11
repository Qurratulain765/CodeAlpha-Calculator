let expShow = document.getElementById('expression');
let resultShow = document.getElementById('result');


let currentInput = '';     
let currentOutput = '0';    
let equalPressed = false;   


function updateScreen() {
   
    expShow.textContent = currentInput || '\u200B';
    resultShow.textContent = currentOutput;
   
    resultShow.classList.remove('error');
}

function doMath(expr) {
    try {

        let cleanExpr = expr
            .replace(/×/g, '*')
            .replace(/÷/g, '/')
            .replace(/−/g, '-');

     
        let answer = new Function(`return (${cleanExpr})`)();

        if (typeof answer !== 'number' || !isFinite(answer)) {
            return { error: true, value: 'Error' };
        }

       
        let finalAnswer = Math.round(answer * 10000000000) / 10000000000;
        return { error: false, value: String(finalAnswer) };
    } catch (e) {
      
        return { error: true, value: 'Error' };
    }
}


function buttonPress(value) {


    if (value === 'C') {
        currentInput = '';
        currentOutput = '0';
        equalPressed = false;
        updateScreen();
        return;
    }

    if (value === '⌫') {
      
        if (equalPressed) {
            currentInput = '';
            currentOutput = '0';
            equalPressed = false;
            updateScreen();
            return;
        }

        currentInput = currentInput.slice(0, -1);
        

        if (currentInput === '') {
            currentOutput = '0';
        } else {
         
            let result = doMath(currentInput);
            if (!result.error) {
                currentOutput = result.value;
            } else {
                currentOutput = 'Error';
                resultShow.classList.add('error');
            }
        }
        updateScreen();
        return;
    }

    if (value === '=') {
       
        if (currentInput === '') {
            currentOutput = '0';
            updateScreen();
            return;
        }
       
        let result = doMath(currentInput);
        if (!result.error) {
            currentOutput = result.value;
           
            resultShow.classList.remove('pop');
          
            void resultShow.offsetWidth;
            resultShow.classList.add('pop');
        } else {
            currentOutput = 'Error';
            resultShow.classList.add('error');
        }
        equalPressed = true;
        updateScreen();
        return;
    }
    
   
    if (equalPressed && /[0-9.]/.test(value)) {
        currentInput = '';
        currentOutput = '0';
        equalPressed = false;
    }

  
    let operators = ['+', '−', '×', '÷'];
    let lastChar = currentInput.slice(-1);
    if (operators.includes(value) && operators.includes(lastChar)) {
       
        currentInput = currentInput.slice(0, -1) + value;
    } else {
     
        currentInput += value;
    }

 
    let result = doMath(currentInput);
    if (!result.error) {
        currentOutput = result.value;
    }
   

    equalPressed = false;
    updateScreen();
}

let allButtons = document.querySelectorAll('.btn');
allButtons.forEach(function(btn) {
    btn.addEventListener('click', function() {
        let val = this.getAttribute('data-val');
        if (val) {
            buttonPress(val);
        }
    });
});

document.addEventListener('keydown', function(e) {
    let key = e.key;

    let keyMap = {
        '0': '0', '1': '1', '2': '2', '3': '3', '4': '4',
        '5': '5', '6': '6', '7': '7', '8': '8', '9': '9',
        '.': '.',
        '+': '+', '-': '−', '*': '×', '/': '÷',
        'Enter': '=',
        'Backspace': '⌫',
        'Delete': 'C',
        'c': 'C', 'C': 'C'
    };

    
    if (key in keyMap) {
        e.preventDefault(); 
        let val = keyMap[key];
        let btn = document.querySelector(`.btn[data-val="${val}"]`);
        if (btn) {
            btn.click();
        }
    }
});


updateScreen();
console.log('✅ Calculator chal raha hai!');