const argv = require('argv');
const fs = require('fs');

const args = argv.run();
const appName = args.targets[0];
const sources = [
    {
        input: './bootstrapping/templates/app.js',
        output: './src/js/app.js'
    },
    {
        input: './bootstrapping/templates/index.html',
        output: './src/index.html'
    }
];

function authorApplication(appName = 'defaultApp', input, output) {
    const fileWrite = fs.createWriteStream(output);
    const fileRead = fs.createReadStream(input, { encoding: 'utf8' });

    fileRead.on('data', (data) => {
        data = data.replace(/{{appName}}/g, appName);
        fileWrite.write(data);
    });
}

sources.forEach(({input, output}) => {
    authorApplication(appName, input, output);
});
