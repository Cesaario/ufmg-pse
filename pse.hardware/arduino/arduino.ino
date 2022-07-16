#include <Arduino.h>

#include "Network.h"
#include "FirebaseClient.h"

Network *network;
FirebaseClient *firebaseClient;

boolean callbackIniciado = false;

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

  xTaskCreatePinnedToCore(ModuleTask, "ModuleTask", 10240, NULL, 4, NULL,
                          tskNO_AFFINITY);
}

//Ignorar
void loop() {}

// Essa função será chamada a cada alteração no banco.
void StreamCallback(MultiPathStream stream) {
  // Você pode checar o caminho de onde veio a alteração com stream.get("caminho")
  // O valor alterado pode ser acessado com stream.value
  if(stream.get("controle/modo"))
    Serial.println("controle/modo alterado! " + stream.value);
  }
}

// Nosso void loop
// Delay padrão de 1s (pode ser alterado acima)
void rotinaPrincipal() {
  Serial.println("OI");

  /*
    Gerar Alarme
    firebaseClient->GerarAlarme("AL01");

    Setar Boolean
    firebaseClient->UpdateFieldBoolean("informacoesTanque/valvulaEntrada", true);

    Setar Double
    firebaseClient->UpdateFieldDouble("informacoesTanque/altura", 0.7);
   */

}
