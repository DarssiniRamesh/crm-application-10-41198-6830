#!/bin/bash
cd /home/kavia/workspace/code-generation/crm-application-10-41198-6830/FrontendWebApplication
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

