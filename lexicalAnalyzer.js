/*
 *
 *  Multi-language Lexicon Analyzer
 *  Analisador Léxico Multi-linguagem
 *  
 *  Author: Anderson Daniel Lima do Nascimento
 * 
 */

let currentState = 0;
let currentLineIndex = 0;
let currentCharIndex = 0;
let chars = [];
let language = [];
let currentChar = "";
let currentToken = "";

function isEOL(e) { return currentCharIndex >= chars.length - 1; }

function isNum(e) { return !isNaN(e) && !e.includes('.'); }

function isPunctuation(e) { return language.tokens.punctuation.includes(e); }

function isReservedWord(e) { return language.tokens.reservedWords.includes(e); }

function isOperator(e) { return language.tokens.operators.includes(e); }

function isSpace(e) { return e === " " || e === "\n" }

function isPoint(e) { return e === "." }

function isVoid(e) { return e === "" }

function nextChar() { return currentCharIndex + 1 <= chars.length ? chars[currentCharIndex + 1] : "" }

function prevChar() { return currentCharIndex > 0 ? chars[currentCharIndex - 1] : "" }

function clearToken() { currentToken = ""; }


function strangerToken(isVariable) {
    if (language.canVarReceiveNum && !isVariable)
        setToken("variable");
    else {
        found.others.push({ value: currentToken.trim(), line: currentLineIndex });
        currentToken = "";
        currentState = 0;
    }
}

function hasNum(e) {
    try {
        let rexp = new RegExp(/[0-9]/i);
        return e.match(rexp).length > 0
    } catch (e) { return false }
}

function isLetter(e) {
    if (isNum(e) || isVoid(e))
        return false;
    try {
        let rexp = new RegExp(/[a-z]/i);
        return e.match(rexp).length > 0;
    } catch (e) { return false; }
}

function isReal(e) {
    if (e.includes('.')) {
        let nums = e.split('.');
        if (isNum(nums[0]) && nums[1] && nums.length === 2)
            return true;
        else
            return false
    } else { return false; }
}

function checkState() {
    switch (currentState) {
        case 2:
            if ((isSpace(nextChar()) || isEOL(currentCharIndex))) {
                currentState = 3;
                checkState();
            } else {
                currentState = 0;
            }
            break;

        case 3:
            if (isNum(currentToken))
                setToken("int");
            else
                strangerToken(false);
            break;

        case 5:
            if (isReal(currentToken))
                setToken("real");
            else
                strangerToken(false);
            break;
        case 6:
            if (!hasNum(currentToken)) {
                if (!isReservedWord(currentToken))
                    setToken("variable");
                else
                    setToken("reservedWord");
            } else
                strangerToken(true);
            break;

        case 7:
            setToken("punc");
            break;
        case 8:
            setToken("operator");
            break;
    }

}

function setToken(type) {
    switch (type) {
        case "int":
            found.num_int.push({ token: currentToken.trim(), line: currentLineIndex + 1 });
            generalist.push({ type: 'Inteiro', token: currentToken.trim(), line: currentLineIndex + 1 });
            currentState = 0;
            clearToken();
            break;
        case "real":
            found.num_real.push({ token: currentToken.trim(), line: currentLineIndex + 1 });
            generalist.push({ type: 'Real', token: currentToken.trim(), line: currentLineIndex + 1 })
            currentState = 0;
            clearToken();
            break;
        case "variable":
            found.variables.push({ token: currentToken.trim(), line: currentLineIndex + 1 });
            generalist.push({ type: 'Variável', token: currentToken.trim(), line: currentLineIndex + 1 })
            currentState = 0;
            clearToken();
            break;
        case "punc":
            found.punctuations.push({ token: currentToken.trim(), line: currentLineIndex + 1 });
            generalist.push({ type: 'Pontuação', token: currentToken.trim(), line: currentLineIndex + 1 })
            currentState = 0;
            clearToken();
            break;
        case "operator":
            found.operators.push({ token: currentToken.trim(), line: currentLineIndex + 1 });
            generalist.push({ type: 'Operador', token: currentToken.trim(), line: currentLineIndex + 1 })
            currentState = 0;
            clearToken();
            break;
        case "reservedWord":
            found.reservedWords.push({ token: currentToken.trim(), line: currentLineIndex + 1 });
            generalist.push({ type: 'Palavra reservada', token: currentToken.trim(), line: currentLineIndex + 1 })
            currentState = 0;
            clearToken();
            break;
    }
}

function preProcessor(e) {
    switch (e) {
        case e.includes(';'):
            return e.replaceAll(';', ' ; ');
            break;
        default:
            return e;
            break;
    }
}

function leAnalysis(codeLines, lang) {
    language = lang;
    for (currentLineIndex = 0; currentLineIndex < codeLines.length; currentLineIndex++) {

        chars = preProcessor(codeLines[currentLineIndex].split(''));

        for (currentCharIndex = 0; currentCharIndex < chars.length; currentCharIndex++) {

            currentChar = chars[currentCharIndex];
            currentToken += currentChar;

            if (isSpace(currentChar))
                currentToken = "";

            if (isNum(currentChar)) {
                if ((isSpace(prevChar()) || isVoid(prevChar())) && (isSpace(nextChar()) || isEOL(currentCharIndex))) {
                    currentToken = currentChar;
                    currentState = 3;
                } else if ((isSpace(nextChar()) || isEOL(currentCharIndex)) && !currentToken.includes('.')) {
                    currentState = 3;
                } else if (currentState == 4 && (isSpace(nextChar()) || isEOL(currentCharIndex))) {
                    currentState = 5;
                }
            } else if (isPoint(currentChar) && isNum(prevChar()) && isNum(nextChar())) {
                currentState = 4;
            } else if (isLetter(currentChar) && !isVoid(currentChar)) {
                if ((isSpace(prevChar()) || isVoid(prevChar())) && (isSpace(nextChar()) || isEOL(currentCharIndex))) {
                    currentToken = currentChar;
                    currentState = 6;
                } else if ((isSpace(nextChar()) || isEOL(currentCharIndex)) && !isNum(prevChar())) {
                    currentState = 6;
                }
            } else if (isPunctuation(currentToken) && nextChar() != "=") {
                currentState = 7;
            } else if (isOperator(currentToken)) {
                currentState = 8;
            }
            checkState();
        }
    }
    return [found, generalist];
}
let generalist = [];
let found = {
    reservedWords: [],
    operators: [],
    punctuations: [],
    variables: [],
    num_int: [],
    num_real: [],
    others: []
};

export default leAnalysis;