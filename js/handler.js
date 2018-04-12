
class Slack {

    constructor(token) {
        this.token = token;
    }

    connectApi() {
        this.token 
    }

    getListFiles(callback) {
        let request = new XMLHttpRequest();
        request.open('GET', 'https://slack.com/api/files.list?token='+this.token, true);
        request.send(null);
        request.onreadystatechange = function() {
            if (request.readyState == 4 && request.status == 200) {
                return callback(request.responseText);
            }
        };
    }

    getUserInfo(callback) {

    }

    deleteFile(fileID, callback) {
        let request = new XMLHttpRequest();
        request.open('POST', 'https://slack.com/api/files.delete', true);
        request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        request.send('token='+this.token+'&file='+fileID);
        request.onreadystatechange = function() {
            if (request.readyState == 4 && request.status == 200) {
                return callback(request.responseText);
            }
        };
    }
}