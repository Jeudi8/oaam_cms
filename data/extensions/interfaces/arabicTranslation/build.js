const { exec } = require('child_process');

exec('parcel build input.vue -d ./ --no-source-maps --global __DirectusExtension__');
exec('parcel build display.vue -d ./ --no-source-maps --global __DirectusExtension__');
