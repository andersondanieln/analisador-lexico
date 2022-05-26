/*
 *
 *  Multi-language Lexicon Analyzer
 *  Analisador Léxico Multi-linguagem
 *  
 *  Author: Anderson Daniel Lima do Nascimento
 * 
 */


const languages = {
    pascal: {
        canVarReceiveNum: true,
        tokens: {
            reservedWords: ["begin", "end", "if", "while", "for", "then", "program"],
            operators: [":=", "+", "-", "*"],
            punctuation: [";", ":"]
        }
    },
    JavaScript: {
        canVarReceiveNum: true,
        tokens: {
            reservedWords: ["var", "let", "for", "if", "while"],
            operators: ["=", "==", "-", "+", "++", "*", ";"],
            punctuation: []
        }
    }
}
export default languages;