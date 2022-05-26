/*
 *
 *  Multi-language Lexicon Analyzer
 *  Analisador Léxico Multi-linguagem
 *  
 *  Author: Anderson Daniel Lima do Nascimento
 * 
 */


import leAnalysis from "./lexicalAnalyzer.js";
import languages from "./languages.js";
import fs from 'fs';
import xlsx from 'xlsx';

let table = {
    fileName: "Resultado",
    headers: ["Classe", "Token", "Linha", "Quantidade"],
    values: []
}



let language = languages.pascal;
let filePath = "code.txt";
let cColor = '\x1b[33m%s\x1b[0m';

console.log(cColor, '\nLendo o arquivo "pascalCode.txt"...');

let code = fs.readFileSync(filePath, 'utf8');
let codeLines = code.split(/\r?\n/);

console.log(cColor, '\nIniciando processo de Análise Léxica');

let result = leAnalysis(codeLines, language);



console.log('\x1b[32m', '\nAnálise concluída!\n');
console.log(result[0], "\n");
console.log(result[1], "\n");
let typeCount = {
    'Palavra reservada': 0,
    'Pontuação': 0,
    'Operador': 0,
    'Real': 0,
    'Inteiro': 0,
    'Variável': 0
}
let typeIterator = type => {
    switch (type) {
        case 'Palavra reservada':
            typeCount['Palavra reservada']++;
            break;
        case 'Pontuação':
            typeCount['Pontuação']++;
            break;
        case 'Operador':
            typeCount['Operador']++;
            break;
        case 'Real':
            typeCount['Real']++;
            break;
        case 'Inteiro':
            typeCount['Inteiro']++;
            break;
        case 'Variável':
            typeCount['Variável']++;
            break;

    }
}
console.log(cColor, '\nTratando o resultado...');
result[1].forEach((obj, index) => {
    typeIterator(obj.type);
    table.values.push({ 'Resultado': " " + obj.type + " ", "Token": " " + obj.token + " ", "Linha": " " + obj.line + " ", "Quantidade": (typeCount[obj.type] + 1) + "/" + (index + 1) });
});

console.log(cColor, '\nSalvando...');

let tableFilePath = `Resultado${Math.floor(Math.random() * 100)}.xlsx`;
fs.writeFileSync(tableFilePath, "", "utf-8");

let resultFile = xlsx.utils.book_new();
let tableParser = xlsx.utils.json_to_sheet(table.values);
xlsx.utils.book_append_sheet(resultFile, tableParser, "Análise Léxica", true);
xlsx.writeFile(resultFile, tableFilePath);

console.log('\x1b[32m', "\n\n Feito! Confira o arquivo " + tableFilePath + "\n\n");