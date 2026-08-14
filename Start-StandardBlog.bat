@echo off
title Standard Blog Platform
set "PATH=C:\Program Files\nodejs;%PATH%"
cd /d "%~dp0backend"

:: Start the background Node server instantly
start /B "" "C:\Program Files\nodejs\node.exe" src/server.js

:: Open website directly in Chrome / default browser
start http://localhost:5000

exit
