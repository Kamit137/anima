package jsvalid

import (
	"encoding/json"
	"fmt"
	"strings"
)

type UserRegLog struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type UserSave struct {
	Email   string          `json:"email"`
	Save    json.RawMessage `json:"save"`
	Actions string          `json:"actions"`
}
type Margin struct {
	Top    int `json:"top" validate:"min=0"`
	Bottom int `json:"bottom" validate:"min=0"`
}
type Padding struct {
	Vertical   int `json:"vertical" validate:"min=0"`
	Horizontal int `json:"horizontal" validate:"min=0"`
}
type Action struct {
	Type   string `json:"type" validate:"required,oneof=navigate submit close"`
	Target string `json:"target,omitempty"`
}
type Style struct {
	FontSize        int      `json:"font_size,omitempty" validate:"min=8,max=72"`
	FontWeight      string   `json:"font_weight,omitempty" validate:"omitempty,oneof=normal bold bolder lighter"`
	Color           string   `json:"color,omitempty" validate:"omitempty,hexcolor"`
	TextAlign       string   `json:"text_align,omitempty" validate:"omitempty,oneof=left right center justify"`
	Margin          *Margin  `json:"margin,omitempty"`
	BackgroundColor string   `json:"background_color,omitempty" validate:"omitempty,hexcolor"`
	TextColor       string   `json:"text_color,omitempty" validate:"omitempty,hexcolor"`
	BorderRadius    int      `json:"border_radius,omitempty" validate:"min=0,max=50"`
	Padding         *Padding `json:"padding,omitempty"`
}
type ColorTheme struct {
	ThemeID    string `json:"theme_id" validate:"required"`
	Primary    string `json:"primary" validate:"required,hexcolor"`
	Secondary  string `json:"secondary" validate:"required,hexcolor"`
	Success    string `json:"success" validate:"required,hexcolor"`
	Danger     string `json:"danger" validate:"required,hexcolor"`
	Background string `json:"background" validate:"required,hexcolor"`
	Surface    string `json:"surface" validate:"required,hexcolor"`
}
type ButtonStyle struct {
	StyleID           string `json:"style_id" validate:"required"`
	Type              string `json:"type" validate:"required,oneof=button_style"`
	BackgroundColor   string `json:"background_color" validate:"required,hexcolor"`
	TextColor         string `json:"text_color" validate:"required,hexcolor"`
	BorderRadius      int    `json:"border_radius" validate:"min=0,max=50"`
	PaddingVertical   int    `json:"padding_vertical" validate:"min=0"`
	PaddingHorizontal int    `json:"padding_horizontal" validate:"min=0"`
	FontSize          int    `json:"font_size" validate:"min=8,max=72"`
	FontWeight        string `json:"font_weight" validate:"required,oneof=normal bold bolder lighter"`
}
type TextComponent struct {
	Type    string `json:"type" validate:"required,oneof=text"`
	ID      string `json:"id" validate:"required"`
	Content string `json:"content" validate:"required"`
	Style   *Style `json:"style,omitempty"`
}
type ButtonComponent struct {
	Type   string `json:"type" validate:"required,oneof=button"`
	ID     string `json:"id" validate:"required"`
	Text   string `json:"text" validate:"required"`
	Style  *Style `json:"style,omitempty"`
	Action Action `json:"action" validate:"required"`
}

type CartItemConfig struct {
	ShowImage            bool   `json:"show_image"`
	ImageSize            string `json:"image_size" validate:"omitempty,oneof=small medium large"`
	ShowQuantityControls bool   `json:"show_quantity_controls"`
	ShowFavoriteIcon     bool   `json:"show_favorite_icon"`
	Actions              struct {
		OnTap    string `json:"on_tap" validate:"required"`
		OnRemove string `json:"on_remove" validate:"required"`
	} `json:"actions"`
}

type CartItemDataBindings struct {
	Title    string `json:"title" validate:"required"`
	Price    string `json:"price" validate:"required"`
	ImageURL string `json:"image_url" validate:"required"`
}

type CartItemComponent struct {
	Type         string               `json:"type" validate:"required,oneof=cart_item"`
	ID           string               `json:"id" validate:"required"`
	Layout       string               `json:"layout" validate:"required,oneof=compact detailed"`
	Config       CartItemConfig       `json:"config"`
	DataBindings CartItemDataBindings `json:"data_bindings" validate:"required"`
}

type Condition struct {
	Type     string `json:"type" validate:"required,oneof=item_count price_count"`
	Operator string `json:"operator" validate:"required,oneof=> >= < <= == !="`
	Value    int    `json:"value" validate:"min=0"`
	Scope    string `json:"scope,omitempty" validate:"omitempty,oneof=same_store entire_cart"`
}

