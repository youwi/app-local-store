var fsevents = require('fsevents');
var watcher = fsevents(__dirname);
watcher.on('fsevent', function(path, flags, id) { }); // RAW Event as emitted by OS-X
watcher.on('change', function(path, info) { }); // Common Event for all changes
watcher.start() // To start observation



