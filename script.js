const synth = window.speechSynthesis;

// DOM Elements
const textForm = document.querySelector("form");
const textInput = document.querySelector("#text-input");
const voiceSelect = document.querySelector("#voice-select");
const rate = document.querySelector("#rate");
const rateValue = document.querySelector("#rate-value");
const pitch = document.querySelector("#pitch");
const pitchValue = document.querySelector("#pitch-value");
const body = document.querySelector("body");
const errorNotifEl = document.querySelector("#errorNotif");

//Browser identifier
// Firefox 1.0+
var isFirefox = typeof InstallTrigger !== "undefined";

let voices = [];

//Getting all the voices available to fill the select voices section

const getVoices = () => {
  voices = synth.getVoices();

  //looping through the voices array to fill the select voices section
  voices.map((voice) => {
    const option = document.createElement("option");
    option.textContent = voice.name + `(` + voice.lang + `)`;

    option.setAttribute("data-lang", voice.lang);
    option.setAttribute("data-name", voice.name);
    voiceSelect.appendChild(option);
  });
};

getVoices();

//Fix for duplication, run code depending on the browser
if (isFirefox) {
  getVoices();
} else {
  if (synth.onvoiceschanged !== undefined) {
    synth.onvoiceschanged = getVoices;
  }
}

// Speak
const speak = () => {
  //condition to only run the voice if there is something written in the text-field
  if (textInput.value !== "") {
    const speakText = new SpeechSynthesisUtterance(textInput.value);

    speakText.onerror = (e) => {
      console.error("something is wrong");
    };

    const selectedVoice =
      voiceSelect.selectedOptions[0].getAttribute("data-name");

    //setting selected voice as speaking voice
    voices.map((voice) => {
      if (voice.name === selectedVoice) {
        speakText.voice = voice;
      }
    });

    //setting up rate and pitch of the text
    speakText.rate = rate.value;
    speakText.pitch = pitch.value;

    //finally setting the written text to spoken text
    synth.speak(speakText);
  } 
  
  //if there is nothing written show an message 
  else if (textInput.value === "") {
    modal.style.display = "block";
    modal.textContent = "How tf do you speak nothing?";
    setTimeout(() => {
      modal.style.display = "none";
    }, 2000);
  }
};

//adding all the event listeners
textForm.addEventListener("submit", (e) => {
  e.preventDefault();
  speak();
  textInput.blur();
});

rate.addEventListener("change", (e) => {
  rateValue.textContent = rate.value;
});

pitch.addEventListener("change", (e) => {
  pitchValue.textContent = pitch.value;
});

voiceSelect.addEventListener("change", (e) => {
  speak();
});
