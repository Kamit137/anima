package main

import (
    "encoding/json"
    "net/http"
    "net/http/httptest"
    "strings"
    "testing"
)

func TestSaveConfig(t *testing.T) {
    jsonData := `{
        "CartContainer": {
            "globalSettings": {
                "orientation": "vertical",
                "showRating": true,
                "deliveryButtonStyle": "primary"
            },
            "styling": {
                "productHighlight": {
                    "highlightBackground": "{{highlightBackground}}",
                    "highlightPriceColor": "{{highlightPriceColor}}"
                },
                "shopHighlight": {
                    "shopBackground": "{{shopBackground}}"
                }
            },
            "shops": [
                {
                    "id": "{{id}}",
                    "storeName": "{{storeName}}",
                    "promo": true,
                    "products": [
                        {
                            "id": "{{id}}",
                            "title": "{{title}}"
                        }
                    ]
                }
            ]
        }
    }`

    req, err := http.NewRequest("POST", "/save-config", strings.NewReader(jsonData))
    if err != nil {
        t.Fatal(err)
    }

    rr := httptest.NewRecorder()
    handler := http.HandlerFunc(saveHandler)

    handler.ServeHTTP(rr, req)

    if status := rr.Code; status != http.StatusOK {
        t.Errorf("handler returned wrong status code: got %v want %v", status, http.StatusOK)
    }

    var response map[string]interface{}
    err = json.Unmarshal(rr.Body.Bytes(), &response)
    if err != nil {
        t.Fatal(err)
    }

    if response["status"] != "success" {
        t.Errorf("handler returned unexpected status: %v", response["status"])
    }

    t.Log("Response:", string(rr.Body.Bytes()))
}
