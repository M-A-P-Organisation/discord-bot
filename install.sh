# install typescript
npm i typescript

# compile typescript file into a javascript file
tsc -t es5 src/bot.ts

# move the .js file to M-A-P/src/front/
#assuming you have cloned the map repo at your src
mv src/bot.js M-A-P/src/front/

echo "bot succesfully installed!"