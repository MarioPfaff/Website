@echo off
rem Starts the portfolio dev server at http://127.0.0.1:3000
cd /d "%~dp0"
if not exist node_modules (
  echo Installing packages, this only happens once...
  call npm install || goto :failed
)
call npm run format >nul
call npm test || goto :failed
echo.
echo Site starting at http://127.0.0.1:3000 - keep this window open, close it to stop.
call npm run dev
goto :eof

:failed
echo.
echo Something went wrong - see the messages above.
pause
