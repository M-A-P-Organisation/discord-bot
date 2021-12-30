cd src
# install required packages
npm install

# compile typescript file into a javascript file
npm run compile

# move the .js file to M-A-P/src/front/
#assuming you have cloned the map repo at your src
mv src/bot.js M-A-P/src/front/

echo "bot succesfully installed!"