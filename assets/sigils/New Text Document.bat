@echo off
setlocal enabledelayedexpansion

rem Set the directory path and the prefix to be removed
set "directoryPath=C:\Users\bruno\OneDrive\Desktop\test\inscryption\assets\portraits"
set "prefixToRemove=pixelportrait_"

rem Change to the target directory
cd C:\Users\bruno\OneDrive\Desktop\test\inscryption\assets\portraits

rem Process each file in the directory
for %%F in (*%prefixToRemove%*) do (
    rem Get the current file name
    set "currentFileName=%%~nF"

    rem Remove the prefix from the current file name
    set "newFileName=!currentFileName:%prefixToRemove%=!"

    rem Rename the file
    ren "%%F" "!newFileName!%%~xF"
)

echo Batch script executed successfully.
pause
