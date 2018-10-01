#!/bin/bash
# Linux fai project setup
ORANGE='\e[38;5;208m'
BLUE='\e[38;5;38m'
LIGHTGREY='\e[38;5;253m'
NC='\e[m'

printf  "${ORANGE} \n   
        ${ORANGE}000000000000${LIGHTGREY}________${ORANGE}0000${LIGHTGREY}________${ORANGE}000000000000${LIGHTGREY}\n
        ${ORANGE}000000000000${LIGHTGREY}______${ORANGE}00000000${LIGHTGREY}______${ORANGE}000000000000${LIGHTGREY}\n
        ${ORANGE}0000${LIGHTGREY}____________${ORANGE}0000${LIGHTGREY}____${ORANGE}0000${LIGHTGREY}________${ORANGE}0000${LIGHTGREY}____\n
        ${ORANGE}0000${LIGHTGREY}____________${ORANGE}0000${LIGHTGREY}____${ORANGE}0000${LIGHTGREY}________${ORANGE}0000${LIGHTGREY}____\n
        ${ORANGE}00000000000${LIGHTGREY}_____${ORANGE}000000000000${LIGHTGREY}________${ORANGE}0000${LIGHTGREY}____\n
        ${ORANGE}00000000000${LIGHTGREY}_____${ORANGE}000000000000${LIGHTGREY}________${ORANGE}0000${LIGHTGREY}____\n
        ${ORANGE}0000${LIGHTGREY}____________${ORANGE}0000${LIGHTGREY}____${ORANGE}0000${LIGHTGREY}________${ORANGE}0000${LIGHTGREY}____\n
        ${ORANGE}0000${LIGHTGREY}____________${ORANGE}0000${LIGHTGREY}____${ORANGE}0000${LIGHTGREY}________${ORANGE}0000${LIGHTGREY}____\n
        ${ORANGE}0000${LIGHTGREY}____________${ORANGE}0000${LIGHTGREY}____${ORANGE}0000${LIGHTGREY}____${ORANGE}000000000000${LIGHTGREY}\n
        ${ORANGE}0000${LIGHTGREY}____________${ORANGE}0000${LIGHTGREY}____${ORANGE}0000${LIGHTGREY}____${ORANGE}000000000000${NC}\n"

echo  "Install FAI app"

#file walker
path="/home/$USER"
cd $path
pwd

#remove existed folder
rm -rf ./fai_app/fai

#create project folder
mkdir fai_app
cd ./fai_app

#git clone
git clone "https://github.com/bogdan-molodets/fai.git"

echo "Fai app was installed."
cd ./fai
echo "Install dependencies..."
npm install
echo "Dependencies were installed."

cd ..
echo $(echo "y" | sudo apt-get install python3)
echo $(echo "y" | sudo apt install python3-pip)
echo $(echo "y" | sudo apt-get install git)
echo $(echo "y" | sudo apt-get install python3-dev)
echo $(echo "y" | sudo apt-get install build-essential python3-dev libffi-dev libssl-dev)
echo $(echo "y" | sudo apt-get update && apt-get install -y gcc)
echo $(echo "y" | sudo apt-get -f install)

echo $(pip3 install --user cython)
echo $(pip3 install --user re)
echo $(pip3 install --user sys)
echo $(pip3 install --user subprocess)
echo $(pip3 install --user argparse)
echo $(pip3 install --user requests)
echo $(pip3 install --user json)
echo $(pip3 install --user flask)
echo $(pip3 install --user connexion)
echo $(pip3 install --user socket)
echo $(pip3 install --user flask_cors)

echo $(git clone https://github.com/jswhit/pyproj.git)
echo $(pip3 install --user -r pyproj/requirements-dev.txt)
cd pyproj/
echo $(python3 setup.py build)
echo $(python3 setup.py install)
cd ..
rm -rf pyproj/
rm -rf src/
echo $(git clone https://Alexandr123@bitbucket.org/nesrobotech/fai_server.git)