type PromoBannerContent struct {
	Title         string `json:"title" validate:"required"`
	HighlightText string `json:"highlight_text" validate:"required"`
}

type PromoBannerStyle struct {
	BackgroundColor string `json:"background_color" validate:"required,hexcolor"`
	TextColor       string `json:"text_color" validate:"required,hexcolor"`
}

type PromoBanner struct {
	Type       string             `json:"type" validate:"required,oneof=promo_banner"`
	ID         string             `json:"id" validate:"required"`
	Conditions []Condition        `json:"conditions" validate:"required,min=1"`
	Content    PromoBannerContent `json:"content" validate:"required"`
	Style      PromoBannerStyle   `json:"style" validate:"required"`
}

type PromoRule struct {
	Type            string `json:"type" validate:"required,oneof=bulk_discount free_shipping"`
	Threshold       int    `json:"threshold,omitempty" validate:"min=1"`
	DiscountPercent int    `json:"discount_percent,omitempty" validate:"min=0,max=100"`
}

type StoreGroupConfig struct {
	HeaderStyle     string      `json:"header_style" validate:"required,oneof=compact expanded"`
	Collapsible     bool        `json:"collapsible"`
	ShowRating      bool        `json:"show_rating"`
	ShowPromoBanner bool        `json:"show_promo_banner"`
	PromoRules      []PromoRule `json:"promo_rules,omitempty"`
}

type StoreGroupComponent struct {
	Type   string           `json:"type" validate:"required,oneof=store_group"`
	ID     string           `json:"id" validate:"required"`
	Config StoreGroupConfig `json:"config" validate:"required"`
}

type EmptyState struct {
	Type       string `json:"type" validate:"required,oneof=empty_state"`
	ImageURL   string `json:"image_url" validate:"required"`
	Title      string `json:"title" validate:"required"`
	ButtonText string `json:"button_text" validate:"required"`
}

type ConditionalComponent struct {
	Type      string        `json:"type" validate:"required,oneof=conditional"`
	Condition string        `json:"condition" validate:"required"`
	Children  []interface{} `json:"children" validate:"required,min=1"`
}

type CartSummaryConfig struct {
	Layout        string `json:"layout" validate:"required,oneof=compact detailed"`
	ShowDiscounts bool   `json:"show_discounts"`
}

type CartSummaryComponent struct {
	Type   string            `json:"type" validate:"required,oneof=cart_summary"`
	ID     string            `json:"id" validate:"required"`
	Config CartSummaryConfig `json:"config" validate:"required"`
}

type Layout struct {
	Type     string        `json:"type" validate:"required,oneof=column row grid"`
	Children []interface{} `json:"children" validate:"required"`
}

type Screen struct {
	ScreenID string `json:"screen_id" validate:"required"`
	Version  string `json:"version" validate:"required"`
	Layout   Layout `json:"layout" validate:"required"`
}
type ComponentType struct {
	Type string `json:"type"`
}

func ValidateJSON(jsonData string) (bool, string, error) {
	var base ComponentType
	if err := json.Unmarshal([]byte(jsonData), &base); err != nil {
		return false, "", fmt.Errorf("invalid JSON format: %v", err)
	}

	var validationError error
	var component interface{}

	switch base.Type {
	case "text":
		var comp TextComponent
		if err := json.Unmarshal([]byte(jsonData), &comp); err != nil {
			return false, "", fmt.Errorf("invalid text component: %v", err)
		}
		validationError = validateTextComponent(comp)
		component = comp

	case "button":
		var comp ButtonComponent
		if err := json.Unmarshal([]byte(jsonData), &comp); err != nil {
			return false, "", fmt.Errorf("invalid button component: %v", err)
		}
		validationError = validateButtonComponent(comp)
		component = comp

	case "cart_item":
		var comp CartItemComponent
		if err := json.Unmarshal([]byte(jsonData), &comp); err != nil {
			return false, "", fmt.Errorf("invalid cart item component: %v", err)
		}
		validationError = validateCartItemComponent(comp)
		component = comp

	case "promo_banner":
		var comp PromoBanner
		if err := json.Unmarshal([]byte(jsonData), &comp); err != nil {
			return false, "", fmt.Errorf("invalid promo banner: %v", err)
		}
		validationError = validatePromoBanner(comp)
		component = comp

	case "store_group":
		var comp StoreGroupComponent
		if err := json.Unmarshal([]byte(jsonData), &comp); err != nil {
			return false, "", fmt.Errorf("invalid store group: %v", err)
		}
		validationError = validateStoreGroupComponent(comp)
		component = comp

	case "cart_summary":
		var comp CartSummaryComponent
		if err := json.Unmarshal([]byte(jsonData), &comp); err != nil {
			return false, "", fmt.Errorf("invalid cart summary: %v", err)
		}
		validationError = validateCartSummaryComponent(comp)
		component = comp

	case "button_style":
		var comp ButtonStyle
		if err := json.Unmarshal([]byte(jsonData), &comp); err != nil {
			return false, "", fmt.Errorf("invalid button style: %v", err)
		}
		validationError = validateButtonStyle(comp)
		component = comp

	default:
		return false, "", fmt.Errorf("unknown component type: %s", base.Type)
	}

	if validationError != nil {
		return false, "", validationError
	}

	// Возвращаем валидированный JSON
	validatedJSON, err := json.Marshal(component)
	if err != nil {
		return false, "", fmt.Errorf("error marshaling validated component: %v", err)
	}

	return true, string(validatedJSON), nil
}
func validateTextComponent(comp TextComponent) error {
	if strings.TrimSpace(comp.ID) == "" {
		return fmt.Errorf("text component ID is required")
	}
	if strings.TrimSpace(comp.Content) == "" {
		return fmt.Errorf("text content is required")
	}
	if comp.Style != nil {
		if comp.Style.FontSize != 0 && (comp.Style.FontSize < 8 || comp.Style.FontSize > 72) {
			return fmt.Errorf("font_size must be between 8 and 72")
		}
		if comp.Style.BorderRadius != 0 && (comp.Style.BorderRadius < 0 || comp.Style.BorderRadius > 50) {
			return fmt.Errorf("border_radius must be between 0 and 50")
		}
	}
	return nil
}

