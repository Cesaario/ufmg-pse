#include "Ultrasonic.h"

#define PIN_TRIGGER 34
#define PIN_ECHO 35
#define PIN_BOMBA 32
#define PIN_SOLENOIDE 33
#define PIN_ALARME 25

#define PIN_ESCRITA_BOMBA 26
#define PIN_ESCRITA_SOLENOIDE 27
#define PIN_ESCRITA_ALARME 14

Ultrasonic ultrasonic(PIN_TRIGGER, PIN_ECHO);

int statusBomba = LOW;
int statusSolenoide = LOW;
int statusAlarme = LOW;

void setup() {
  Serial.begin(115200);
  pinMode(PIN_BOMBA, INPUT);
  pinMode(PIN_SOLENOIDE, INPUT);
  pinMode(PIN_ALARME, INPUT);
  pinMode(PIN_ESCRITA_BOMBA, OUTPUT);
  pinMode(PIN_ESCRITA_SOLENOIDE, OUTPUT);
  pinMode(PIN_ESCRITA_ALARME, OUTPUT);
}

void loop() {
  Serial.println("---------------");
  Serial.print("Sensor: ");
  Serial.println(lerSensorUltrassonico());
  Serial.print("Bomba: ");
  Serial.println(digitalRead(PIN_BOMBA));
  Serial.print("Solenoide: ");
  Serial.println(digitalRead(PIN_SOLENOIDE));
  Serial.print("Alarme: ");
  Serial.println(digitalRead(PIN_ALARME));

  if (Serial.available() > 0) {
    Serial.println("---------------");
    String comando = Serial.readString();
    comando.trim();

    if (comando == "B") {
      statusBomba = !statusBomba;
      digitalWrite(PIN_ESCRITA_BOMBA, statusBomba);
      Serial.println(statusBomba ? " > Bomba ligada!" : " > Bomba desligada!");
    } else if (comando == "S") {
      statusSolenoide = !statusSolenoide;
      digitalWrite(PIN_ESCRITA_SOLENOIDE, statusSolenoide);
      Serial.println(statusSolenoide ? " > Solenoide ligada!" : " > Solenoide desligada!");
    } else if (comando == "A") {
      statusAlarme = !statusAlarme;
      digitalWrite(PIN_ESCRITA_ALARME, statusAlarme);
      Serial.println(statusAlarme ? " > Alarme ligado!" : " > Alarme desligado!");
    }
  }

  delay(500);
}

float lerSensorUltrassonico()
{
  int distanciaCM;
  long microsec = ultrasonic.timing();
  return ultrasonic.convert(microsec, Ultrasonic::CM);
}
