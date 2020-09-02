# Introduction

This project Connected is main to accelerate the personal daily productivity.
It included personal workspace management and tab management etc.

Git repository: https://github.com/shangerxin/connected
Author home page: http://www.shangerxin.com/

# Support browsers

-   Chrome
    https://chrome.google.com/webstore/detail/connected/bcdjfmdcglkoffcckhlpghiloocpehnc

# Features

1. Close selected tabs
2. Close window
3. Double click tab icon to focus the tab
4. Export a session as a JSON file
5. Import a session file
6. Open selected tabs in new window
7. Move selected tabs in new window
8. Reopen closed tabs, currently limited to the tabs closed by the extension
9. Refresh the tabs of a window
10. Refresh all/selected tabs
11. Restore the session from the session list view
12. Save a window as a session
13. Search tab with title and url
14. Search session with session name
15. Toggle mute all tabs
16. Toggle pinned tabs

# Setup

-   requirements
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
-   Save temp working sessions
-   Add session to support multiple windows
-   Handle Firefox compatibility issue
-   []fix filter is not take effect when switch between session view and tabs list
-   []Status after restore from a crash session such as computer power down and
    the browser process is terminated

# Naming convention

-   source
    sourceName.browser.[ts|js]
-   test
    sourceName.browser.spec.[ts|js]
-   css
    cssName.browser.css
-   html
    htmlName.browser.html
-   resource
    resource-name.browser.ext
-   all the file without browser is the base file
