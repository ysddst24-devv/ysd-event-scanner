function onScanSuccess(decodedText){

document.getElementById("result").innerHTML = decodedText;

}

const scanner = new Html5QrcodeScanner(

"reader",

{

fps:15,

qrbox:280

}

);

scanner.render(onScanSuccess);
