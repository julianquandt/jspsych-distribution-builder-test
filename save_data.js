function save_data(username, public_password, experiment, pid, data) {
    const payload = {
        username: username,
        public_password: public_password,
        experiment: experiment,
        pid: pid,
        data: data
    };

    fetch('https://server.julianquandt.com/jspsych_datasaver/save_backend.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
    })
    .then(response => response.text())
    .then(data => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

module.exports = { 
    save_data
}; 