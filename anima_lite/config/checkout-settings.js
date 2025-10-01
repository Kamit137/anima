const CHECKOUT_JSON_TEMPLATE = {
    "CheckoutContainer": {
      "recipient": {
        "fullName": "{{fullName}}",
        "phone": "{{phone}}", 
        "email": "{{email}}"
      },
      "banks": [
        {
          "label": "{{image}}",
          "name": "{{name}}",
          "description": "{{description}}",
          "discountIsVisible": true,
          "discount": "{{discount}}"
        },
        {
          "label": "{{image}}", 
          "name": "{{name}}",
          "description": "{{description}}",
          "discountIsVisible": false,
          "discount": "{{discount}}"
        }
      ]
    }
  };
  
  const CHECKOUT_DEFAULT_VALUES = {
      CheckoutContainer: {
          banks: [
              {
                  label: "bank1-logo.png",
                  name: "Тинькофф",
                  description: "Оплата картой Тинькофф",
                  discountIsVisible: true,
                  discount: "5%"
              },
              {
                  label: "bank2-logo.png",
                  name: "Сбербанк",
                  description: "Оплата картой Сбербанка", 
                  discountIsVisible: false,
                  discount: "3%"
              }
          ]
      }
  };
  
  const CHECKOUT_CONTROL_CONFIG = [
      {
          title: "🏦 Банк 1",
          type: "bank",
          bankIndex: 0,
          controls: [
              { id: "bank1-label", label: "Изображение", type: "text" },
              { id: "bank1-name", label: "Название банка", type: "text" },
              { id: "bank1-description", label: "Описание", type: "text" },
              { id: "bank1-discountIsVisible", label: "Показывать скидку", type: "toggle" },
              { id: "bank1-discount", label: "Размер скидки", type: "text" }
          ]
      },
      {
          title: "🏦 Банк 2", 
          type: "bank",
          bankIndex: 1,
          controls: [
              { id: "bank2-label", label: "Изображение", type: "text" },
              { id: "bank2-name", label: "Название банка", type: "text" },
              { id: "bank2-description", label: "Описание", type: "text" },
              { id: "bank2-discountIsVisible", label: "Показывать скидку", type: "toggle" },
              { id: "bank2-discount", label: "Размер скидки", type: "text" }
          ]
      }
  ];