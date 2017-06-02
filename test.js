const fs = require('fs');
const path = require('path');

function traversingDirectory(dir) {
    if (!fs.existsSync(dir)) {
        return [];
    }
    const stat = fs.statSync(dir);
    if (stat.isFile()) {

    } else if (stat.isDirectory()) {

    } else {

    }
}
