const JSON_TEMPLATE = {
  "CartContainer": {
    "globalSettings": {
      "orientation": "vertical",
      "showRating": true,
      "deliveryButtonStyle": "primary"
    },
    "styling": {
      "productHighlight": {
        "highlightBackground": "{{highlightBackground}}",
        "highlightPriceColor": "{{highlightPriceColor}}", 
        "highlightBorderColor": "{{highlightBorderColor}}",
        "highlightBorderWidth": "{{highlightBorderWidth}}"
      },
      "shopHighlight": {
        "shopBackground": "{{shopBackground}}",
        "shopBorderColor": "{{shopBorderColor}}",
        "shopBorderWidth": "{{shopBorderWidth}}"
      }
    },
    "shops": [
      {
        "id": "{{id}}",
        "storeName": "{{storeName}}",
        "promo": true,
        "percent": "{{percent}}",
        "rating": "{{rating}}",
        "background": "{{backgroundShop}}",
        "reviewsCount": "{{reviewsCount}}",
        "enableShopHighlight": true,
        "enableDeliveryButton": true,
        "products": [
          {
            "id": "{{id}}",
            "image": "{{image}}",
            "cost": "{{cost}}",
            "title": "{{title}}",
            "enableHighlight": true
          },
          {
            "id": "{{id}}",
            "image": "{{image}}",
            "cost": "{{cost}}",
            "title": "{{title}}",
            "enableHighlight": false
          }
        ]
      },
      {
        "id": "{{id}}",
        "storeName": "{{storeName}}",
        "promo": false,
        "percent": "{{percent}}",
        "rating": "{{rating}}",
        "background": "{{backgroundShop}}",
        "reviewsCount": "{{reviewsCount}}",
        "enableShopHighlight": false,
        "enableDeliveryButton": false,
        "products": [
          {
            "id": "{{id}}",
            "image": "{{image}}",
            "cost": "{{cost}}",
            "title": "{{title}}",
            "enableHighlight": true
          }
        ]
      }
    ]
  }
};

const DEFAULT_VALUES = {
    CartContainer: {
        globalSettings: {
            orientation: "vertical",
            showRating: true,
            deliveryButtonStyle: "primary"
        },
        styling: {
            productHighlight: {
                highlightBackground: "#FFFAE6",
                highlightPriceColor: "#FF6B35",
                highlightBorderColor: "#FFD166",
                highlightBorderWidth: "2px"
            },
            shopHighlight: {
                shopBackground: "#F0F8FF",
                shopBorderColor: "#4A90E2",
                shopBorderWidth: "1px"
            }
        }
    }
};

const CONTROL_CONFIG = [
    {
        title: "🌐 Глобальные настройки",
        type: "radio",
        name: "orientation",
        options: [
            { value: "vertical", label: "Вертикальная" },
            { value: "horizontal", label: "Горизонтальная" }
        ]
    },
    {
        title: "📊 Отображение информации",
        type: "toggle",
        controls: [
            { id: "showRating", label: "Показывать рейтинг" }
        ]
    },
    {
        title: "🎨 Стиль кнопки доставки",
        type: "radio",
        name: "deliveryButtonStyle",
        options: [
            { value: "primary", label: "Основной" },
            { value: "secondary", label: "Второстепенный" },
            { value: "outline", label: "Контурный" }
        ]
    },
    {
        title: "🌈 Стиль выделения товаров",
        type: "color",
        controls: [
            { id: "highlightBackground", label: "Фон выделения" },
            { id: "highlightPriceColor", label: "Цвет цены" },
            { id: "highlightBorderColor", label: "Цвет рамки" }
        ]
    },
    {
        title: "📏 Настройки рамок",
        type: "border",
        controls: [
            { id: "highlightBorderWidth", label: "Толщина рамки товара" },
            { id: "shopBorderWidth", label: "Толщина рамки магазина" }
        ]
    },
    {
        title: "🏪 Стиль выделения магазинов",
        type: "color",
        controls: [
            { id: "shopBackground", label: "Фон магазина" },
            { id: "shopBorderColor", label: "Цвет рамки магазина" }
        ]
    }
];