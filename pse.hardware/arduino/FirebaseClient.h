#ifndef FirebaseClient_H_
#define FirebaseClient_H_

#include <Firebase_ESP_Client.h>

#include "Network.h"

class FirebaseClient {
  private:
    FirebaseData firebaseData;
    FirebaseAuth firebaseAuth;
    FirebaseConfig firebaseConfig;
    void UpdateRTDBField(String path, double value);
    void UpdateRTDBField(String path, bool value);
    void AppendRTDBField(String path, double value);
    friend void FirestoreTokenStatusCallback(TokenInfo info);

  public:
    FirebaseData firebaseStream;
    FirebaseClient();
    void FirebaseInit(Network *networkInstance);
    bool CheckFirebaseReady();
    void UpdateFieldDouble(String field, double value);
    void UpdateFieldBoolean(String field, bool value);
    void UpdateTimestamp();
    void SetStreamCallbacks(void(*CallbackFunction)(MultiPathStream));
    void GerarAlarme(String tipo);
};

#endif
