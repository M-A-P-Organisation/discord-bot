cd src

# let you choose you token for the discord app you created then put it in token.env
echo "enter your discord bot token:"
read -r token
touch .env
echo "TOKEN = $token" > .env

# install required packages
npm install

# compile typescript file into a javascript file
npm run compile

# move the .js file to M-A-P/src/front/
#assuming you have cloned the map repo at your home directory
cd
mv discord-bot/src/bot.js M-A-P/src/front/
mv discord-bot/src/.env M-A-P/src/front/ 

echo "bot succesfully installed!"