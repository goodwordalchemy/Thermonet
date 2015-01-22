
  #include <GPRS_Shield_Arduino.h>
  #include <SoftwareSerial.h>
  #include <Wire.h>
  #include <Suli.h>
  
  #define PIN_TX    7
  #define PIN_RX    8
  #define BAUDRATE  9600
  #define PHONE_NUMBER "14152696222"
  
  GPRS gprs(PIN_TX,PIN_RX,BAUDRATE);//RX,TX,BaudRate
  
  int delayTimeMinutes = 5;
  #define numSamples 5
  #define sensor  0 // select the input pin for the thermistor
  
  int delayTime = delayTimeMinutes * 60 * 1000;
  
  // Steinhart - Hart variables.  Get from spreadsheet.
  float seriesResistance = 100000.0;
  float C = 0.000000027000;
  float B = -0.00026323;
  float A = 0.0061289;
  
  int samples[numSamples];
  
  void setup() {
    Serial.begin(19200);
    while(0 != gprs.init()) {
      delay(1000);
      Serial.print("init error\r\n");
    }  
    Serial.println("gprs init success");
  }
  
  void loop() {
    float averageADC = getADC();
    float temp = convertToTemp(averageADC); 
    
    Serial.print("Temperature: ");
    Serial.println(temp);
    Serial.println("start to send message ...");
    
    char charbuf[10];
    dtostrf(temp, 4, 0, charbuf); // floatvar, StringLengthIncDecimalPt, numsAfterDec, charbuf
    
    gprs.sendSMS(PHONE_NUMBER, charbuf);
 
    delay(delayTime);   
  }
  
  float getADC() {
    for(int i = 0; i < numSamples; i++) {
      samples[i]= analogRead(sensor);
      Serial.print("ADC reading: ");
      Serial.println(samples[i]);
      delay(2000);
    }
    
    float averageADC = 0;
    for (int i = 0; i < numSamples; i++) {
      averageADC += samples[i];
    }
    averageADC /= numSamples;
    //Serial.print("averageADC = : ");
    //Serial.println(averageADC);
    return averageADC;
  }
  
  float convertToTemp(float analogReading) {
    
    
    float thermistance = seriesResistance / (1023.0 / analogReading - 1.0);
    Serial.print("thermistance: ");
    Serial.println(thermistance);
    float temp = A +  B * log(thermistance) + C * (log(thermistance) * log(thermistance) * log(thermistance)  );
    temp = 1.0/temp;
    temp = (temp - 273.15) * 1.8000 + 32.0;
    
    return temp;
  }
