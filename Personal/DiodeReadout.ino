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
