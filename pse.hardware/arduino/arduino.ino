#include <Arduino.h>

#include "Network.h"
#include "FirebaseClient.h"
#include "Ultrasonic.h"

#define PINO_SOLENOIDE 27
#define PINO_BOMBA 32
#define PINO_ALARME 26
#define PINO_SENSOR_ECHO 33
#define PINO_SENSOR_TRIG 25

Network *network;
FirebaseClient *firebaseClient;

Ultrasonic ultrasonic(PINO_SENSOR_TRIG, PINO_SENSOR_ECHO);

int contadorGeracaoDadoGrafico = 0;
int limiteContadorGeracaoDadoGrafico = 10;

int cooldownRotinaAlarmes = 0;

float porcentagemAltura;

boolean callbackIniciado = false;

boolean modoAutomatico = false;
boolean statusBombaManual = false;
boolean statusSolenoideManual = false;
float nivelIdealAlto = 30;
float nivelIdealBaixo = 70;
float nivelSeguroAlto = 10;
float nivelSeguroBaixo = 90;

float alturaMinima = 0;
float alturaMaxima = 100;

float lerSensorUltrassonico() {
  int distanciaCM;
  long microsec = ultrasonic.timing();
  return ultrasonic.convert(microsec, Ultrasonic::CM);
}

bool StringToBool(String value) {
  return value.equals("true");
}

float StringToFloat(String value) {
  return strtof(value.c_str(), NULL);
}

void ModuleTask(void *arg) {
  while (true) {
    if (network->CheckWifiConnected() &&
        !firebaseClient->CheckFirebaseReady()) {
      firebaseClient->FirebaseInit(network);
    } else {
      if (firebaseClient->CheckFirebaseReady()) {
        if (!callbackIniciado) {
          firebaseClient->SetStreamCallbacks(StreamCallback);
          callbackIniciado = true;
        } else {
          rotinaPrincipal();
        }
      }
    }
    vTaskDelay(1000);
  }
}

void setup() {
  Serial.begin(115200);
  Serial.println("Iniciando...");

  network = new Network();
  firebaseClient = new FirebaseClient();
  network->InitWiFi();

  pinMode(PINO_SOLENOIDE, OUTPUT);
  pinMode(PINO_BOMBA, OUTPUT);
  pinMode(PINO_ALARME, OUTPUT);
  pinMode(PINO_SENSOR_ECHO, INPUT);
  pinMode(PINO_SENSOR_TRIG, OUTPUT);

  
  digitalWrite(PINO_SOLENOIDE, HIGH);
  digitalWrite(PINO_BOMBA, HIGH);
  
  xTaskCreatePinnedToCore(ModuleTask, "ModuleTask", 10240, NULL, 4, NULL,
                          tskNO_AFFINITY);
}

//Ignorar
void loop() {}

// Essa função será chamada a cada alteração no banco.
void StreamCallback(MultiPathStream stream) {
  // Você pode checar o caminho de onde veio a alteração com stream.get("caminho")
  // O valor alterado pode ser acessado com stream.value
  Serial.println("CALLBACK!!!");
  Serial.println(stream.value);
  
  if (stream.get("controle/modo"))
    modoAutomatico = stream.value == "automatico";
  if (stream.get("controle/statusEntrada"))
    statusBombaManual = StringToBool(stream.value);
  if (stream.get("controle/statusSaida"))
    statusSolenoideManual = StringToBool(stream.value);
  if (stream.get("controle/nivelIdealAlto"))
    nivelIdealAlto = StringToFloat(stream.value) / 100.0;
  if (stream.get("controle/nivelIdealBaixo"))
    nivelIdealBaixo = StringToFloat(stream.value) / 100.0;
  if (stream.get("controle/nivelSeguroAlto"))
    nivelSeguroAlto = StringToFloat(stream.value) / 100.0;
  if (stream.get("controle/nivelSeguroBaixo"))
    nivelSeguroBaixo = StringToFloat(stream.value) / 100.0;
  if (stream.get("auxiliar/alturaMinima"))
    alturaMinima = StringToFloat(stream.value);
  if (stream.get("auxiliar/alturaMaxima")) 
    alturaMaxima = StringToFloat(stream.value);
  
}

