document.getElementById('upload-button').addEventListener('click', function() {
    const fileInput = document.getElementById('file-input');
    const uploadedImage = document.getElementById('uploaded-image');
    const predictionResult = document.getElementById('prediction-result');

    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const reader = new FileReader();

        reader.onload = function(event) {
            uploadedImage.src = event.target.result;
            predictionResult.textContent = "Analyzing...";
            
            // Prepare the form data
            const formData = new FormData();
            formData.append('file', file);

            // Make the API call
            fetch('https://huggingface.co/spaces/benamedd/potato_disease/api/predict/', {  // Replace with your actual API endpoint
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json',
                },
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('API response:', data); // Log the full API response for debugging
                if (data && data.prediction) {
                    predictionResult.textContent = `Prediction result: ${data.prediction}`;
                } else {
                    predictionResult.textContent = "Unable to retrieve prediction.";
                }
            })
            .catch(error => {
                console.error('Error:', error);
                predictionResult.textContent = "An error occurred while analyzing the image.";
            });
        };

        reader.readAsDataURL(file);
    } else {
        predictionResult.textContent = "Please upload an image.";
    }
});
