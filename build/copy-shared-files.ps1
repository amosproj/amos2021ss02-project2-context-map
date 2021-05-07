# Copy shared files
New-Item -ItemType Directory -Force -Path "..\frontend\src\shared"
xcopy /S /I /Q /Y /F "..\shared\src" "..\frontend\src\shared"