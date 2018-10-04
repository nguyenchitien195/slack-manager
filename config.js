function initConfig() {
    let config = {
        client_id     : '231613720450.347038352342',
        client_secret : '0cba2bc4574755e161719c48068e6a2b',
    };
    localStorage.setItem('config', JSON.stringify(config));
}

function checkConfig() {
    let config = JSON.parse(localStorage.getItem('config'));
    if (config) {
        initConfig();
    }
}