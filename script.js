async function analyzeHealth() {
    const apiKey = "AIzaSyDdY79gGVGToLvo7iCHdxDnAoIHD6I0i-Q";
    let sleep = document.getElementById("sleep").value;
    let water = document.getElementById("water").value;
    let steps = document.getElementById("steps").value;
    let heart = document.getElementById("heart").value;
    let mood = document.querySelector('input[name="mood"]:checked').value;

    if(!sleep || !water || !steps || !heart) {
        alert("Please fill in all numerical fields first.");
        return;
    }

    document.getElementById("loading").style.display = "block";
    document.getElementById("evaluation-container").style.opacity = "0.5";

    const promptText = `My health data today: Sleep: ${sleep}h, Water: ${water}L, Steps: ${steps}, Heart rate: ${heart}bpm. My subjective mood is: ${mood}.
You are an expert, encouraging AI health coach. Follow these exact instructions:
1. Provide an overall health score out of 10 for today.
2. Provide a 2 sentence personalized advice based on these numbers and mood.
Format exactly like this with no other bolding or text:
SCORE: [number]/10
ADVICE: [your advice here]`;

    const requestBody = { contents: [{ parts: [{ text: promptText }] }] };

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
             const errorData = await response.json();
             console.error("API Error Response:", errorData);
             throw new Error("Cannot connect to AI. Refresh the page to clear browser cache and try again.");
        }

        const data = await response.json();
        let aiFullText = data.candidates[0].content.parts[0].text;
        
        let scoreVal = "--/10";
        let adviceVal = "Could not parse advice. Looked like: " + aiFullText;

        if(aiFullText.includes("SCORE:") && aiFullText.includes("ADVICE:")) {
            let splitText = aiFullText.split("ADVICE:");
            scoreVal = splitText[0].replace("SCORE:", "").trim();
            adviceVal = splitText[1].trim();
        }

        document.getElementById("score-display").innerText = scoreVal;
        document.getElementById("result").innerText = adviceVal;
        
        document.getElementById("loading").style.display = "none";
        document.getElementById("evaluation-container").style.opacity = "1";
        
        selfImprove(`[${scoreVal}] ` + adviceVal);

    } catch (error) {
        document.getElementById("loading").style.display = "none";
        document.getElementById("evaluation-container").style.opacity = "1";
        document.getElementById("result").innerText = error.message;
        console.error(error);
    }
}

function selfImprove(data) {
    let log = document.getElementById("log");
    let li = document.createElement("li");
    li.innerText = data;
    log.appendChild(li);
    localStorage.setItem("healthLog", log.innerHTML);
}

window.onload = function () {
    let saved = localStorage.getItem("healthLog");
    if (saved) {
        document.getElementById("log").innerHTML = saved;
    }
}