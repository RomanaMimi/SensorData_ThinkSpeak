var mraa = require('mraa');
const request = require('request');
console.log('MRAA Version:'+mraa.getVersion());

var analogPin0 = new mraa.Aio(0); //setup access analog input Analog pin #0 (A0)
var soundSensor = new mraa.Aio(1);
var lightSensor = new mraa.Aio(2);
var B = 3975; // B value of termistor 

// Create a writable stream
// var write = fs.createWriteStream('sensor_database.json');
// var pre_data = fs.readFileSync('sensor_database.json');

var analogValue = 0.0;
var analogValueS= 0.0;
var analogValueL= 0.0;
//var roundfixed = celsius_temperature.toFixed(2);
function readSensor(){
    
    analogValue = analogPin0.read(); //read the value of the analog pin 
    var resistance = (1023 - analogValue) * 10000 / analogValue; //get the resistance of the sensor;
    var celsius_temperature = 1 / (Math.log(resistance / 10000) / B + 1 / 298.15) - 273.15; //convert to temperature via datasheet ;

    console.log('Temp: ' + celsius_temperature + " C");

    analogValueS = soundSensor.read(); 
    console.log('sound: ' + analogValueS );

    analogValueL = lightSensor.read(); 
    console.log('light: ' + analogValueL);

    
const url =" https://api.thingspeak.com/update?api_key=VSJL44RKBR7O189N&field1="+celsius_temperature+"&field2="+analogValueL+"&field3="+analogValueS;
request.get(url, (error, response, body) => {
  console.log("Data Uploaded");
});

}
setInterval(readSensor,5000);
