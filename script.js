let video = document.getElementById('video');
let resultDiv = document.getElementById('result');
let startScanButton = document.getElementById('startScan');

// Variable to track if scanning is active
let isScanning = false;

// Initialize the camera for scanning QR codes
async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment" }
        });
        video.srcObject = stream;
        video.setAttribute("playsinline", true);
        await video.play(); // Ensure the video starts playing
    } catch (err) {
        console.error("Error accessing the camera:", err);
        resultDiv.innerHTML = `
            <h2>Error</h2>
            <p>Could not access the camera. Please check permissions.</p>
        `;
    }
}

// Capture and process the video stream
function scanQRCode() {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    // Ensure the video frame is captured
    if (video.readyState === video.HAVE_ENOUGH_DATA && isScanning) {
        canvas.height = video.videoHeight;
        canvas.width = video.videoWidth;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Decode QR code
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, canvas.width, canvas.height);

        if (code) {
            // Stop scanning
            isScanning = false;

            // Display success message
            resultDiv.innerHTML = `
                <h2>Success!</h2>
                <p>QR Code Scanned: ${code.data}</p>
            `;

            // Save the scanned data
            saveAttendance(code.data);

            // Optionally, stop the video stream
            const stream = video.srcObject;
            const tracks = stream.getTracks();
            tracks.forEach(track => track.stop());
            video.srcObject = null;

            return; // Exit the scanning loop
        } else {
            resultDiv.innerHTML = `
                <h2>No QR Code Found</h2>
                <p>Point the camera at the QR code.</p>
            `;
        }
    }

    // Continue scanning every 500ms if still scanning
    if (isScanning) {
        setTimeout(scanQRCode, 500);
    }
}

// Save the scanned content (e.g., attendance in the backend)
function saveAttendance(data) {
    // Here, you can call an API to save the data (e.g., POST to backend)
    console.log("Saving attendance for student with QR data:", data);
    // Example: fetch('/attendance', { method: 'POST', body: JSON.stringify({ qrCode: data }) });
}

// Start scanning when the button is clicked
startScanButton.addEventListener('click', () => {
    // Reset scanning state
    isScanning = true;

    // Start the camera and begin scanning
    startCamera().then(() => {
        scanQRCode();
    });
});