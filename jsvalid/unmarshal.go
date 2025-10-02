package jsvalid

import (
  "encoding/json"

  "net/http"
)

type Product struct {
  ID            string `json:"id"`
  Image         string `json:"image"`
  Cost          string `json:"cost"`
  Title         string `json:"title"`
  EnableHighlight bool `json:"enableHighlight"`
}

type Shop struct {
  ID                string    `json:"id"`
  StoreName         string    `json:"storeName"`
  Promo             bool      `json:"promo"`
  Percent           string    `json:"percent"`
  Rating            string    `json:"rating"`
  Background        string    `json:"background"`
  ReviewsCount      string    `json:"reviewsCount"`
  EnableShopHighlight bool    `json:"enableShopHighlight"`
  EnableDeliveryButton bool   `json:"enableDeliveryButton"`
  Products          []Product `json:"products"`
}

type ProductHighlight struct {
  HighlightBackground string `json:"highlightBackground"`
  HighlightPriceColor string `json:"highlightPriceColor"`
  HighlightBorderColor string `json:"highlightBorderColor"`
  HighlightBorderWidth string `json:"highlightBorderWidth"`
}

type ShopHighlight struct {
  ShopBackground  string `json:"shopBackground"`
  ShopBorderColor string `json:"shopBorderColor"`
  ShopBorderWidth string `json:"shopBorderWidth"`
}

type Styling struct {
  ProductHighlight ProductHighlight `json:"productHighlight"`
  ShopHighlight    ShopHighlight    `json:"shopHighlight"`
}

type GlobalSettings struct {
  Orientation        string `json:"orientation"`
  ShowRating         bool   `json:"showRating"`
  DeliveryButtonStyle string `json:"deliveryButtonStyle"`
}

type CartContainer struct {
  GlobalSettings GlobalSettings `json:"globalSettings"`
  Styling        Styling        `json:"styling"`
  Shops          []Shop         `json:"shops"`
}

type CartResponse struct {
  CartContainer CartContainer `json:"CartContainer"`
}

type Bank struct {
  Label       string `json:"label"`
  Name        string `json:"name"`
  Description string `json:"description"`
  Discount    string `json:"discount"`
}

type Recipient struct {
  FullName string `json:"fullName"`
  Phone    string `json:"phone"`
  Email    string `json:"email"`
}

type CheckoutContainer struct {
  Recipient Recipient `json:"recipient"`
  Banks     []Bank    `json:"banks"`
}

type CheckoutResponse struct {
  CheckoutContainer CheckoutContainer `json:"CheckoutContainer"`
}

func CartHandler(w http.ResponseWriter, r *http.Request) {
  if r.Method != http.MethodGet {
    http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
    return
  }


    response := CartResponse{
      CartContainer: CartContainer{
        GlobalSettings: GlobalSettings{
          Orientation:        "vertical",
          ShowRating:         true,
          DeliveryButtonStyle: "primary",
        },
        Styling: Styling{
          ProductHighlight: ProductHighlight{
            HighlightBackground: "#FFE6E6",
            HighlightPriceColor: "#FF4444",
            HighlightBorderColor: "#FF4444",
            HighlightBorderWidth: "2px",
          },
          ShopHighlight: ShopHighlight{
            ShopBackground:  "#F0F8FF",
            ShopBorderColor: "#4169E1",
            ShopBorderWidth: "1px",
          },
        },
        Shops: []Shop{
          {
            ID:                "shop1",
            StoreName:         "Супермаркет Продукты",
            Promo:             true,
            Percent:           "10%",
            Rating:            "4.8",
            Background:        "#FFFFFF",
            ReviewsCount:      "1250",
            EnableShopHighlight: true,
            EnableDeliveryButton: true,
            Products: []Product{
              {
                ID:            "prod1",
                Image:         "https://example.com/images/milk.jpg",
                Cost:          "85 руб.",
                Title:         "Молоко Простоквашино",
                EnableHighlight: true,
              },
              {
                ID:            "prod2",
                Image:         "https://example.com/images/bread.jpg",
                Cost:          "45 руб.",
                Title:         "Хлеб Бородинский",
                EnableHighlight: false,
              },
            },
          },
          {
            ID:                "shop2",
            StoreName:         "Магазин Техники",
            Promo:             false,
            Percent:           "0%",
            Rating:            "4.5",
            Background:        "#F5F5F5",
            ReviewsCount:      "890",
            EnableShopHighlight: false,
            EnableDeliveryButton: false,
            Products: []Product{
              {
                ID:            "prod3",
                Image:         "https://example.com/images/phone.jpg",
                Cost:          "25990 руб.",
                Title:         "Смартфон Samsung",
                EnableHighlight: true,
              },
            },
          },
        },
      },
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(response)
  }

  func CheckoutHandler(w http.ResponseWriter, r *http.Request) {
    if r.Method != http.MethodGet {
      http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
      return
    }

    response := CheckoutResponse{
      CheckoutContainer: CheckoutContainer{
        Recipient: Recipient{
          FullName: "Иван Иванов",
          Phone:    "+7 (912) 345-67-89",
          Email:    "ivan@example.com",
        },
        Banks: []Bank{
          {
            Label:       "https://example.com/images/sber.jpg",
            Name:        "Сбербанк",
            Description: "Оплата картой Сбербанка",
            Discount:    "5%",
          },
          {
            Label:       "https://example.com/images/tinkoff.jpg",
            Name:        "Тинькофф",
            Description: "Оплата картой Тинькофф",
            Discount:    "3%",
          },
        },
      },
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(response)
  }