// Nosso void loop
// Delay padrão de 1s (pode ser alterado acima)
void rotinaPrincipal() {
  Serial.println("ROTINA!");
  rotinaLeituraNivel();
  rotinaAcionamentoAtuadores();
  rotinaAlarmes();

  /*
    Gerar Alarme
    firebaseClient->GerarAlarme("AL01");

    Setar Boolean
    firebaseClient->UpdateFieldBoolean("informacoesTanque/valvulaEntrada", true);

    Setar Double
    firebaseClient->UpdateFieldDouble("informacoesTanque/altura", 0.7);
  */

}

void rotinaLeituraNivel() {
  float distanciaSensor = lerSensorUltrassonico();

  porcentagemAltura = (alturaMaxima - distanciaSensor) / (alturaMaxima - alturaMinima);
  firebaseClient->UpdateFieldDouble("auxiliar/leituraSensor", distanciaSensor);
  firebaseClient->UpdateFieldDouble("informacoesTanque/altura", porcentagemAltura);

  if (++contadorGeracaoDadoGrafico > limiteContadorGeracaoDadoGrafico) {
    contadorGeracaoDadoGrafico = 0;
    firebaseClient->GerarDadoGrafico(porcentagemAltura);
  }
}

void rotinaAcionamentoAtuadores() {

  // Todos os digitalWrites estão com ! para inverter o valor mesmo. Aparentemente é assim que o relé funciona.
  
  if (modoAutomatico) {
    if (porcentagemAltura < nivelIdealBaixo) {
      digitalWrite(PINO_BOMBA, !HIGH);
      firebaseClient->UpdateFieldBoolean("informacoesTanque/valvulaEntrada", true);
    } else if (porcentagemAltura > nivelIdealBaixo) {
      digitalWrite(PINO_BOMBA, !LOW);
      firebaseClient->UpdateFieldBoolean("informacoesTanque/valvulaEntrada", false);
    }
    if (porcentagemAltura > nivelIdealAlto) {
      digitalWrite(PINO_SOLENOIDE, !HIGH);
      firebaseClient->UpdateFieldBoolean("informacoesTanque/valvulaSaida", true);
    } else if (porcentagemAltura < nivelIdealAlto) {
      digitalWrite(PINO_SOLENOIDE, !LOW);
      firebaseClient->UpdateFieldBoolean("informacoesTanque/valvulaSaida", false);
    }
  } else {
    digitalWrite(PINO_BOMBA, !statusBombaManual);
    firebaseClient->UpdateFieldBoolean("informacoesTanque/valvulaEntrada", statusBombaManual);
    digitalWrite(PINO_SOLENOIDE, !statusSolenoideManual);
    firebaseClient->UpdateFieldBoolean("informacoesTanque/valvulaSaida", statusSolenoideManual);
  }
}

void rotinaAlarmes() {

  if (cooldownRotinaAlarmes-- > 0)
    return;


  boolean alarmeGerado = false;
  if (porcentagemAltura > nivelSeguroAlto) {
    firebaseClient->GerarAlarme("AL01");
    alarmeGerado = true;
  } else if (porcentagemAltura < nivelSeguroBaixo) {
    firebaseClient->GerarAlarme("AL02");
    alarmeGerado = true;
  }

  if (alarmeGerado) {
    for (int i = 0; i < 3; i++) {
      digitalWrite(PINO_ALARME, HIGH);
      delay(100);
      digitalWrite(PINO_ALARME, LOW);
      delay(100);
    }
    cooldownRotinaAlarmes = 10;
  }
}
