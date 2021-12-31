import { Constants, Interaction, Structures, Utils } from 'detritus-client';
const { CommandClient } = require('detritus-client');
const { Embed, Markup } = Utils;
const fs = require("fs");
var Chart = require('chart.js');
require('dotenv').config()

const token = process.env.TOKEN;
const commandClient = new CommandClient(token, {
  prefix: 'map',
});

// actual things that don't need to be actualised
var date = new Date();
var month = date.getMonth() + 1; //+1 because im in france, change it depending where you are

const plant = fs.readFileSync("data/choice.txt", "utf8");
let file = fs.readFileSync("data/plant.json", "utf8");
let jsonFile = JSON.parse(file);
if (month < 4 || month > 9) { //winter
  var ultimateTemp = jsonFile[plant]["temperature"]["hiver"];
} else { //summer
  var ultimateTemp = jsonFile[plant]["temperature"]["été"];
}

commandClient.add({
  // general information about the plant
  name: 'dashboard',
  run: (context, args) => {
  	const plant = fs.readFileSync("data/choice.txt", "utf8");
  	let file = fs.readFileSync("data/plant.json", "utf8");
    let jsonFile = JSON.parse(file);

  	var date = new Date();
    var month = date.getMonth() + 1; //+1 because im in france, change it depending where you are
    if (month < 4 || month > 9) { //winter
        var ultimateTemp = jsonFile[plant]["temperature"]["hiver"];
    } else { //summer
        var ultimateTemp = jsonFile[plant]["temperature"]["été"];
    }

	const ScientifName = jsonFile[plant]["real"]
  	var temp0 = fs.readFileSync("data/temp_0.txt", "utf8");
  	var temp10 = fs.readFileSync("data/temp_10.txt", "utf8");
  	const hum = fs.readFileSync("data/hum.txt", "utf8");

  	const embed = new Embed()
  	embed.setColor(0x325C34)
  	embed.setTitle("Dashboard")
  	embed.setThumbnail("https://raw.githubusercontent.com/apoleon33/M-A-P/main/src/front/src/assets/plant.png")

  	embed.addField("plant name:",plant, false)
  	embed.addField("scientific name:", ScientifName, false)
  	embed.addField("actual temperature:",temp0 + " °C",false)
  	embed.addField("actual humidity",hum + "%",false)
  	embed.addField("optimal temperature:",ultimateTemp + " °C", false)

  	return context.editOrReply({embed, reference: false});
  },
});

commandClient.add({
  // temperature
  name: 'temperature',
  run: (context, args) => {
  	var temp0 = fs.readFileSync("data/temp_0.txt", "utf8");
  	var temp10 = fs.readFileSync("data/temp_10.txt", "utf8");

  	const embed = new Embed()
  	embed.setColor(0x850606)
  	embed.setTitle("Temperature")
  	embed.addField("actual temperature",temp0 + " °C",false)
  	embed.addField("optimal temperature",ultimateTemp + " °C", false)
  	embed.addField("temperature 10h ago",temp10 + "°C", false)

  	return context.editOrReply({embed, reference: false});
  },
});

commandClient.add({
  // humidity
  name: 'humidity',
  run: (context, args) => {
  	const hum = fs.readFileSync("data/hum.txt", "utf8");

    //actual doughnut graph
    var empty = 100 - hum;
    const chart = {
      type: 'doughnut',
      data: {
        labels: ["humidity", "o"],
        datasets: [
          {
            backgroundColor: ["#5AA65F", "transparent"],
            borderColor: 'transparent',
            data: [hum, empty],
          },
        ],
      },      
      options: {
        title: {
          display: false,
          color:'white',
        },
        rotation: 215,
      },      
      legend: {display: false,},
    }
    const encodedChart = encodeURIComponent(JSON.stringify(chart));
    const chartUrl = `https://quickchart.io/chart?c=${encodedChart}`;

  	const embed = new Embed()
  	embed.setColor(0x0000ff)
  	embed.setTitle("Humidity")
  	embed.addField("actual humidity",hum + "%",true)
    embed.setImage(chartUrl)

  	return context.editOrReply({embed, reference: false});
  },
});

commandClient.add({
  // graph of the past 30h

  name: 'graph',
  run: (context, args) => {
    var temp0 = fs.readFileSync("data/temp_0.txt", "utf8");
    var temp10 = fs.readFileSync("data/temp_10.txt", "utf8");
    var temp20 = fs.readFileSync("data/temp_20.txt", "utf8");
    var temp30 = fs.readFileSync("data/temp_30.txt", "utf8");

    const chart = {
        type: "line",
        data: {
          labels: [-30, -20, -10, 0],
          datasets: [
            {
              data: [temp30,temp20,temp10,temp0],
              borderColor: "red",
              fill: true,
            },
            {
              data: [ultimateTemp, ultimateTemp, ultimateTemp, ultimateTemp],
              borderColor: "black",
              fill: false,
            },
          ],
        },
        options: {
          legend: { display: false}
        },
      }
    const encodedChart = encodeURIComponent(JSON.stringify(chart));
    const chartUrl = `https://quickchart.io/chart?c=${encodedChart}`;

    const embed = new Embed()
    embed.setTitle('temperature evoluton in the past 30h')
    embed.setImage(chartUrl)

    return context.editOrReply({embed, reference: false});
  },
});

(async () => {
  const client = await commandClient.run();
  console.log("succesfully launched map.exe");
})();