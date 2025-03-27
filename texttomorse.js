const morse={
    'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.', 'G': '--.', 'H': '....','I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---', 'P': '.--.','Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-','Y': '-.--', 'Z': '--..', '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....','6': '-....', '7': '--...', '8': '---..', '9': '----.', '0': '-----',' ':'   '
};
function texttomorse(){
    const textInput = document.getElementById("userInput").value.toUpperCase();
    let morseOutput="";
    for(let c of textInput){
        if(morse[c]){
            morseOutput += morse[c]+" ";
        }else{
            morseOutput += " ";
        }
    }
    document.getElementById("outputtext").innerText = morseOutput.trim();
}
document.getElementById("convert").addEventListener("click",texttomorse);