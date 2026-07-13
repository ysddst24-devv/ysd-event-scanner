const API_URL = "https://ysd-event-scanner-api.ysddst24.workers.dev/scan";

function showResult(result){

    const status = document.getElementById("result");

    if(result.success){

        status.innerHTML = `
        <div style="color:#00ff66">
            <h2>✅ VERIFIED</h2>
            <h3>${result.name}</h3>
            <p>${result.category}</p>
            <p>${result.firstEntry ? "First Entry" : "Re-entry"}</p>
            <p>Scan #${result.scanCount}</p>
        </div>
        `;

        navigator.vibrate?.(200);

    }else{

        status.innerHTML = `
        <div style="color:#ff4444">
            <h2>❌ INVALID QR</h2>
            <p>${result.message}</p>
        </div>
        `;

    }

}

async function onScanSuccess(decodedText){
    console.log("RAW QR:", decodedText);

    scanner.clear();

    try{

        const match = decodedText.match(/REG=([A-Z0-9-]+)/);

const regNumber = match ? match[1] : decodedText.trim();
console.log("EXTRACTED REG:", regNumber);
        
const response = await fetch(API_URL,{
    method:"POST",
    headers:{
        "Content-Type":"application/json"
    },
    body:JSON.stringify({
        registrationNumber: regNumber,
        gate: CONFIG.GATE
    })
});

        const result = await response.json();

        showResult(result);

    }catch(err){

    console.error("FETCH ERROR:", err);

    document.getElementById("result").innerHTML =
    "<h2 style='color:red'>Connection Error</h2><p>" + err + "</p>";

}

    setTimeout(()=>{

        scanner.render(onScanSuccess);

    },3000);

}

const scanner = new Html5QrcodeScanner(
    "reader",
    {
        fps:15,
        qrbox:280
    }
);

scanner.render(onScanSuccess);
