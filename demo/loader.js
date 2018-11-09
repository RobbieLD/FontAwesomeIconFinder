var loader = (function() {
    'use strict';
    
    // Public methods
    function Load() {

        return new Promise((resolve, reject) => {

            const endpoint = 'https://raw.githubusercontent.com/RobbieLD/FontAwesomeIconFinder/master/src/icons.json';
            var file = document.getElementById('fileInput').files[0];

            // if a file is selected use it otherwise grab the github one
            if (file) {
                var fr = new FileReader();
                fr.onload = (e) => {
                    let lines = e.target.result;
                    resolve(JSON.parse(lines)); 
                };

                fr.readAsText(file);
            }
            else {
                fetch(endpoint)
                .then((response) => {
                    if (response.status.toString() !== "200") {
                        console.error("Fetch to " + endpoint + " return a status code of " + response.status);
                    }

                    return response.json();
                })
                .then((data) => {
                    resolve(data);
                })
                .catch((error) => {
                    console.error(error);
                    reject(error);
                });
            }


        });
    }

    return {
        load: Load
    };
}());