func validateButtonComponent(comp ButtonComponent) error {
	if strings.TrimSpace(comp.ID) == "" {
		return fmt.Errorf("button component ID is required")
	}
	if strings.TrimSpace(comp.Text) == "" {
		return fmt.Errorf("button text is required")
	}
	if strings.TrimSpace(comp.Action.Type) == "" {
		return fmt.Errorf("button action type is required")
	}
	if comp.Style != nil {
		if !isHexColor(comp.Style.BackgroundColor) {
			return fmt.Errorf("invalid background color format")
		}
		if !isHexColor(comp.Style.TextColor) {
			return fmt.Errorf("invalid text color format")
		}
	}
	return nil
}

func validateCartItemComponent(comp CartItemComponent) error {
	if comp.Layout != "compact" && comp.Layout != "detailed" {
		return fmt.Errorf("cart item layout must be 'compact' or 'detailed'")
	}
	if strings.TrimSpace(comp.DataBindings.Title) == "" {
		return fmt.Errorf("cart item title binding is required")
	}
	return nil
}

func validatePromoBanner(banner PromoBanner) error {
	if len(banner.Conditions) == 0 {
		return fmt.Errorf("promo banner must have at least one condition")
	}
	if strings.TrimSpace(banner.Content.Title) == "" {
		return fmt.Errorf("promo banner title is required")
	}
	if !isHexColor(banner.Style.BackgroundColor) {
		return fmt.Errorf("invalid background color format")
	}
	if !isHexColor(banner.Style.TextColor) {
		return fmt.Errorf("invalid text color format")
	}
	return nil
}

func validateStoreGroupComponent(comp StoreGroupComponent) error {
	if comp.Config.HeaderStyle != "compact" && comp.Config.HeaderStyle != "expanded" {
		return fmt.Errorf("store group header style must be 'compact' or 'expanded'")
	}
	return nil
}

func validateCartSummaryComponent(comp CartSummaryComponent) error {
	if comp.Config.Layout != "compact" && comp.Config.Layout != "detailed" {
		return fmt.Errorf("cart summary layout must be 'compact' or 'detailed'")
	}
	return nil
}

func validateButtonStyle(style ButtonStyle) error {
	if !isHexColor(style.BackgroundColor) {
		return fmt.Errorf("invalid background color format")
	}
	if !isHexColor(style.TextColor) {
		return fmt.Errorf("invalid text color format")
	}
	if style.BorderRadius < 0 || style.BorderRadius > 50 {
		return fmt.Errorf("border_radius must be between 0 and 50")
	}
	if style.FontSize < 8 || style.FontSize > 72 {
		return fmt.Errorf("font_size must be between 8 and 72")
	}
	return nil
}

func isHexColor(color string) bool {
	if color == "" {
		return false
	}
	if color[0] == '#' {
		color = color[1:]
	}
	if len(color) != 6 && len(color) != 3 && len(color) != 8 {
		return false
	}
	for _, c := range color {
		if !((c >= '0' && c <= '9') || (c >= 'a' && c <= 'f') || (c >= 'A' && c <= 'F')) {
			return false
		}
	}
	return true
}
