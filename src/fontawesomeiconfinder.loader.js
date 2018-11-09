var loader = (function() {
    'use strict';
    
    // Public methods
    function Load(endpoint) {
        return new Promise((resolve, reject) => {
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
        });
    }

    return {
        load: Load
    };
}());