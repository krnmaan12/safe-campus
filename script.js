import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, addDoc, collection } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Firebase config (jo tusi copy kita si)
const firebaseConfig = {
  apiKey: "AIzaSyCfCs679Y-aSbM7txp6Hm50aK1fRqe3dww",
  authDomain: "safecampus-e2281.firebaseapp.com",
  projectId: "safecampus-e2281",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let selectedLat = null;
let selectedLng = null;
let manualMode = false;


window.enableManual = function () {
  
  manualMode = true;

  const mapDiv = document.getElementById("pickMap");
  mapDiv.style.display = "block";
  // prevent multiple maps
  if (mapDiv.dataset.loaded) return;
  mapDiv.dataset.loaded = "true";

  const pickMap = L.map('pickMap').setView([30.2510, 74.8405], 17);

  L.tileLayer('https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
  }).addTo(pickMap);



  pickMap.on('click', function (e) {
    selectedLat = e.latlng.lat;
    selectedLng = e.latlng.lng;


    L.marker([selectedLat, selectedLng]).addTo(pickMap);

    alert("Location selected 📍");


  });
};


// Form submit logic
document.querySelector("form").addEventListener("submit", async (e) => {
e.preventDefault();

const description = document.getElementById("description").value;

if (!description) {
  alert("Please enter description ❗");
  return;
}

try {

// ✅ Manual location
if (manualMode && selectedLat && selectedLng) {

  await addDoc(collection(db, "reports"), {
    description: description,
    latitude: selectedLat,
    longitude: selectedLng,
    time: new Date()
  });

  alert("Report submitted successfully ✅");

} else {

  // ✅ GPS location
  navigator.geolocation.getCurrentPosition(async (position) => {

    const lat = position.coords.latitude;
    const lng = position.coords.longitude;

    await addDoc(collection(db, "reports"), {
      description: description,
      latitude: lat,
      longitude: lng,
      time: new Date()
    });

    alert("Report submitted successfully ✅");

  }, (error) => {
    console.log("Location error:", error);
  });

}

} catch (err) {
console.log("Error saving report:", err);
}
});