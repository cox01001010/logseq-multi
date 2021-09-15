Part of: [[Development]]

# preamble

would like to readout diodes using arduino board, something to bundle with PTCs 

looked at this before, use voltage regulator LM317 

[[https://arxiv.org/ftp/arxiv/papers/1910/1910.09111.pdf]] useful paper:

local link: [[QMCI/1910.09111.pdf]]

![[Pasted image 20210126143833.png]]

![[Pasted image 20210126144000.png]]

# [[2021-02-03]]

breadboard it up and make the following Vdiode measurements

1.25v at 300k
1.487 at 77k

which is completely wrong. should be more like 0.5V at 300K and 1.02 at 77K

# [[2021-02-04]]

error with grounding of Vdiode measurement, now get:

| Environment     | Estimated Temperature | $V_{diode}$ | Current ($\mu$A) | 
| --------------- | --------------------- | ----------- | ---------------- |
| Room            | 300K                  |             |                  |
| Liquid Nitrogen | 77K                   |             |                  |

which is much better, I can measure the current draw too, 

# [[2021-02-08]]

simple readout [[C:\Users\James Cox\QMC-Instruments\Technical\UsefulLabTools\Code\Arduino\DiodeReadout\DiodeReadout.ino|code]] for [[arduino]]

```
//Diode Readout


int Vpin1 = A1;
int ledPin = 13;      // select the pin for the LED
float Sensor1Value = 0.0;  // variable to store the value coming from the sensor
float Sensor1Voltage = 0.0;

void setup() {
  // declare the ledPin as an OUTPUT:
  pinMode(ledPin, OUTPUT);
  Serial.begin(9600);           //  setup serial
}

void loop() {
  // read the value from the sensor:
  Sensor1Value = analogRead(Vpin1);
  // turn the ledPin on
  digitalWrite(ledPin, HIGH);
  // stop the program for <sensorValue> milliseconds:
  delay(Sensor1Value);
  // turn the ledPin off:
  digitalWrite(ledPin, LOW);
  // stop the program for for <sensorValue> milliseconds:
  delay(Sensor1Value);
  Sensor1Voltage = Sensor1Value * (5.0000 / 1023);
  Serial.println(Sensor1Voltage , 4);
  
}


```

simple serial interface [[‪C:\Users\James Cox\QMC-Instruments\Technical\UsefulLabTools\Code\LabView\ArduinoInterface\DiodeReadout\DiodeReadout_0.1.vi|labview code]]

# [[2021-02-09]]

- need to wire up to 10 pin connector then ready to run
taking data now. appears noisy, grounded cryostat to [[arduino]]

# [[2021-02-10]]

hooked up to [[1934]] current at 4K completely wrong, this is not the way to do it, remember that I originally thought of using LM234:

![[Pasted image 20210215093659.png]]

edited [[arduino]] [[code]] to take averages: ^87a54f

```
//Diode Readout

int Vpin1 = A1;
int ledPin = 13;      // select the pin for the LED
float Sensor1Value = 0.0;  // variable to store the value coming from the sensor
float Sensor1Voltage = 0.0;
int readings = 10000;      // the readings from the analog input
int count = 0;              // the index of the current reading
float total = 0.00;                  // the running total
float average = 0;                // the average


void setup() {
  // declare the ledPin as an OUTPUT:
  pinMode(ledPin, OUTPUT);
  Serial.begin(9600);           //  setup serial
}

void loop() {

  while (count < readings) {
  // read the value from the sensor:
  Sensor1Value = analogRead(Vpin1);
  // turn the ledPin on
  digitalWrite(ledPin, HIGH);
  // stop the program for <sensorValue> milliseconds:
  //delay(100);
  // stop the program for for <sensorValue> milliseconds:
  Sensor1Voltage = Sensor1Value * (5.0000 / 1023);
  total = Sensor1Voltage + total;
  count = count + 1;
  //Serial.println(count);
  //Serial.println(count);
  //Serial.println(average, 4);
  //Serial.println(readings);
  //Serial.println(Sensor1Value);
  //Serial.println(Sensor1Voltage);
  // turn the ledPin off:
  }
   average = total / readings;
    Serial.println(average , 4);
    digitalWrite(ledPin, LOW);
    //Serial.println(count);
    count = 0;
    total = 0;
    //Serial.println(count);
    //Serial.println("end");
}




```

^06b18c

