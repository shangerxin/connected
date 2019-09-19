# Introduction

This project Connected is main to accelerate the personal daily productivity.
It included personal workspace management and tab management etc.

# Features

# Setup

-   prequirement
    nodejs
    chrome

-   install node packages
    $ npm install -D webpack
$ npm install -D typescript ts-loader

-   install node library and typescript type information
    $ npm install --save-dev lodash
$ npm install --save-dev @types/lodash

-   build the project
    \$ npm run-script build

# TODO

-   [x]fix status sync bug
-   [x]delete session item will not resume the filted list
-   [x]refresh all tabs for current window
-   add right click + move to new window + unselect all + close
-   add session create time and last access time and modify the table sequence
-   [x]add export and import sessions
-   add help document
-   [x]filter hit enter twice to select all filtered tabs
-   add remove duplicate tabs, the trail '/' should be ignore
-   merge refresh tabs with refresh all
-   [x]add donate buttons
-   add extension description page in home page
-   write a simple article about browser extension
-   optimize and minify packaged code
-   add option page
-   []publish extension
-   [x] added statistic logic
-   add l18n support
-   add test cases
-   improve filter with h1 content
-   Remove url trail segment when compare duplicate tabs
-   Add version component and get the version number from manifest
-   fix Firefox open session will not correctly open all the tabs
-   Add logs capability for all the public functions 