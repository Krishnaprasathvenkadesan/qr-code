let video = document.getElementById('video');
let resultDiv = document.getElementById('result');
let startScanButton = document.getElementById('startScan');

// Initialize the camera for scanning QR codes
async function startCamera() {
    const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
    });
    video.srcObject = stream;
    video.setAttribute("playsinline", true);
    video.play();
}

// Capture and process the video stream
function scanQRCode() {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    // Ensure the video frame is captured
    canvas.height = video.videoHeight;
    canvas.width = video.videoWidth;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Decode QR code
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, canvas.width, canvas.height);

    if (code) {
        resultDiv.innerHTML = `
            <h2>QR Code Scanned!</h2>
            <p>Attendance registered: ${code.data}</p>
        `;
        saveAttendance(code.data);
    } else {
        resultDiv.innerHTML = `
            <h2>No QR Code Found</h2>
            <p>Point the camera at the QR code.</p>
        `;
    }

    // Continue scanning every 500ms
    setTimeout(scanQRCode, 500);
}

// Save the scanned content (e.g., attendance in the backend)
function saveAttendance(data) {
    // Here, you can call an API to save the data (e.g., POST to backend)
    console.log("Saving attendance for student with QR data:", data);
    // Example: fetch('/attendance', { method: 'POST', body: { qrCode: data } });
}

// Start scanning when the button is clicked
startScanButton.addEventListener('click', () => {
    startCamera();
    scanQRCode();
});
