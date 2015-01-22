
  #define numSamples 5
  #define sensor  0 // select the input pin for the thermistor
  
  // Steinhart - Hart variables.  Get from spreadsheet.
  float seriesResistance = 100000.0;
  float C = 0.000000027000;
  float B = -0.00026323;
  float A = 0.0061289;
  
  int samples[numSamples];
  
  void setup() {
    Serial.begin(19200);
  }
  
  void loop() {
    float averageADC = getADC();
    float temp = convertToTemp(averageADC);
    
    char charbuf[10];
    dtostrf(temp, 4, 0, charbuf); // float variable, length of string that will be created, number of digits after decimal, array to store results
    
    Serial.print("Temperature: ");
    Serial.println(charbuf);
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
