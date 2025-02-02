document.addEventListener("DOMContentLoaded", () => {
  const scanButton = document.getElementById("scanButton");
  const scannerSection = document.getElementById("scannerSection");
  const successMessage = document.getElementById("successMessage");
  const cameraFeed = document.getElementById("cameraFeed");

  let scanner;

  scanButton.addEventListener("click", async () => {
    try {
      // Access the camera
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      cameraFeed.srcObject = stream;
      cameraFeed.classList.remove("hidden");
      scannerSection.classList.add("hidden");

      // Initialize QR Code scanning
      scanner = new QrScanner(cameraFeed, (result) => {
        // Stop the camera feed
        scanner.stop();
        cameraFeed.srcObject.getTracks().forEach(track => track.stop());
        cameraFeed.classList.add("hidden");

        // Display success message
        successMessage.classList.remove("hidden");
      });

      scanner.start();
    } catch (error) {
      alert("Unable to access the camera. Please check permissions.");
    }
  });
});