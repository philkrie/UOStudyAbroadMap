
to bundle the js run the command:
watchify -t [ babelify --presets [ es2015 react stage-0] ] js/src/main.js -o js/dist/main.js

this should start a process that watches main.js for changes
