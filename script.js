(function() { 
    let screen = document.querySelector('.screen'); 
    let buttons = document.querySelectorAll('.btn'); 
    let clear = document.querySelector('.btn-clear'); 
    let equal = document.querySelector('.btn-equal'); 
    
    // Store calculation history
    let calculationHistory = [];
    
    // Function to update screen
    function updateScreen(value) {
        screen.value = value;
    }
    
    // Function to add to calculation history
    function addToHistory(expression, result) {
        calculationHistory.push({
            expression: expression,
            result: result,
            timestamp: new Date().toLocaleString()
        });
        
        // Keep only last 10 calculations
        if (calculationHistory.length > 10) {
            calculationHistory.shift();
        }
    }
    
    // Function to handle button clicks
    buttons.forEach(function(button) { 
        button.addEventListener('click', function(e) { 
            let value = e.target.dataset.num; 
            if (value !== undefined) { 
                // Prevent multiple operators in a row
                const lastChar = screen.value.slice(-1);
                const operators = ['+', '-', '*', '/', '.'];
                
                if (operators.includes(lastChar) && operators.includes(value)) {
                    // Replace the last operator with new one
                    screen.value = screen.value.slice(0, -1) + value;
                } else {
                    screen.value += value;
                }
            } 
        }); 
    }); 
    
    // Function to handle equal button
    equal.addEventListener('click', function() { 
        if (screen.value === '') { 
            updateScreen("Please enter a value"); 
            setTimeout(() => updateScreen(''), 1500);
        } else { 
            try { 
                // Replace × with * for evaluation
                let expression = screen.value.replace(/×/g, '*');
                
                // Validate expression
                if (!isValidExpression(expression)) {
                    updateScreen("Invalid Expression");
                    setTimeout(() => updateScreen(''), 1500);
                    return;
                }
                
                let answer = eval(expression);
                
                // Handle division by zero
                if (!isFinite(answer)) {
                    updateScreen("Cannot divide by zero");
                    setTimeout(() => updateScreen(''), 1500);
                    return;
                }
                
                // Add to history
                addToHistory(screen.value, answer);
                
                // Display result
                updateScreen(answer);
            } catch (error) { 
                updateScreen("Error"); 
                setTimeout(() => updateScreen(''), 1500);
            } 
        } 
    }); 
    
    // Function to handle clear button
    clear.addEventListener('click', function() { 
        updateScreen(''); 
    }); 
    
    // Function to validate mathematical expression
    function isValidExpression(expr) {
        // Basic validation - you can enhance this
        try {
            // Check for invalid characters
            const validChars = /^[0-9+\-*/.()\s]+$/;
            if (!validChars.test(expr)) {
                return false;
            }
            
            // Check for balanced parentheses
            let stack = [];
            for (let char of expr) {
                if (char === '(') stack.push(char);
                if (char === ')') {
                    if (stack.length === 0) return false;
                    stack.pop();
                }
            }
            return stack.length === 0;
        } catch {
            return false;
        }
    }
    
    // Keyboard support
    document.addEventListener('keydown', function(e) {
        const key = e.key;
        
        // Numbers and operators
        if ('0123456789+-*/.'.includes(key)) {
            screen.value += key;
        }
        
        // Enter key for equals
        if (key === 'Enter') {
            equal.click();
        }
        
        // Escape key for clear
        if (key === 'Escape') {
            clear.click();
        }
        
        // Backspace key
        if (key === 'Backspace') {
            screen.value = screen.value.slice(0, -1);
        }
    });
    
    // Initialize calculator
    console.log('Calculator initialized successfully!');
})(); 