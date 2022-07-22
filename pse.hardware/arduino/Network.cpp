#include "Network.h"
#include <WiFi.h>

//#define WIFI_SSID "VIVOFIBRA-46D8"
//#define WIFI_PASSWORD "14CFB7A82B"
#define WIFI_SSID "AndroidGustavo"
#define WIFI_PASSWORD "bolobolobolo"

static Network *instance = NULL;
Network::Network() {
  instance = this;
}

void WiFiEventConnected(WiFiEvent_t event, WiFiEventInfo_t info) {
  Serial.println("WiFi conectado! Aguardando IP local...");
}

void WiFiEventGotIP(WiFiEvent_t event, WiFiEventInfo_t info) {
  Serial.print("IP Local : ");
  Serial.println(WiFi.localIP());
}

void WiFiEventDisconnected(WiFiEvent_t event, WiFiEventInfo_t info) {
  Serial.println("Wifi Desconectado!");
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
}

void Network::InitWiFi() {
  WiFi.disconnect();
  WiFi.onEvent(WiFiEventConnected, SYSTEM_EVENT_STA_CONNECTED);
  WiFi.onEvent(WiFiEventGotIP, SYSTEM_EVENT_STA_GOT_IP);
  WiFi.onEvent(WiFiEventDisconnected, SYSTEM_EVENT_STA_DISCONNECTED);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
}

bool Network::CheckWifiConnected() {
  return WiFi.status() == WL_CONNECTED;
}
