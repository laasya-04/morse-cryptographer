const text={
    '.-': 'A', '-...': 'B', '-.-.': 'C', '-..': 'D', '.': 'E', '..-.': 'F', '--.': 'G', '....': 'H', '..': 'I', '.---': 'J', '-.-': 'K', '.-..': 'L', '--': 'M', '-.': 'N', '---': 'O', '.--.': 'P', '--.-': 'Q', '.-.': 'R', '...': 'S', '-': 'T', '..-': 'U', '...-': 'V', '.--': 'W', '-..-': 'X', '-.--': 'Y', '--..': 'Z', '.----': '1', '..---': '2', '...--': '3', '....-': '4', '.....': '5', '-....': '6', '--...': '7', '---..': '8', '----.': '9', '-----': '0'
};
function morseToText(){
    const morseInput = document.getElementById("userInput").value.trim();
    const morse = morseInput.split(" ");
    let outputText =" ";
    for(let c of morse){
        if(text[c]){
            outputText += text[c];
        }else{
            outputText += " ";
        }
    }
    document.getElementById("outputtext").innerText = outputText;
}
document.getElementById("convert").addEventListener("click",morseToText);