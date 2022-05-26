# analisador-lexico
# Analisador Léxico Multi-linguagem

Este software surgiu de um trabalho da faculdade, na disciplina de Compiladores.   
Permite definir uma ou mais "linguagens" a serem analisadas (um ou mais grupos de definições).

### Estrutura de arquivos:

*   **pascalCode.txt**

       Arquivo contendo o código/texto que será analisado.

*   **languages.js**

Fica as definições da linguagem: o que é uma palavra reservada,  
      pontuação, etc. Você pode definir uma ou mais linguagens, cada uma  
      com suas próprias propriedades.

*   **lexicalAnalyzer.js**

      Aqui é onde a mágica acontece. É o Analisador Léxico.

*   **index.js**

      Onde o analisador léxico é importado e usado, é também onde  
      o arquivo XLSX (a tabela em formato para o MS Excel).

### Definindo a linguagem

No arquivo **language.js** está a definição da nossa pseudo-linguagem, é neste arquivo  
que ficará as diretrizes para que o Analisador Léxico faça o seu trabalho.

A estrutura é a seguinte:

```
const languages = {
    pascal:{
      canVarReceiveNum:true,
      tokens:{
          reservedWords:["begin", "end", "if", "while", "for", "then", "program"],
          operators:[":=", "+", "-", "*"],
          punctuation:[";", ":"]
      }
    } 
}
```

Algumas propriedades:

**canVarReceiveNum:** booleano que permite ou não que variáveis possam possuir número, por exemplo: x1,  x2, e1...

###   
Como usar:

Importe o **leAnalysis** do **exicalAnalyzer.js**. Esta função tem como parâmetros: codeLines e language,  
sendo:

1.  **codeLines :** um Array contendo cada linha do texto que será analisado
2.  **language :** qual "linguagem" será analisada. (Já vira com alguma estrutura do Pascal, então você poderá usar para testes)

O retorno desta função será um Array contendo duas saídas em JSON:

A primeira é um objeto que organiza os tokens encontrados por categoria.:

```
{
reservedWords: [
  { token: 'begin', line: 1 },
  { token: 'end', line: 1 },
  { token: 'if', line: 1 },
  { token: 'while', line: 2 },
  { token: 'for', line: 2 },
  { token: 'then', line: 2 },
  { token: 'program', line: 2 }
],
operators: [ { token: ':=', line: 1 } ],
punctuations: [ { token: ';', line: 1 }, { token: ':', line: 1 } ],
variables: [ { token: 'x1', line: 2 }, { token: 'a', line: 2 } ],  
num_int: [ { token: '20', line: 2 } ],
num_real: [ { token: '5.5', line: 2 } ],
others: []
}  
```

A segunda organiza por ordem:

```
[
{ type: 'Palavra reservada', token: 'begin', line: 1 },
{ type: 'Palavra reservada', token: 'end', line: 1 },
{ type: 'Palavra reservada', token: 'if', line: 1 },
{ type: 'Pontuação', token: ';', line: 1 },
{ type: 'Pontuação', token: ':', line: 1 },
{ type: 'Operador', token: ':=', line: 1 },
{ type: 'Palavra reservada', token: 'while', line: 2 },
{ type: 'Palavra reservada', token: 'for', line: 2 },
{ type: 'Palavra reservada', token: 'then', line: 2 },
{ type: 'Inteiro', token: '20', line: 2 },
{ type: 'Real', token: '5.5', line: 2 },
{ type: 'Variável', token: 'x1', line: 2 },
{ type: 'Variável', token: 'a', line: 2 },
{ type: 'Palavra reservada', token: 'program', line: 2 }
]
```

Para exportar esses objetos JSON em XLSX utilizei a biblioteca node-xlsx:

https://www.npmjs.com/package/node-xlsx
