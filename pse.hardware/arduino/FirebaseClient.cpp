#include "FirebaseClient.h"

#include <addons/RTDBHelper.h>
#include <addons/TokenHelper.h>

#define API_KEY "AIzaSyBk99hgR3vevjdF0ig9dXH__yDA0Pyr33I"
#define FIREBASE_PROJECT_ID "ufmg-pse-976db"
#define USER_EMAIL "gustavocesario@ufmg.br"
#define USER_PASSWORD "senha123"

#define DATABASE_URL "https://ufmg-pse-976db-default-rtdb.firebaseio.com"
const String PATH_MODULOS = "modulos";
const String PATH_REGISTROS = "registros";
const String FIELD_TIMESTAMP = "timestamp";

static FirebaseClient *instance = NULL;
FirebaseClient::FirebaseClient() {
  instance = this;
}

void FirestoreTokenStatusCallback(TokenInfo info) {
  Serial.printf("[Firebase] Token callback!\n");
}

void StreamTimeoutCallback(bool timeout) {
  if (timeout) Serial.println("[Firebase] Timeout, continuando...\n");
  if (!instance->firebaseStream.httpConnected())
    Serial.printf("[Firebase] Codigo de erro: %d, motivo: %s\n\n",
                  instance->firebaseStream.httpCode(),
                  instance->firebaseStream.errorReason().c_str());
}

void FirebaseClient::FirebaseInit(Network *networkInstance) {
    firebaseConfig.api_key = API_KEY;
    firebaseAuth.user.email = USER_EMAIL;
    firebaseAuth.user.password = USER_PASSWORD;

    firebaseConfig.database_url = DATABASE_URL;
    firebaseConfig.token_status_callback = FirestoreTokenStatusCallback;

    Serial.println("[Firebase] Iniciando...");
    Firebase.begin(&firebaseConfig, &firebaseAuth);
    Firebase.reconnectWiFi(true);
}

void FirebaseClient::SetStreamCallbacks(void (*CallbackFunction)(MultiPathStream)) {
  String fullPath = "/";

  if (!Firebase.RTDB.beginMultiPathStream(&firebaseStream, fullPath))
    Serial.printf("[Firebase] Erro ao iniciar stream, %s\n\n",
                  firebaseStream.errorReason().c_str());

  Firebase.RTDB.setMultiPathStreamCallback(&firebaseStream, CallbackFunction,
      StreamTimeoutCallback);
}

void FirebaseClient::UpdateRTDBField(String path, double value) {
  Firebase.RTDB.setDoubleAsync(&firebaseData, F(path.c_str()), value);
}

void FirebaseClient::UpdateRTDBField(String path, bool value) {
  Firebase.RTDB.setBoolAsync(&firebaseData, F(path.c_str()), value);
}

void FirebaseClient::UpdateTimestamp() {
  String fullPath = FIELD_TIMESTAMP;
  FirebaseJson json;
  json.set(".sv", "timestamp");
  Firebase.RTDB.setJSONAsync(&firebaseData, F(fullPath.c_str()), &json);
}

void FirebaseClient::UpdateFieldDouble(String field, double value) {
  String fullPath = field;
  FirebaseClient::UpdateRTDBField(fullPath, value);
}

void FirebaseClient::UpdateFieldBoolean(String field, bool value) {
  String fullPath = field;
  FirebaseClient::UpdateRTDBField(fullPath, value);
}

void FirebaseClient::GerarAlarme(String tipo) {
  FirebaseJson json;
  FirebaseJson jsonTimestamp;
  jsonTimestamp.set(".sv", "timestamp");
  json.add("tipo", tipo);
  json.add("dataHora", jsonTimestamp);
  Firebase.RTDB.pushJSON(&firebaseData, "/alarmes", &json);
}

bool FirebaseClient::CheckFirebaseReady() {
  return Firebase.ready();
}
