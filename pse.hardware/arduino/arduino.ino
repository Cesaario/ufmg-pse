#include <Arduino.h>

#include "Network.h"
#include "FirebaseClient.h"

Network *network;
FirebaseClient *firebaseClient;

int counter = 0;

void ModuleTask(void *arg) {
  String campo = "contador";
  while (true) {
    if (network->CheckWifiConnected() &&
        !firebaseClient->CheckFirebaseReady()) {
      firebaseClient->FirebaseInit(network);
    } else {
      firebaseClient->UpdateFieldDouble(campo, (counter++) * 1.0);
    }
    vTaskDelay(1000);
  }
}

void rotinaPrincipal() {
  Serial.println("OI");
}

void setup() {
  Serial.begin(115200);
  Serial.println("Iniciando...");

  network = new Network();
  firebaseClient = new FirebaseClient();
  network->InitWiFi();

  xTaskCreatePinnedToCore(ModuleTask, "ModuleTask", 10240, NULL, 4, NULL,
                          tskNO_AFFINITY);
}

void loop() {}
