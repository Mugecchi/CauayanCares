@echo off
echo starting server
start cmd /k "cd backend && python app.py"

echo starting client
start cmd /k "cd frontend && npm run dev"