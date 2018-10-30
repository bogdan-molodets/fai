#!/bin/bash
echo 'run FAI app'
path="/home/$USER/RTLS_server/fai"
cd $path
if command --version node &> /dev/null; then
	echo "Install Node at first."
else
	echo "Node has been installed."
fi
npm run start

path="../server/api"
cd $path

echo $(python3 server.py)
