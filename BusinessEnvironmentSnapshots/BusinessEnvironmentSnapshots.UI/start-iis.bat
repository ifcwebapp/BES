@echo off
if "%1"=="" goto nositeid
"C:\Program Files (x86)\IIS Express\iisexpress.exe" /siteid:%1 /trace:w
goto end
:nositeid
echo  
echo A site ID is require.
echo Please find out the ID you need in the applicationhost.config file
echo at %USERPROFILE%\Documents\IISExpress\config\
:end