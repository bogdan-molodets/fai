#!/bin/bash
echo 'run FAI app'
path="/home/$USER/fai_app/fai"
cd $path
if command --version node &> /dev/null; then
	echo "Install Node at first."
else
	echo "Node has been installed."
fi
npm run start

path="../fai_server/api"
cd $path

echo $(python3 server.py)
