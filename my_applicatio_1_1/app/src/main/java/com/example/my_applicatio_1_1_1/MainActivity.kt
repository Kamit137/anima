package com.example.my_applicatio_1_1_1

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.slideInVertically
import androidx.compose.animation.slideOutVertically
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.wrapContentSize
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CenterAlignedTopAppBar
import androidx.compose.material3.Checkbox
import androidx.compose.material3.CheckboxDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.IconButton
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.snapshots.SnapshotStateList
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.ColorFilter
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.Font
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavHostController
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.example.my_applicatio_1_1_1.ui.theme.My_Applicatio_1_1_1Theme
import com.google.firebase.Firebase
import com.google.firebase.analytics.FirebaseAnalytics
import com.google.firebase.analytics.analytics
import com.google.firebase.analytics.logEvent
import com.google.gson.Gson
import com.google.gson.annotations.SerializedName
import kotlinx.coroutines.delay

data class CartContainer(
    @SerializedName("globalSettings")
    val globalSettings: GlobalSettings,

    @SerializedName("styling")
    val styling: Styling,

    @SerializedName("shops")
    val shops: List<Shop>
)

data class GlobalSettings(
    @SerializedName("orientation")
    val orientation: String,

    @SerializedName("showRating")
    val showRating: Boolean,

    @SerializedName("deliveryButtonStyle")
    val deliveryButtonStyle: String
)

data class Styling(
    @SerializedName("productHighlight")
    val productHighlight: ProductHighlight,

    @SerializedName("shopHighlight")
    val shopHighlight: ShopHighlight
)

data class ProductHighlight(
    @SerializedName("highlightBackground")
    val highlightBackground: String,

    @SerializedName("highlightPriceColor")
    val highlightPriceColor: String,

    @SerializedName("highlightBorderColor")
    val highlightBorderColor: String,

    @SerializedName("highlightBorderWidth")
    val highlightBorderWidth: String
)

data class ShopHighlight(
    @SerializedName("shopBackground")
    val shopBackground: String,

    @SerializedName("shopBorderColor")
    val shopBorderColor: String,

    @SerializedName("shopBorderWidth")
    val shopBorderWidth: String
)

data class Shop(
    @SerializedName("id")
    val id: String,

    @SerializedName("storeName")
    val storeName: String,

    @SerializedName("promo")
    val promo: Boolean,

    @SerializedName("percent")
    val percent: String,

    @SerializedName("rating")
    val rating: String,

    @SerializedName("background")
    val background: String,

    @SerializedName("reviewsCount")
    val reviewsCount: String,

    @SerializedName("enableShopHighlight")
    val enableShopHighlight: Boolean,

    @SerializedName("enableDeliveryButton")
    val enableDeliveryButton: Boolean,

    @SerializedName("products")
    val products: List<CartProduct>
)

data class CartProduct(
    @SerializedName("id")
    val id: String,

    @SerializedName("image")
    val image: String,

    @SerializedName("cost")
    val cost: String,

    @SerializedName("title")
    val title: String,

    @SerializedName("enableHighlight")
    val enableHighlight: Boolean
)

// JSON Data Classes for Checkout
data class CheckoutContainer(
    @SerializedName("recipient")
    val recipient: Recipient,

    @SerializedName("banks")
    val banks: List<Bank>
)

data class Recipient(
    @SerializedName("fullName")
    val fullName: String,

    @SerializedName("phone")
    val phone: String,

    @SerializedName("email")
    val email: String
)

data class Bank(
    @SerializedName("label")
    val label: String,

    @SerializedName("name")
    val name: String,

    @SerializedName("description")
    val description: String,

    @SerializedName("discountIsVisible")
    val discountIsVisible: Boolean,

    @SerializedName("discount")
    val discount: String
)

// JSON Helper Class
class JsonHelper {
    private val gson = Gson()

    fun createCartJson(storesWithProducts: List<Pair<Store, SnapshotStateList<Product>>>): String {
        val cartContainer = CartContainer(
            globalSettings = GlobalSettings(
                orientation = "horizontal",
                showRating = true,
                deliveryButtonStyle = "secondary"
            ),
            styling = Styling(
                productHighlight = ProductHighlight(
                    highlightBackground = "#FFFFFF",
                    highlightPriceColor = "#000000",
                    highlightBorderColor = "#965EEB",
                    highlightBorderWidth = "2"
                ),
                shopHighlight = ShopHighlight(
                    shopBackground = "#F5F5F5",
                    shopBorderColor = "#E0E0E0",
                    shopBorderWidth = "1"
                )
            ),
            shops = storesWithProducts.map { (store, products) ->
                Shop(
                    id = store.id,
                    storeName = store.name,
                    promo = store.hasDiscount,
                    percent = if (store.hasDiscount) "5%" else "0%",
                    rating = store.rating.toString(),
                    background = if (products.size == 1) "#FFFFFF" else "#F5F5F5",
                    reviewsCount = store.reviewCount.toString(),
                    enableShopHighlight = products.size > 1,
                    enableDeliveryButton = true,
                    products = products.map { product ->
                        CartProduct(
                            id = product.id,
                            image = product.imagePath.toString(),
                            cost = formatPrice(product.price),
                            title = product.description,
                            enableHighlight = product.isSelected
                        )
                    }
                )
            }
        )
        return gson.toJson(cartContainer)
    }

    fun createCheckoutJson(
        recipientName: String,
        recipientPhone: String,
        recipientEmail: String
    ): String {
        val checkoutContainer = CheckoutContainer(
            recipient = Recipient(
                fullName = recipientName,
                phone = recipientPhone,
                email = recipientEmail
            ),
            banks = listOf(
                Bank(
                    label = "avito",
                    name = "Кошелёк",
                    description = "Быстро пополнить через СБП",
                    discountIsVisible = true,
                    discount = "−100 ₽"
                ),
                Bank(
                    label = "tbank",
                    name = "Т-Банк",
                    description = "Мгновенно через СБП",
                    discountIsVisible = false,
                    discount = ""
                ),
                Bank(
                    label = "sbp",
                    name = "СБП",
                    description = "Оплата в приложении вашего банка",
                    discountIsVisible = false,
                    discount = ""
                )
            )
        )
        return gson.toJson(checkoutContainer)
    }

    fun parseCartJson(json: String): CartContainer {
        return gson.fromJson(json, CartContainer::class.java)
    }

    fun parseCheckoutJson(json: String): CheckoutContainer {
        return gson.fromJson(json, CheckoutContainer::class.java)
    }
}

// Analytics Helper Class
class AnalyticsHelper(private val firebaseAnalytics: FirebaseAnalytics) {

    fun trackScreenView(screenName: String) {
        firebaseAnalytics.logEvent(FirebaseAnalytics.Event.SCREEN_VIEW) {
            param(FirebaseAnalytics.Param.SCREEN_NAME, screenName)
            param(FirebaseAnalytics.Param.SCREEN_CLASS, "MainActivity")
        }
    }

    fun trackButtonClick(buttonName: String, screenName: String) {
        firebaseAnalytics.logEvent("button_click") {
            param("button_name", buttonName)
            param("screen_name", screenName)
            param("timestamp", System.currentTimeMillis())
        }
    }

    fun trackScreenTime(screenName: String, timeSpentMs: Long) {
        firebaseAnalytics.logEvent("screen_time") {
            param("screen_name", screenName)
            param("time_spent_ms", timeSpentMs)
            param("time_spent_sec", timeSpentMs / 1000)
        }
    }

    fun trackCartAction(action: String, productCount: Int, totalPrice: Int) {
        firebaseAnalytics.logEvent("cart_action") {
            param("action", action)
            param("product_count", productCount.toLong())
            param("total_price", totalPrice.toLong())
        }
    }
}

// Original Data Classes
data class Product(
    val id: String,
    val name: String,
    val price: Int,
    var quantity: Int,
    var isSelected: Boolean,
    val imagePath: Int,
    val description: String
)

data class Store(
    val id: String,
    val name: String,
    val rating: Double,
    val reviewCount: Int,
    val hasDiscount: Boolean = false,
    val deliveryDivider: Double
)

data class ScrollProduct(
    val imagePath: Int,
    val price: Double,
    val description: String
)

data class DeliveryOptionData(
    val label: String,
    val company: String,
    val days: String,
    val hasDiscount: Boolean = false,
    val factor: Double = 1.0
)

fun formatPrice(price: Int): String {
    val str = price.toString()
    val formatted = str.reversed().chunked(3).joinToString(" ").reversed()
    return "$formatted ₽"
}

private fun calculateTotalPrice(storesWithProducts: List<Pair<Store, SnapshotStateList<Product>>>): Int {
    return storesWithProducts.sumOf { (store, prods) ->
        val sq = prods.sumOf { if (it.isSelected) it.quantity else 0 }
        val disc = sq >= 3 && store.hasDiscount
        prods.sumOf { p ->
            if (p.isSelected) {
                val orig = p.price * p.quantity
                if (disc) (orig * 0.95).toInt() else orig
            } else 0
        }
    }
}

class MainActivity : ComponentActivity() {
    private lateinit var analytics: FirebaseAnalytics
    private lateinit var analyticsHelper: AnalyticsHelper

    @OptIn(ExperimentalMaterial3Api::class)
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        analytics = Firebase.analytics
        analyticsHelper = AnalyticsHelper(analytics)

        enableEdgeToEdge()
        setContent {
            My_Applicatio_1_1_1Theme {
                val products1 = remember {
                    mutableStateListOf(
                        Product(
                            id = "1",
                            name = "Зарядка MagSafe",
                            price = 4999,
                            quantity = 1,
                            isSelected = false,
                            imagePath = R.drawable.charging_1,
                            description = "Зарядка MagSafe Charger 15W 1 метр"
                        ),
                        Product(
                            id = "2",
                            name = "AirPods Pro 2",
                            price = 15990,
                            quantity = 1,
                            isSelected = false,
                            imagePath = R.drawable.airpods_pro_2,
                            description = "AirPods Pro 2"
                        )
                    )
                }

                val products2 = remember {
                    mutableStateListOf(
                        Product(
                            id = "3",
                            name = "iPhone 16 Pro",
                            price = 99990,
                            quantity = 1,
                            isSelected = false,
                            imagePath = R.drawable.iphone_16_pro,
                            description = "iPhone 16 Pro, 256 ГБ"
                        )
                    )
                }

                val store1 = Store(
                    id = "1",
                    name = "Pear Store",
                    rating = 4.8,
                    reviewCount = 643,
                    hasDiscount = true,
                    deliveryDivider = 12.02
                )

                val store2 = Store(
                    id = "2",
                    name = "TECHNO ZONE",
                    rating = 5.0,
                    reviewCount = 916,
                    hasDiscount = true,
                    deliveryDivider = 23.62
                )

                val storesWithProducts = listOf(store1 to products1, store2 to products2)
                val allProductLists = listOf(products1, products2)

                val navController = rememberNavController()
                NavHost(navController = navController, startDestination = "start") {
                    composable("start") {
                        StartScreen(navController, analyticsHelper)
                    }
                    composable("cart") {
                        CartScreen(
                            navController,
                            storesWithProducts,
                            allProductLists,
                            JsonHelper(),
                            analyticsHelper
                        )
                    }
                    composable(
                        "checkout/{totalPrice}",
                        arguments = listOf(navArgument("totalPrice") { type = NavType.IntType })
                    ) { backStackEntry ->
                        val totalPrice = backStackEntry.arguments?.getInt("totalPrice") ?: 0
                        CheckoutScreen(
                            navController,
                            totalPrice,
                            storesWithProducts,
                            JsonHelper(),
                            analyticsHelper
                        )
                    }
                    composable(
                        "delivery_options/{company}",
                        arguments = listOf(navArgument("company") { type = NavType.StringType })
                    ) { backStackEntry ->
                        val company = backStackEntry.arguments?.getString("company") ?: "Авито"
                        DeliveryOptionsScreen(navController, company, analyticsHelper)
                    }
                }
            }
        }
    }
}

@Composable
fun StartScreen(navController: NavHostController, analyticsHelper: AnalyticsHelper) {
    LaunchedEffect(Unit) {
        analyticsHelper.trackScreenView("start_screen")
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.White),
        contentAlignment = Alignment.BottomCenter
    ) {
        Box(
            modifier = Modifier
                .padding(bottom = 20.dp)
                .width(400.dp - 16.dp)
                .background(Color(0xFF141414), shape = RoundedCornerShape(12.dp))
                .clickable {
                    analyticsHelper.trackButtonClick("go_to_cart", "start_screen")
                    navController.navigate("cart")
                }
                .padding(top = 11.dp, bottom = 13.dp)
        ) {
            Text(
                text = "Корзина",
                color = Color.White,
                fontSize = 15.sp,
                fontWeight = FontWeight.W500,
                fontFamily = FontFamily(Font(R.font.manrope_cut_008_medium)),
                textAlign = TextAlign.Center,
                modifier = Modifier.align(Alignment.Center)
            )
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CartScreen(
    navController: NavHostController,
    storesWithProducts: List<Pair<Store, SnapshotStateList<Product>>>,
    allProductLists: List<SnapshotStateList<Product>>,
    jsonHelper: JsonHelper,
    analyticsHelper: AnalyticsHelper
) {
    val loading = remember { mutableStateOf(true) }
    val screenStartTime = remember { mutableStateOf<Long?>(null) }

    LaunchedEffect(Unit) {
        screenStartTime.value = System.currentTimeMillis()
        analyticsHelper.trackScreenView("cart_screen")
        delay(2000)
        loading.value = false
    }

    DisposableEffect(Unit) {
        onDispose {
            screenStartTime.value?.let { startTime ->
                val timeSpent = System.currentTimeMillis() - startTime
                analyticsHelper.trackScreenTime("cart_screen", timeSpent)
            }
        }
    }

    LaunchedEffect(storesWithProducts) {
        if (!loading.value) {
            val cartJson = jsonHelper.createCartJson(storesWithProducts)
            println("Cart JSON: $cartJson")

            val totalProducts = allProductLists.sumOf { it.size }
            val totalPrice = calculateTotalPrice(storesWithProducts)
            analyticsHelper.trackCartAction("cart_loaded", totalProducts, totalPrice)
        }
    }

    if (loading.value) {
        Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            CircularProgressIndicator(
                color = Color.Black,
                strokeWidth = 4.dp
            )
        }
    } else {
        val recentlyDeleted = remember { mutableStateOf<Pair<Product, SnapshotStateList<Product>>?>(null) }

        LaunchedEffect(recentlyDeleted.value) {
            if (recentlyDeleted.value != null) {
                delay(3000)
                recentlyDeleted.value = null
            }
        }

        val totalSelectedQuantity = allProductLists.flatten().sumOf { if (it.isSelected) it.quantity else 0 }
        val totalPrice = calculateTotalPrice(storesWithProducts)

        Box(modifier = Modifier.fillMaxSize()) {
            Scaffold(
                containerColor = Color.White,
                modifier = Modifier.fillMaxSize(),
                topBar = {
                    CenterAlignedTopAppBar(
                        title = {
                            Text(
                                text = "Корзина",
                                color = Color.Black,
                                fontSize = 16.sp,
                                fontFamily = FontFamily(Font(R.font.manrope_cut_008_extrabold)),
                                fontWeight = FontWeight.W800
                            )
                        },
                        navigationIcon = {
                            IconButton(onClick = {
                                analyticsHelper.trackButtonClick("back_from_cart", "cart_screen")
                                navController.popBackStack()
                            }) {
                                Image(
                                    painter = painterResource(id = R.drawable.arrow_back_l),
                                    contentDescription = "Back",
                                    modifier = Modifier.size(24.dp)
                                )
                            }
                        },
                        colors = TopAppBarDefaults.centerAlignedTopAppBarColors(
                            containerColor = Color.White
                        )
                    )
                },
                bottomBar = {
                    BottomBar(totalSelectedQuantity, totalPrice, navController, analyticsHelper)
                }
            ) { innerPadding ->
                CartContent(
                    modifier = Modifier.padding(innerPadding),
                    storesWithProducts = storesWithProducts,
                    allProductLists = allProductLists,
                    onProductDelete = { list, productId ->
                        val product = list.first { it.id == productId }
                        list.remove(product)
                        recentlyDeleted.value = product to list

                        val remainingProducts = allProductLists.sumOf { it.size }
                        val newTotalPrice = calculateTotalPrice(storesWithProducts)
                        analyticsHelper.trackCartAction("product_deleted", remainingProducts, newTotalPrice)
                    },
                    analyticsHelper = analyticsHelper
                )
            }

            AnimatedVisibility(
                visible = recentlyDeleted.value != null,
                enter = slideInVertically(initialOffsetY = { it }),
                exit = slideOutVertically(targetOffsetY = { it }),
                modifier = Modifier
                    .align(Alignment.BottomCenter)
                    .padding(bottom = 136.dp)
            ) {
                recentlyDeleted.value?.let { (product, list) ->
                    Card(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 8.dp)
                            .shadow(
                                elevation = 24.dp,
                                shape = RoundedCornerShape(28.dp),
                                clip = false,
                                ambientColor = Color.Black.copy(alpha = 0.12f),
                                spotColor = Color.Black.copy(alpha = 0.12f)
                            )
                            .shadow(
                                elevation = 3.dp,
                                shape = RoundedCornerShape(28.dp),
                                clip = false,
                                ambientColor = Color.Black.copy(alpha = 0.05f),
                                spotColor = Color.Black.copy(alpha = 0.05f)
                            ),
                        shape = RoundedCornerShape(28.dp),
                        colors = CardDefaults.cardColors(
                            containerColor = Color(0xFF141414)
                        )
                    ) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(horizontal = 20.dp, vertical = 16.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = "Товар удалён из корзины",
                                color = Color.White,
                                fontSize = 15.sp,
                                fontWeight = FontWeight.W500,
                                fontFamily = FontFamily(Font(R.font.manrope_cut_008_medium))
                            )
                            Box(
                                modifier = Modifier
                                    .background(Color.White, RoundedCornerShape(12.dp))
                                    .clickable {
                                        list.add(product)
                                        recentlyDeleted.value = null

                                        val restoredProducts = allProductLists.sumOf { it.size }
                                        val newTotalPrice = calculateTotalPrice(storesWithProducts)
                                        analyticsHelper.trackCartAction("product_restored", restoredProducts, newTotalPrice)
                                    }
                            ) {
                                Text(
                                    text = "Вернуть",
                                    color = Color(0xFF0A0A0A),
                                    fontSize = 15.sp,
                                    fontWeight = FontWeight.W500,
                                    fontFamily = FontFamily(Font(R.font.manrope_cut_008_medium)),
                                    modifier = Modifier.padding(
                                        start = 14.dp,
                                        end = 15.dp,
                                        top = 9.dp,
                                        bottom = 11.dp
                                    )
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun BottomBar(
    totalSelectedQuantity: Int,
    totalPrice: Int,
    navController: NavHostController,
    analyticsHelper: AnalyticsHelper
) {
    Box(
        modifier = Modifier
            .height(120.dp)
            .background(
                Color.White,
                RoundedCornerShape(topStart = 28.dp, topEnd = 28.dp)
            )
    ) {
        Row(
            modifier = Modifier
                .padding(start = 16.dp, end = 16.dp, top = 16.dp, bottom = 36.dp)
                .fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.Top
        ) {
            Column(horizontalAlignment = Alignment.Start) {
                Text(
                    text = "$totalSelectedQuantity товара",
                    color = Color.Black,
                    fontSize = 11.sp,
                    fontWeight = FontWeight.W500,
                    fontFamily = FontFamily(Font(R.font.manrope_cut_008_medium))
                )
                Text(
                    text = formatPrice(totalPrice),
                    color = Color.Black,
                    fontSize = 21.sp,
                    fontWeight = FontWeight.W800,
                    fontFamily = FontFamily(Font(R.font.manrope_cut_008_extrabold))
                )
            }
            Box(
                modifier = Modifier
                    .background(Color(0xFF965EEB), RoundedCornerShape(16.dp))
                    .padding(start = 18.dp, end = 19.dp, top = 15.dp, bottom = 17.dp)
                    .clickable {
                        analyticsHelper.trackButtonClick("checkout_delivery", "cart_screen")
                        analyticsHelper.trackCartAction("checkout_started", totalSelectedQuantity, totalPrice)
                        navController.navigate("checkout/$totalPrice")
                    }
            ) {
                Text(
                    text = "Оформить доставку",
                    color = Color.White,
                    fontSize = 15.sp,
                    fontWeight = FontWeight.W500,
                    fontFamily = FontFamily(Font(R.font.manrope_cut_008_medium))
                )
            }
        }
    }
}

@Composable
fun CartContent(
    modifier: Modifier = Modifier,
    storesWithProducts: List<Pair<Store, SnapshotStateList<Product>>>,
    allProductLists: List<SnapshotStateList<Product>>,
    onProductDelete: (SnapshotStateList<Product>, String) -> Unit,
    analyticsHelper: AnalyticsHelper
) {
    val totalProductsCount = allProductLists.sumOf { it.size }

    if (totalProductsCount == 0) {
        Box(
            modifier = Modifier.fillMaxSize(),
            contentAlignment = Alignment.Center
        ) {
            Column(
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.End
                ) {
                    Box {
                        Image(
                            painter = painterResource(id = R.drawable.card_balls),
                            contentDescription = null,
                            modifier = Modifier
                                .align(Alignment.CenterStart)
                                .width(141.95.dp)
                                .height(141.95.dp)
                                .offset(x = (-20).dp, y = 30.dp)
                        )
                        Image(
                            painter = painterResource(id = R.drawable.sphere),
                            contentDescription = null,
                            modifier = Modifier
                                .align(Alignment.Center)
                                .width(46.3.dp)
                                .height(46.3.dp)
                                .offset(x = 94.dp, y = 0.dp)
                        )
                        Image(
                            painter = painterResource(id = R.drawable.illustration),
                            contentDescription = null,
                            modifier = Modifier
                                .width(318.dp)
                                .height(276.dp)
                        )
                    }
                }
                Text(
                    text = "В корзине пусто",
                    modifier = Modifier
                        .padding(start = 24.dp, end = 24.dp, top = 24.dp),
                    color = Color.Black,
                    fontSize = 26.sp,
                    fontWeight = FontWeight.W800,
                    fontFamily = FontFamily(Font(R.font.manrope_cut_008_extrabold)),
                    textAlign = TextAlign.Center
                )
                Text(
                    text = "Добавляйте сюда товары, которые\nможно купить с Авито Доставкой.",
                    modifier = Modifier
                        .padding(start = 24.dp, end = 24.dp, top = 8.dp),
                    softWrap = true,
                    color = Color.Black,
                    fontSize = 16.sp,
                    fontWeight = FontWeight.W500,
                    fontFamily = FontFamily(Font(R.font.manrope_cut_008_medium)),
                    textAlign = TextAlign.Center
                )
            }
        }
    } else {
        Column(
            modifier = modifier.verticalScroll(rememberScrollState())
        ) {
            val isAllSelected = allProductLists.flatten().all { it.isSelected }
            val totalSelectedQuantity = allProductLists.flatten().sumOf { if (it.isSelected) it.quantity else 0 }

            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(end = 16.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Checkbox(
                    checked = isAllSelected,
                    onCheckedChange = { checked ->
                        allProductLists.forEach { group ->
                            group.forEachIndexed { index, p ->
                                group[index] = p.copy(isSelected = checked)
                            }
                        }
                        analyticsHelper.trackButtonClick(
                            if (checked) "select_all" else "deselect_all",
                            "cart_screen"
                        )
                    },
                    colors = CheckboxDefaults.colors(
                        checkedColor = Color.Black,
                        checkmarkColor = Color.White,
                        uncheckedColor = Color.Black
                    )
                )
                Text(
                    text = "Выбрать всё",
                    modifier = Modifier.weight(1f),
                    color = Color.Black,
                    fontSize = 15.sp,
                    fontFamily = FontFamily(Font(R.font.manrope_cut_008_medium)),
                    fontWeight = FontWeight.W500
                )
                if (totalSelectedQuantity > 0) {
                    TextButton(
                        onClick = {
                            analyticsHelper.trackButtonClick("delete_selected", "cart_screen")
                            allProductLists.forEach { group ->
                                group.removeAll { it.isSelected }
                            }
                        }
                    ) {
                        Text(
                            "Удалить ($totalSelectedQuantity)",
                            color = Color(0, 153, 247, 255),
                            fontSize = 15.sp,
                            fontFamily = FontFamily(Font(R.font.manrope_cut_008_medium)),
                            fontWeight = FontWeight.W500
                        )
                    }
                }
            }
            Spacer(modifier = Modifier.height(16.dp))
            storesWithProducts.forEach { (store, products) ->
                if (products.isNotEmpty()) {
                    StoreSection(
                        store = store,
                        products = products,
                        scrollProducts = listOf(
                            ScrollProduct(
                                imagePath = R.drawable.apple_watch_1,
                                price = 27990.0,
                                description = "Apple Watch 10 42mm Blue"
                            ),
                            ScrollProduct(
                                imagePath = R.drawable.apple_watch_2,
                                price = 25890.0,
                                description = "Apple Watch 9 41mm Black"
                            )
                        ),
                        onStoreToggle = { checked ->
                            products.forEachIndexed { index, p ->
                                products[index] = p.copy(isSelected = checked)
                            }
                        },
                        onProductToggle = { productId, isSelected ->
                            val index = products.indexOfFirst { it.id == productId }
                            if (index != -1) {
                                products[index] = products[index].copy(isSelected = isSelected ?: false)
                            }
                        },
                        onQuantityChange = { productId, newQuantity ->
                            val index = products.indexOfFirst { it.id == productId }
                            if (index != -1) {
                                products[index] = products[index].copy(quantity = newQuantity)
                            }
                        },
                        onProductDelete = { productId ->
                            onProductDelete(products, productId)
                        },
                        analyticsHelper = analyticsHelper
                    )
                }
            }
        }
    }
}

@Composable
fun StoreSection(
    store: Store,
    products: SnapshotStateList<Product>,
    scrollProducts: List<ScrollProduct>,
    onStoreToggle: (Boolean) -> Unit,
    onProductToggle: (String, Boolean?) -> Unit,
    onQuantityChange: (String, Int) -> Unit,
    onProductDelete: (String) -> Unit,
    analyticsHelper: AnalyticsHelper
) {
    val isStoreChecked = products.all { it.isSelected }
    val totalSelectedQuantity = products.sumOf { if (it.isSelected) it.quantity else 0 }
    val discountApplies = totalSelectedQuantity >= 3
    val storeBackgroundColor = if (products.size == 1) Color.White else Color(0xFFF5F5F5)
    val quantityBgColor = if (products.size == 1) Color(0xFFF5F5F5) else Color.White

    Column {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(end = 16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Checkbox(
                checked = isStoreChecked,
                onCheckedChange = { checked ->
                    onStoreToggle(checked)
                    analyticsHelper.trackButtonClick(
                        if (checked) "select_store_${store.name}" else "deselect_store_${store.name}",
                        "cart_screen"
                    )
                },
                colors = CheckboxDefaults.colors(
                    checkedColor = Color.Black,
                    checkmarkColor = Color.White,
                    uncheckedColor = Color.Black
                )
            )
            Text(
                store.name,
                color = Color.Black,
                fontSize = 21.sp,
                fontFamily = FontFamily(Font(R.font.manrope_cut_008_extrabold)),
                fontWeight = FontWeight.W800
            )
            Spacer(modifier = Modifier.width(5.dp))
            Image(
                painter = painterResource(id = R.drawable.star_1),
                contentDescription = "Store rating",
                modifier = Modifier.size(16.dp)
            )
            Spacer(modifier = Modifier.width(5.dp))
            Text(
                "${store.rating.toString().replace('.', ',')}",
                color = Color.Black,
                fontSize = 15.sp,
                fontFamily = FontFamily(Font(R.font.manrope_cut_008_medium)),
                fontWeight = FontWeight.W500
            )
            Spacer(modifier = Modifier.width(2.dp))
            Text(
                "(${store.reviewCount})",
                color = Color(163, 163, 163, 255),
                fontSize = 15.sp,
                fontFamily = FontFamily(Font(R.font.manrope_cut_008_medium)),
                fontWeight = FontWeight.W500
            )
        }
        Spacer(modifier = Modifier.height(16.dp))
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .background(
                    color = storeBackgroundColor,
                    shape = RoundedCornerShape(24.dp)
                )
        ) {
            products.forEach { product ->
                ProductInCart(
                    product = product,
                    store = store,
                    discountApplies = discountApplies,
                    quantityBgColor = quantityBgColor,
                    onToggle = { isSelected ->
                        onProductToggle(product.id, isSelected)
                        analyticsHelper.trackButtonClick(
                            if (isSelected == true) "select_product_${product.id}" else "deselect_product_${product.id}",
                            "cart_screen"
                        )
                    },
                    onQuantityChange = { newQuantity ->
                        onQuantityChange(product.id, newQuantity)
                        analyticsHelper.trackCartAction("quantity_changed", newQuantity, product.price * newQuantity)
                    },
                    onDelete = {
                        onProductDelete(product.id)
                    },
                    analyticsHelper = analyticsHelper
                )
            }
            if (totalSelectedQuantity == 2) {
                Spacer(modifier = Modifier.height(20.dp))
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(start = 16.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Image(
                        painter = painterResource(id = R.drawable.arrow_1_1),
                        contentDescription = "",
                        modifier = Modifier.size(24.dp)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        "Добавьте ещё 1 товар до скидки 5%",
                        color = Color.Black,
                        fontSize = 14.sp,
                        fontFamily = FontFamily(Font(R.font.manrope_cut_008_extrabold)),
                        fontWeight = FontWeight.W800
                    )
                    Image(
                        painter = painterResource(id = R.drawable.arrow_1_2),
                        contentDescription = "",
                        modifier = Modifier.size(16.dp)
                    )
                }
                Spacer(modifier = Modifier.height(16.dp))
                val scrollState = rememberScrollState()
                Row(
                    modifier = Modifier
                        .horizontalScroll(scrollState)
                        .fillMaxWidth()
                        .padding(bottom = 16.dp)
                ) {
                    Spacer(modifier = Modifier.width(46.dp))
                    scrollProducts.forEachIndexed { index, scrollProduct ->
                        ScrollProductItem(
                            imagePath = scrollProduct.imagePath,
                            price = scrollProduct.price,
                            productDescription = scrollProduct.description,
                            analyticsHelper = analyticsHelper
                        )
                        if (index < scrollProducts.size - 1) {
                            Spacer(modifier = Modifier.width(16.dp))
                        }
                    }
                    Spacer(modifier = Modifier.width(46.dp))
                }
            }
        }
    }
}

@Composable
fun ProductInCart(
    product: Product,
    store: Store,
    discountApplies: Boolean,
    quantityBgColor: Color,
    onToggle: (Boolean?) -> Unit,
    onQuantityChange: (Int) -> Unit,
    onDelete: () -> Unit,
    analyticsHelper: AnalyticsHelper
) {
    val originalPrice = product.price * product.quantity
    val discountMultiplier = if (store.hasDiscount && discountApplies && product.isSelected) 0.95 else 1.0
    val finalPrice = (originalPrice * discountMultiplier).toInt()
    val formattedFinal = formatPrice(finalPrice)
    val formattedOriginal = formatPrice(originalPrice)
    val density = LocalDensity.current
    val heightInDp = with(density) { 15.sp.toDp() + 4.dp }

    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(end = 16.dp),
        verticalAlignment = Alignment.Top
    ) {
        Checkbox(
            checked = product.isSelected,
            onCheckedChange = onToggle,
            modifier = Modifier.padding(top = 16.dp),
            colors = CheckboxDefaults.colors(
                checkedColor = Color.Black,
                checkmarkColor = Color.White,
                uncheckedColor = Color.Black
            )
        )
        Spacer(modifier = Modifier.width(12.dp))
        Column(
            modifier = Modifier.padding(top = 24.dp),
            verticalArrangement = Arrangement.Top
        ) {
            Box(
                modifier = Modifier
                    .size(96.dp)
                    .clip(RoundedCornerShape(12.dp))
                    .background(Color.LightGray)
            ) {
                Image(
                    painter = painterResource(id = product.imagePath),
                    contentDescription = product.name,
                    modifier = Modifier
                        .size(96.dp)
                        .clip(RoundedCornerShape(12.dp)),
                    contentScale = ContentScale.Crop
                )
            }
        }
        Spacer(modifier = Modifier.width(12.dp))
        Column(
            modifier = Modifier
                .weight(1f)
                .padding(top = 24.dp, end = 12.dp),
            verticalArrangement = Arrangement.Top
        ) {
            Text(
                text = formattedFinal,
                color = Color.Black,
                fontSize = 18.sp,
                fontFamily = FontFamily(Font(R.font.manrope_cut_008_extrabold)),
                fontWeight = FontWeight.W800
            )
            if (store.hasDiscount && discountApplies && product.isSelected) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box {
                        Text(
                            text = formattedOriginal,
                            color = Color.Black,
                            fontSize = 15.sp,
                            fontFamily = FontFamily(Font(R.font.manrope_cut_008_medium)),
                            fontWeight = FontWeight.W500
                        )
                        Image(
                            painter = painterResource(id = R.drawable.vector_for_discount),
                            contentDescription = null,
                            modifier = Modifier
                                .width((7.625 * (formattedOriginal.length)).dp)
                                .height(heightInDp)
                                .align(Alignment.Center)
                        )
                    }
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        text = "−5%",
                        color = Color(255, 64, 83, 255),
                        fontSize = 15.sp,
                        fontFamily = FontFamily(Font(R.font.manrope_cut_008_medium)),
                        fontWeight = FontWeight.W500
                    )
                }
            }
            Spacer(modifier = Modifier.height(2.dp))
            Text(
                text = product.description,
                color = Color.Black,
                fontSize = 13.sp,
                fontFamily = FontFamily(Font(R.font.manrope_cut_008_medium)),
                fontWeight = FontWeight.W500,
                softWrap = true
            )
            Spacer(modifier = Modifier.height(10.dp))
            Box(
                modifier = Modifier
                    .background(
                        color = quantityBgColor,
                        shape = RoundedCornerShape(12.dp)
                    )
                    .padding(top = 11.dp, bottom = 13.dp, start = 14.dp, end = 14.dp)
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.Center
                ) {
                    IconButton(
                        onClick = {
                            if (product.quantity > 1) {
                                onQuantityChange(product.quantity - 1)
                            }
                        },
                        modifier = Modifier.size(24.dp)
                    ) {
                        Image(
                            painter = painterResource(id = R.drawable.icon_l),
                            contentDescription = "Уменьшить",
                            modifier = Modifier
                                .size(20.dp)
                                .clip(RoundedCornerShape(4.dp))
                        )
                    }
                    Spacer(modifier = Modifier.width(24.5.dp))
                    Text(
                        text = "${product.quantity}",
                        color = Color.Black,
                        fontSize = 15.sp,
                        fontFamily = FontFamily(Font(R.font.manrope_cut_008_medium)),
                        fontWeight = FontWeight.W500
                    )
                    Spacer(modifier = Modifier.width(24.5.dp))
                    IconButton(
                        onClick = { onQuantityChange(product.quantity + 1) },
                        modifier = Modifier.size(24.dp)
                    ) {
                        Image(
                            painter = painterResource(id = R.drawable.icon_r),
                            contentDescription = "Увеличить",
                            modifier = Modifier
                                .size(20.dp)
                                .clip(RoundedCornerShape(4.dp))
                        )
                    }
                }
            }
            Spacer(modifier = Modifier.height(10.dp))
            TextButton(
                onClick = {
                    analyticsHelper.trackButtonClick("buy_with_delivery_${product.id}", "cart_screen")
                },
                modifier = Modifier.padding(0.dp)
            ) {
                Text(
                    text = "Купить с доставкой",
                    color = Color(161, 104, 247, 255),
                    fontSize = 13.sp,
                    fontFamily = FontFamily(Font(R.font.manrope_cut_008_medium)),
                    fontWeight = FontWeight.W500
                )
            }
        }
        Column(
            modifier = Modifier.padding(top = 24.dp, end = 16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            IconButton(
                onClick = {
                    analyticsHelper.trackButtonClick("add_to_favorites_${product.id}", "cart_screen")
                },
                modifier = Modifier.size(24.dp)
            ) {
                Image(
                    painter = painterResource(id = R.drawable.favorites),
                    contentDescription = "Избранное",
                    modifier = Modifier
                        .size(20.dp)
                        .clip(RoundedCornerShape(4.dp))
                )
            }
            IconButton(
                onClick = {
                    analyticsHelper.trackButtonClick("delete_product_${product.id}", "cart_screen")
                    onDelete()
                },
                modifier = Modifier.size(24.dp)
            ) {
                Image(
                    painter = painterResource(id = R.drawable.delete),
                    contentDescription = "Удалить",
                    modifier = Modifier
                        .size(20.dp)
                        .clip(RoundedCornerShape(4.dp))
                )
            }
        }
    }
}

@Composable
fun ScrollProductItem(
    imagePath: Int,
    price: Double,
    productDescription: String,
    analyticsHelper: AnalyticsHelper
) {
    val formattedPrice = "%,d".format(price.toInt()).replace(',', ' ') + " ₽"
    val formattedPriceWithDiscount = "%,d".format((price * 0.95).toInt()).replace(',', ' ') + " ₽"
    val density = LocalDensity.current
    val heightInDp = with(density) { 15.sp.toDp() + 4.dp }

    Row(
        verticalAlignment = Alignment.Top
    ) {
        Box(
            modifier = Modifier
                .size(96.dp)
                .clip(RoundedCornerShape(12.dp))
                .background(Color.LightGray)
        ) {
            Image(
                painter = painterResource(id = imagePath),
                contentDescription = productDescription,
                modifier = Modifier
                    .size(96.dp)
                    .clip(RoundedCornerShape(12.dp)),
                contentScale = ContentScale.Crop
            )
        }
        Spacer(modifier = Modifier.width(12.dp))
        Column(
            verticalArrangement = Arrangement.Top,
            horizontalAlignment = Alignment.Start
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = formattedPriceWithDiscount,
                    color = Color.Black,
                    fontSize = 16.sp,
                    fontFamily = FontFamily(Font(R.font.manrope_cut_008_extrabold)),
                    fontWeight = FontWeight.W800
                )
                Spacer(modifier = Modifier.width(6.dp))
                Box {
                    Text(
                        text = formattedPrice,
                        color = Color(117, 117, 117, 255),
                        fontSize = 15.sp,
                        fontFamily = FontFamily(Font(R.font.manrope_cut_008_medium)),
                        fontWeight = FontWeight.W500
                    )
                    Image(
                        painter = painterResource(id = R.drawable.vector_for_discount_2),
                        contentDescription = null,
                        modifier = Modifier
                            .width((8.155 * (formattedPrice.length)).dp)
                            .height(heightInDp)
                            .align(Alignment.Center)
                    )
                }
            }
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = productDescription,
                color = Color.Black,
                fontSize = 11.sp,
                fontFamily = FontFamily(Font(R.font.manrope_cut_008_medium)),
                fontWeight = FontWeight.W500,
                softWrap = true,
                maxLines = 2
            )
            Spacer(modifier = Modifier.height(12.dp))
            Box(
                modifier = Modifier
                    .background(
                        color = Color.White,
                        shape = RoundedCornerShape(10.dp)
                    )
                    .padding(
                        top = 6.dp,
                        bottom = 8.dp,
                        start = 11.dp,
                        end = 12.dp
                    )
                    .clickable {
                        analyticsHelper.trackButtonClick("add_scroll_product_to_cart", "cart_screen")
                    }
            ) {
                Text(
                    text = "В корзину",
                    color = Color.Black,
                    fontSize = 13.sp,
                    fontFamily = FontFamily(Font(R.font.manrope_cut_008_medium)),
                    fontWeight = FontWeight.W500
                )
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CheckoutScreen(
    navController: NavHostController,
    totalPrice: Int,
    storesWithProducts: List<Pair<Store, SnapshotStateList<Product>>>,
    jsonHelper: JsonHelper,
    analyticsHelper: AnalyticsHelper
) {
    val loading = remember { mutableStateOf(true) }
    val screenStartTime = remember { mutableStateOf<Long?>(null) }

    LaunchedEffect(Unit) {
        screenStartTime.value = System.currentTimeMillis()
        analyticsHelper.trackScreenView("checkout_screen")
        delay(2000)
        loading.value = false

        val totalProducts = storesWithProducts.sumOf { (_, products) ->
            products.count { it.isSelected }
        }
        analyticsHelper.trackCartAction("checkout_entered", totalProducts, totalPrice)
    }

    DisposableEffect(Unit) {
        onDispose {
            screenStartTime.value?.let { startTime ->
                val timeSpent = System.currentTimeMillis() - startTime
                analyticsHelper.trackScreenTime("checkout_screen", timeSpent)
            }
        }
    }

    val deliveries = listOf(
        DeliveryOptionData("Сюда доставляли", "Почта России", "1–4 дня", hasDiscount = false, factor = 1.0),
        DeliveryOptionData("Лучшая цена", "Авито", "1–4 дня", hasDiscount = true, factor = 1.0),
        DeliveryOptionData("Сюда доставляли", "СДЭК", "1–4 дня", hasDiscount = false, factor = 1.1),
        DeliveryOptionData("Сюда доставляли", "Яндекс Доставка", "1–2 дня", hasDiscount = false, factor = 1.12)
    )

    val selectedIndex = remember { mutableStateOf(0) }
    val selectedDelivery = deliveries[selectedIndex.value]

    val baseStoreDeliveryPrices = storesWithProducts.associate { (store, products) ->
        val storeTotalPrice = products.filter { it.isSelected }.sumOf { it.price * it.quantity }
        val baseDeliveryPrice = (storeTotalPrice / store.deliveryDivider).toInt()
        store to baseDeliveryPrice
    }

    val baseTotalDeliveryPrice = baseStoreDeliveryPrices.values.sum()

    val selectedOptionTotal = (baseTotalDeliveryPrice * selectedDelivery.factor).toInt()
    val totalDiscountedDeliveryPrice = if (selectedDelivery.hasDiscount) (selectedOptionTotal * 0.25).toInt() else selectedOptionTotal

    val selectedPayment = remember { mutableStateOf(0) }
    val effectiveDeliveryPrice = if (selectedPayment.value == 0) totalDiscountedDeliveryPrice - 100 else totalDiscountedDeliveryPrice
    val totalPriceWithDelivery = totalPrice + effectiveDeliveryPrice.coerceAtLeast(0)

    val storeDeliveryPrices = baseStoreDeliveryPrices.mapValues { (_, basePrice) ->
        val optionPrice = (basePrice * selectedDelivery.factor).toInt()
        val discountedPrice = if (selectedDelivery.hasDiscount) (optionPrice * 0.25).toInt() else optionPrice
        optionPrice to discountedPrice
    }

    val sheetState = rememberModalBottomSheetState()
    val showBottomSheet = remember { mutableStateOf(false) }
    val recipientName = remember { mutableStateOf("Князева Екатерина ") }
    val recipientPhone = remember { mutableStateOf("+78005553535") }
    val recipientEmail = remember { mutableStateOf("catherineu@gmail.com") }

    LaunchedEffect(selectedIndex.value) {
        if (!loading.value) {
            val selectedDeliveryOption = deliveries[selectedIndex.value]
            analyticsHelper.trackButtonClick("delivery_option_${selectedDeliveryOption.company}", "checkout_screen")
        }
    }

    LaunchedEffect(selectedPayment.value) {
        if (!loading.value) {
            val paymentMethods = listOf("avito_wallet", "tbank", "sbp")
            val selectedMethod = paymentMethods[selectedPayment.value]
            analyticsHelper.trackButtonClick("payment_method_$selectedMethod", "checkout_screen")
        }
    }

    LaunchedEffect(recipientName.value, recipientPhone.value, recipientEmail.value) {
        if (!loading.value) {
            val checkoutJson = jsonHelper.createCheckoutJson(
                recipientName.value,
                recipientPhone.value,
                recipientEmail.value
            )
            println("Checkout JSON: $checkoutJson")
        }
    }

    Scaffold(
        containerColor = Color.White,
        modifier = Modifier.fillMaxSize(),
        topBar = {
            CenterAlignedTopAppBar(
                title = {
                    if (!loading.value) {
                        Text(
                            text = "Оформление доставки",
                            color = Color.Black,
                            fontSize = 16.sp,
                            fontFamily = FontFamily(Font(R.font.manrope_cut_008_extrabold)),
                            fontWeight = FontWeight.W800
                        )
                    }
                },
                navigationIcon = {
                    IconButton(onClick = {
                        analyticsHelper.trackButtonClick("back_from_checkout", "checkout_screen")
                        navController.popBackStack()
                    }) {
                        Image(
                            painter = painterResource(id = if (loading.value) R.drawable.arrow_back_l else R.drawable.close_button),
                            contentDescription = if (loading.value) "Back" else "Close",
                            modifier = Modifier.size(24.dp)
                        )
                    }
                },
                colors = TopAppBarDefaults.centerAlignedTopAppBarColors(
                    containerColor = Color.White
                )
            )
        },
        bottomBar = {
            if (!loading.value) {
                Surface(
                    tonalElevation = 0.dp,
                    shadowElevation = 0.dp,
                    color = Color.Transparent,
                    modifier = Modifier
                        .background(Color.Transparent)
                ) {
                    Box(
                        modifier = Modifier
                            .background(
                                Color.White,
                                RoundedCornerShape(topStart = 28.dp, topEnd = 28.dp)
                            )
                    ) {
                        Column(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(start = 16.dp, end = 16.dp, top = 20.dp, bottom = 29.dp)
                        ) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                Text(
                                    text = "Итого с доставкой:",
                                    color = Color.Black,
                                    fontSize = 15.sp,
                                    fontWeight = FontWeight.W500,
                                    fontFamily = FontFamily(Font(R.font.manrope_cut_008_medium))
                                )
                                Text(
                                    text = formatPrice(totalPriceWithDelivery),
                                    color = Color.Black,
                                    fontSize = 21.sp,
                                    fontWeight = FontWeight.W800,
                                    fontFamily = FontFamily(Font(R.font.manrope_cut_008_extrabold))
                                )
                            }
                            Spacer(modifier = Modifier.height(12.dp))
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Box(
                                    modifier = Modifier
                                        .size(52.dp)
                                        .background(Color(0xFFF2F1F0), RoundedCornerShape(12.dp))
                                        .padding(10.4.dp)
                                ) {
                                    Image(
                                        painter = painterResource(id = R.drawable.avito),
                                        contentDescription = null,
                                        modifier = Modifier.size(31.2.dp)
                                    )
                                }
                                Spacer(modifier = Modifier.width(6.dp))
                                Box(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .background(Color(0xFF141414), RoundedCornerShape(16.dp))
                                        .clickable {
                                            analyticsHelper.trackButtonClick("go_to_payment", "checkout_screen")
                                            analyticsHelper.trackCartAction("payment_started",
                                                storesWithProducts.sumOf { (_, products) ->
                                                    products.count { it.isSelected }
                                                },
                                                totalPriceWithDelivery
                                            )
                                        }
                                        .padding(top = 15.dp, bottom = 17.dp)
                                ) {
                                    Text(
                                        text = "Перейти к оплате",
                                        color = Color.White,
                                        fontSize = 15.sp,
                                        fontWeight = FontWeight.W500,
                                        fontFamily = FontFamily(Font(R.font.manrope_cut_008_medium)),
                                        modifier = Modifier.align(Alignment.Center)
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }
    ) { innerPadding ->
        if (loading.value) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(innerPadding),
                contentAlignment = Alignment.Center
            ) {
                CircularProgressIndicator(
                    color = Color.Black,
                    strokeWidth = 4.dp
                )
            }
        } else {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(innerPadding)
                    .verticalScroll(rememberScrollState())
            ) {
                Text(
                    text = "Способ получения",
                    color = Color.Black,
                    fontSize = 21.sp,
                    fontFamily = FontFamily(Font(R.font.manrope_cut_008_extrabold)),
                    fontWeight = FontWeight.W800,
                    modifier = Modifier.padding(horizontal = 16.dp)
                )
                Row(
                    modifier = Modifier.padding(start = 16.dp, end = 16.dp, top = 4.dp, bottom = 12.dp)
                ) {
                    Text(
                        text = "Для адреса:",
                        color = Color.Black,
                        fontSize = 15.sp,
                        fontFamily = FontFamily(Font(R.font.manrope_cut_008_medium)),
                        fontWeight = FontWeight.W500
                    )
                    Image(
                        painter = painterResource(id = R.drawable.navigator),
                        contentDescription = null,
                        modifier = Modifier.padding(horizontal = 4.dp)
                            .height(20.dp)
                            .width(12.dp)
                    )
                    Text(
                        text = "Москва, ул. Лесная, 7",
                        color = Color.Black,
                        fontSize = 15.sp,
                        fontFamily = FontFamily(Font(R.font.manrope_cut_008_medium)),
                        fontWeight = FontWeight.W500
                    )
                    Image(
                        painter = painterResource(id = R.drawable.expand_more),
                        contentDescription = null,
                        modifier = Modifier.padding(start = 4.dp)
                            .height(20.dp)
                            .width(10.dp)
                    )
                }
                DeliveryOptionsScroll(
                    baseTotalDeliveryPrice = baseTotalDeliveryPrice,
                    deliveries = deliveries,
                    selectedIndex = selectedIndex,
                    analyticsHelper = analyticsHelper
                )
                Spacer(modifier = Modifier.height(16.dp))
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(Color(0xFFF2F1F0))
                ) {
                    Column(
                        modifier = Modifier.padding(top = 16.dp)
                    ) {
                        storesWithProducts.forEach { (store, products) ->
                            val selectedProducts = products.filter { it.isSelected }
                            if (selectedProducts.isNotEmpty()) {
                                val (optionPrice, discountedPrice) = storeDeliveryPrices[store] ?: (0 to 0)
                                StoreDeliveryInfo(
                                    storeName = store.name,
                                    selectedProducts = selectedProducts,
                                    selectedDelivery = selectedDelivery,
                                    originalDeliveryPrice = optionPrice,
                                    discountedDeliveryPrice = discountedPrice,
                                    totalPrice = totalPrice,
                                    navController = navController,
                                    analyticsHelper = analyticsHelper
                                )
                            }
                        }
                    }
                }
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(Color.White)
                        .padding(start = 16.dp, end = 16.dp, top = 20.dp, bottom = 20.dp)
                ) {
                    Column {
                        Text(
                            text = "Получатель",
                            color = Color.Black,
                            fontSize = 21.sp,
                            fontFamily = FontFamily(Font(R.font.manrope_cut_008_extrabold)),
                            fontWeight = FontWeight.W800
                        )
                        Spacer(modifier = Modifier.height(12.dp))
                        Row {
                            Text(
                                text = recipientName.value,
                                color = Color.Black,
                                fontSize = 15.sp,
                                fontFamily = FontFamily(Font(R.font.manrope_cut_008_medium)),
                                fontWeight = FontWeight.W500
                            )
                        }
                        Row {
                            Text(
                                text = recipientPhone.value,
                                color = Color.Black,
                                fontSize = 15.sp,
                                fontFamily = FontFamily(Font(R.font.manrope_cut_008_medium)),
                                fontWeight = FontWeight.W500
                            )
                            Text(
                                text = "·",
                                color = Color(117, 117, 117, 255),
                                fontSize = 15.sp,
                                modifier = Modifier.padding(horizontal = 4.dp)
                            )
                            Text(
                                text = recipientEmail.value,
                                color = Color.Black,
                                fontSize = 15.sp,
                                fontFamily = FontFamily(Font(R.font.manrope_cut_008_medium)),
                                fontWeight = FontWeight.W500
                            )
                        }
                        Spacer(modifier = Modifier.height(12.dp))
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .background(Color(0xFFF2F1F0), RoundedCornerShape(12.dp))
                                .clickable {
                                    analyticsHelper.trackButtonClick("change_recipient", "checkout_screen")
                                    showBottomSheet.value = true
                                }
                                .padding(top = 11.dp, bottom = 13.dp, start = 16.dp, end = 17.dp)
                        ) {
                            Text(
                                text = "Изменить получателя",
                                color = Color.Black,
                                fontSize = 15.sp,
                                fontWeight = FontWeight.W500,
                                fontFamily = FontFamily(Font(R.font.manrope_cut_008_medium))
                            )
                        }
                    }
                }
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(Color.White)
                        .padding(start = 16.dp, end = 16.dp, top = 24.dp, bottom = 24.dp)
                ) {
                    Column {
                        Text(
                            text = "Способы оплаты",
                            color = Color.Black,
                            fontSize = 21.sp,
                            fontFamily = FontFamily(Font(R.font.manrope_cut_008_extrabold)),
                            fontWeight = FontWeight.W800
                        )
                        Spacer(modifier = Modifier.height(16.dp))
                        PaymentOption(
                            imageRes = R.drawable.avito_cont,
                            title = "Кошелёк",
                            subtitle = "Быстро пополнить через СБП",
                            discountText = "−100 ₽",
                            isSelected = selectedPayment.value == 0,
                            onClick = { selectedPayment.value = 0 },
                            subtitleColor = Color(0xFF757575),
                            analyticsHelper = analyticsHelper
                        )
                        Spacer(modifier = Modifier.height(22.dp))
                        PaymentOption(
                            imageRes = R.drawable.tbank_cont,
                            title = "Т-Банк",
                            subtitle = "Мгновенно через СБП",
                            discountText = null,
                            isSelected = selectedPayment.value == 1,
                            onClick = { selectedPayment.value = 1 },
                            subtitleColor = Color(0xFF757575),
                            analyticsHelper = analyticsHelper
                        )
                        Spacer(modifier = Modifier.height(22.dp))
                        PaymentOption(
                            imageRes = R.drawable.sbp_cont,
                            title = "СБП",
                            subtitle = "Оплата в приложении вашего банка",
                            discountText = null,
                            isSelected = selectedPayment.value == 2,
                            onClick = { selectedPayment.value = 2 },
                            subtitleColor = Color(0xFF757575),
                            analyticsHelper = analyticsHelper
                        )
                        Spacer(modifier = Modifier.height(22.dp))
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .background(Color(0xFFF2F1F0), RoundedCornerShape(12.dp))
                                .clickable {
                                    analyticsHelper.trackButtonClick("open_all_payments", "checkout_screen")
                                }
                                .padding(top = 11.dp, bottom = 13.dp)
                        ) {
                            Text(
                                text = "Открыть все",
                                color = Color.Black,
                                fontSize = 15.sp,
                                fontWeight = FontWeight.W500,
                                fontFamily = FontFamily(Font(R.font.manrope_cut_008_medium)),
                                modifier = Modifier.align(Alignment.Center)
                            )
                        }
                    }
                }
            }
            if (showBottomSheet.value) {
                val tempName = remember { mutableStateOf(recipientName.value) }
                val tempPhone = remember { mutableStateOf(recipientPhone.value) }
                val tempEmail = remember { mutableStateOf(recipientEmail.value) }
                ModalBottomSheet(
                    onDismissRequest = {
                        analyticsHelper.trackButtonClick("cancel_recipient_edit", "checkout_screen")
                        showBottomSheet.value = false
                    },
                    sheetState = sheetState,
                    shape = RoundedCornerShape(topStart = 28.dp, topEnd = 28.dp),
                    containerColor = Color.White
                ) {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(start = 16.dp, end = 16.dp)
                    ) {
                        Text(
                            text = "Получатель",
                            color = Color.Black,
                            fontSize = 21.sp,
                            fontFamily = FontFamily(Font(R.font.manrope_cut_008_extrabold)),
                            fontWeight = FontWeight.W800
                        )
                        Spacer(modifier = Modifier.height(16.dp))
                        Text(
                            text = "ФИО",
                            color = Color.Black,
                            fontSize = 16.sp,
                            fontFamily = FontFamily(Font(R.font.manrope_cut_008_extrabold)),
                            fontWeight = FontWeight.W800
                        )
                        Spacer(modifier = Modifier.height(12.dp))
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .background(Color(0xFFF2F1F0), RoundedCornerShape(12.dp))
                                .padding(start = 16.dp, end = 12.dp, top = 11.dp, bottom = 13.dp)
                        ) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                BasicTextField(
                                    value = tempName.value,
                                    onValueChange = { tempName.value = it },
                                    textStyle = TextStyle(
                                        color = Color.Black,
                                        fontSize = 15.sp,
                                        fontWeight = FontWeight.W500,
                                        fontFamily = FontFamily(Font(R.font.manrope_cut_008_medium))
                                    ),
                                    modifier = Modifier.weight(1f)
                                ) { innerTextField ->
                                    if (tempName.value.isEmpty()) {
                                        Text(
                                            text = "Князева Екатерина ",
                                            color = Color(117, 117, 117, 255),
                                            fontSize = 15.sp,
                                            fontWeight = FontWeight.W500,
                                            fontFamily = FontFamily(Font(R.font.manrope_cut_008_medium))
                                        )
                                    } else {
                                        innerTextField()
                                    }
                                }
                                IconButton(onClick = { tempName.value = "" }) {
                                    Image(
                                        painter = painterResource(id = R.drawable.close_button),
                                        contentDescription = "Clear",
                                        modifier = Modifier.size(24.dp)
                                    )
                                }
                            }
                        }
                        Spacer(modifier = Modifier.height(16.dp))
                        Text(
                            text = "Телефон",
                            color = Color.Black,
                            fontSize = 16.sp,
                            fontFamily = FontFamily(Font(R.font.manrope_cut_008_extrabold)),
                            fontWeight = FontWeight.W800
                        )
                        Spacer(modifier = Modifier.height(12.dp))
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .background(Color(0xFFF2F1F0), RoundedCornerShape(12.dp))
                                .padding(start = 16.dp, end = 12.dp, top = 11.dp, bottom = 13.dp)
                        ) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                BasicTextField(
                                    value = tempPhone.value,
                                    onValueChange = { newValue ->
                                        tempPhone.value = newValue.filter { it.isDigit() || it == '+' }
                                        if (tempPhone.value.length > 12) {
                                            tempPhone.value = tempPhone.value.substring(0, 12)
                                        }
                                    },
                                    textStyle = TextStyle(
                                        color = Color.Black,
                                        fontSize = 15.sp,
                                        fontWeight = FontWeight.W500,
                                        fontFamily = FontFamily(Font(R.font.manrope_cut_008_medium))
                                    ),
                                    modifier = Modifier.weight(1f)
                                ) { innerTextField ->
                                    if (tempPhone.value.isEmpty()) {
                                        Text(
                                            text = "+78005553535",
                                            color = Color(117, 117, 117, 255),
                                            fontSize = 15.sp,
                                            fontWeight = FontWeight.W500,
                                            fontFamily = FontFamily(Font(R.font.manrope_cut_008_medium))
                                        )
                                    } else {
                                        innerTextField()
                                    }
                                }
                                IconButton(onClick = { tempPhone.value = "" }) {
                                    Image(
                                        painter = painterResource(id = R.drawable.close_button),
                                        contentDescription = "Clear",
                                        modifier = Modifier.size(24.dp)
                                    )
                                }
                            }
                        }
                        Spacer(modifier = Modifier.height(6.dp))
                        Text(
                            text = "Отправим на этот номер код выдачи заказа",
                            color = Color(117, 117, 117, 255),
                            fontSize = 13.sp,
                            fontWeight = FontWeight.W500,
                            fontFamily = FontFamily(Font(R.font.manrope_cut_008_medium))
                        )
                        Spacer(modifier = Modifier.height(16.dp))
                        Text(
                            text = "Почта",
                            color = Color.Black,
                            fontSize = 16.sp,
                            fontFamily = FontFamily(Font(R.font.manrope_cut_008_extrabold)),
                            fontWeight = FontWeight.W800
                        )
                        Spacer(modifier = Modifier.height(12.dp))
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .background(Color(0xFFF2F1F0), RoundedCornerShape(12.dp))
                                .padding(start = 16.dp, end = 12.dp, top = 11.dp, bottom = 13.dp)
                        ) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                BasicTextField(
                                    value = tempEmail.value,
                                    onValueChange = { tempEmail.value = it },
                                    textStyle = TextStyle(
                                        color = Color.Black,
                                        fontSize = 15.sp,
                                        fontWeight = FontWeight.W500,
                                        fontFamily = FontFamily(Font(R.font.manrope_cut_008_medium))
                                    ),
                                    modifier = Modifier.weight(1f)
                                ) { innerTextField ->
                                    if (tempEmail.value.isEmpty()) {
                                        Text(
                                            text = "catherineu@gmail.com",
                                            color = Color(117, 117, 117, 255),
                                            fontSize = 15.sp,
                                            fontWeight = FontWeight.W500,
                                            fontFamily = FontFamily(Font(R.font.manrope_cut_008_medium))
                                        )
                                    } else {
                                        innerTextField()
                                    }
                                }
                                IconButton(onClick = { tempEmail.value = "" }) {
                                    Image(
                                        painter = painterResource(id = R.drawable.close_button),
                                        contentDescription = "Clear",
                                        modifier = Modifier.size(24.dp)
                                    )
                                }
                            }
                        }
                        Spacer(modifier = Modifier.height(6.dp))
                        Text(
                            text = "На этот адрес придёт чек",
                            color = Color(117, 117, 117, 255),
                            fontSize = 13.sp,
                            fontWeight = FontWeight.W500,
                            fontFamily = FontFamily(Font(R.font.manrope_cut_008_medium))
                        )
                        Spacer(modifier = Modifier.height(16.dp))
                        Spacer(modifier = Modifier.height(16.dp))
                    }
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .background(
                                Color.White,
                                RoundedCornerShape(topStart = 28.dp, topEnd = 28.dp)
                            )
                            .padding(start = 10.dp, end = 10.dp, top = 10.dp, bottom = 34.dp)
                    ) {
                        Box(
                            modifier = Modifier
                                .align(Alignment.BottomCenter)
                                .fillMaxWidth()
                                .background(Color(0xFF141414), RoundedCornerShape(12.dp))
                                .clickable {
                                    analyticsHelper.trackButtonClick("save_recipient", "checkout_screen")
                                    recipientName.value = tempName.value
                                    recipientPhone.value = tempPhone.value
                                    recipientEmail.value = tempEmail.value
                                    showBottomSheet.value = false
                                }
                                .padding(top = 15.dp, bottom = 17.dp)
                        ) {
                            Text(
                                text = "Сохранить",
                                color = Color.White,
                                fontSize = 15.sp,
                                fontWeight = FontWeight.W500,
                                fontFamily = FontFamily(Font(R.font.manrope_cut_008_medium)),
                                modifier = Modifier.align(Alignment.Center)
                            )
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun PaymentOption(
    imageRes: Int,
    title: String,
    subtitle: String,
    discountText: String?,
    isSelected: Boolean,
    onClick: () -> Unit,
    subtitleColor: Color,
    analyticsHelper: AnalyticsHelper
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clickable {
                onClick()
                analyticsHelper.trackButtonClick("select_payment_$title", "checkout_screen")
            },
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Image(
                painter = painterResource(id = imageRes),
                contentDescription = null,
                modifier = Modifier.size(48.dp)
            )
            Spacer(modifier = Modifier.width(13.dp))
            Column {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        text = title,
                        color = Color.Black,
                        fontSize = 15.sp,
                        fontWeight = FontWeight.W500,
                        fontFamily = FontFamily(Font(R.font.manrope_cut_008_medium))
                    )
                    if (discountText != null) {
                        Spacer(modifier = Modifier.width(5.dp))
                        Box(
                            modifier = Modifier
                                .background(Color(0xFFFF4053), RoundedCornerShape(48.dp))
                                .padding(top = 1.dp, start = 4.dp, end = 4.dp)
                        ) {
                            Text(
                                text = discountText,
                                color = Color.White,
                                fontSize = 11.sp,
                                fontWeight = FontWeight.W500,
                                fontFamily = FontFamily(Font(R.font.manrope_cut_008_medium))
                            )
                        }
                    }
                }
                Text(
                    text = subtitle,
                    color = subtitleColor,
                    fontSize = 13.sp,
                    fontWeight = FontWeight.W500,
                    fontFamily = FontFamily(Font(R.font.manrope_cut_008_medium))
                )
            }
        }
        val bgColor = if (isSelected) Color(0xFF141414) else Color(0xFFE3E2E1)
        Box(
            modifier = Modifier
                .size(28.dp)
                .clip(CircleShape)
                .background(bgColor)
        ) {
            Image(
                painter = painterResource(id = R.drawable.faint),
                contentDescription = null,
                modifier = Modifier
                    .align(Alignment.Center)
                    .padding(top = 4.4.dp, bottom = 4.21.dp, start = 2.45.dp, end = 2.44.dp)
                    .size(16.dp),
                colorFilter = if (isSelected) null else ColorFilter.tint(Color(0xFFE3E2E1))
            )
        }
    }
}

@Composable
fun DeliveryOptionsScroll(
    baseTotalDeliveryPrice: Int,
    deliveries: List<DeliveryOptionData>,
    selectedIndex: androidx.compose.runtime.MutableState<Int>,
    analyticsHelper: AnalyticsHelper
) {
    val scrollState = rememberScrollState()

    Row(
        modifier = Modifier
            .horizontalScroll(scrollState)
            .padding(horizontal = 16.dp)
    ) {
        deliveries.forEachIndexed { index, delivery ->
            val optionOriginal = (baseTotalDeliveryPrice * delivery.factor).toInt()
            val discounted = if (delivery.hasDiscount) (optionOriginal * 0.25).toInt() else optionOriginal
            val originalPriceStr = formatPrice(optionOriginal)
            val discountedPriceStr = if (delivery.hasDiscount) formatPrice(discounted) else null
            DeliveryOption(
                label = delivery.label,
                company = delivery.company,
                originalPrice = originalPriceStr,
                discountedPrice = discountedPriceStr,
                days = delivery.days,
                isSelected = selectedIndex.value == index,
                onClick = {
                    selectedIndex.value = index
                    analyticsHelper.trackButtonClick("select_delivery_${delivery.company}", "checkout_screen")
                }
            )
            if (index < deliveries.size - 1) {
                Spacer(modifier = Modifier.width(6.dp))
            }
        }
    }
}

@Composable
fun DeliveryOption(
    label: String,
    company: String,
    originalPrice: String,
    discountedPrice: String?,
    days: String,
    isSelected: Boolean,
    onClick: () -> Unit
) {
    val density = LocalDensity.current
    val heightInDp = with(density) { 15.sp.toDp() + 4.dp }
    val labelColor = if (label == "Лучшая цена") Color(0, 178, 83, 255) else Color(140, 79, 232, 255)

    Box(
        modifier = Modifier
            .background(Color(0xFFF2F1F0), RoundedCornerShape(16.dp))
            .then(if (isSelected) Modifier.border(2.dp, Color.Black, RoundedCornerShape(16.dp)) else Modifier)
            .clickable { onClick() }
    ) {
        Column(
            modifier = Modifier
                .padding(top = 12.dp, bottom = 12.dp, start = 16.dp, end = 36.dp)
        ) {
            Text(
                text = label,
                color = labelColor,
                fontSize = 11.sp,
                fontWeight = FontWeight.W500,
                fontFamily = FontFamily(Font(R.font.manrope_cut_008_medium))
            )
            Text(
                text = company,
                color = Color.Black,
                fontSize = 15.sp,
                fontWeight = FontWeight.W500,
                fontFamily = FontFamily(Font(R.font.manrope_cut_008_medium))
            )
            Row(
                verticalAlignment = Alignment.CenterVertically
            ) {
                if (discountedPrice != null) {
                    Box {
                        Text(
                            text = originalPrice,
                            color = Color.Black,
                            fontSize = 15.sp,
                            fontWeight = FontWeight.W500,
                            fontFamily = FontFamily(Font(R.font.manrope_cut_008_medium))
                        )
                        Image(
                            painter = painterResource(id = R.drawable.vector_for_discount),
                            contentDescription = null,
                            modifier = Modifier
                                .width((7.625 * (originalPrice.length)).dp)
                                .height(heightInDp)
                                .align(Alignment.Center)
                        )
                    }
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        text = discountedPrice,
                        color = Color(255, 64, 83, 255),
                        fontSize = 15.sp,
                        fontWeight = FontWeight.W500,
                        fontFamily = FontFamily(Font(R.font.manrope_cut_008_medium))
                    )
                } else {
                    Text(
                        text = originalPrice,
                        color = Color.Black,
                        fontSize = 15.sp,
                        fontWeight = FontWeight.W500,
                        fontFamily = FontFamily(Font(R.font.manrope_cut_008_medium))
                    )
                }
                Text(
                    text = ", $days",
                    color = Color.Black,
                    fontSize = 15.sp,
                    fontWeight = FontWeight.W500,
                    fontFamily = FontFamily(Font(R.font.manrope_cut_008_medium))
                )
            }
        }
        if (isSelected) {
            Image(
                painter = painterResource(id = R.drawable.checkmark),
                contentDescription = null,
                modifier = Modifier
                    .align(Alignment.TopEnd)
                    .padding(top = 10.dp, end = 10.dp)
                    .size(20.dp)
            )
        }
    }
}

@Composable
fun StoreDeliveryInfo(
    storeName: String,
    selectedProducts: List<Product>,
    selectedDelivery: DeliveryOptionData,
    originalDeliveryPrice: Int,
    discountedDeliveryPrice: Int,
    totalPrice: Int,
    navController: NavHostController,
    analyticsHelper: AnalyticsHelper
) {
    val density = LocalDensity.current
    val heightInDp = with(density) { 15.sp.toDp() + 4.dp }
    val formattedOriginalDeliveryPrice = formatPrice(originalDeliveryPrice)
    val formattedDiscountedDeliveryPrice = formatPrice(discountedDeliveryPrice)

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .padding(start = 16.dp, end = 16.dp, bottom = 16.dp)
            .background(Color.White, RoundedCornerShape(16.dp))
    ) {
        Column(
            modifier = Modifier.padding(top = 16.dp, start = 24.dp, end = 24.dp, bottom = 24.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = storeName,
                    color = Color.Black,
                    fontSize = 21.sp,
                    fontFamily = FontFamily(Font(R.font.manrope_cut_008_extrabold)),
                    fontWeight = FontWeight.W800
                )
                Image(
                    painter = painterResource(id = R.drawable.three_points),
                    contentDescription = null,
                    modifier = Modifier.size(24.dp)
                )
            }
            Spacer(modifier = Modifier.height(16.dp))
            selectedProducts.forEach { product ->
                Row(
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Image(
                        painter = painterResource(id = R.drawable.order_icon),
                        contentDescription = null,
                        modifier = Modifier.size(24.dp)
                    )
                    Spacer(modifier = Modifier.width(12.dp))
                    Text(
                        text = product.description,
                        color = Color.Black,
                        fontSize = 15.sp,
                        fontFamily = FontFamily(Font(R.font.manrope_cut_008_medium)),
                        fontWeight = FontWeight.W500
                    )
                }
                Spacer(modifier = Modifier.height(10.dp))
            }
            Row {
                selectedProducts.forEachIndexed { index, product ->
                    Box {
                        Image(
                            painter = painterResource(id = product.imagePath),
                            contentDescription = null,
                            modifier = Modifier
                                .size(76.dp)
                                .clip(RoundedCornerShape(12.dp)),
                            contentScale = ContentScale.Crop
                        )
                        if (product.quantity > 1) {
                            Box(
                                modifier = Modifier
                                    .align(Alignment.BottomStart)
                                    .padding(start = 4.dp, bottom = 4.dp)
                                    .size(24.dp)
                                    .background(Color.Black, RoundedCornerShape(48.dp))
                                    .wrapContentSize(Alignment.Center)
                            ) {
                                Text(
                                    text = "${product.quantity}",
                                    color = Color.White,
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.W500,
                                    fontFamily = FontFamily(Font(R.font.manrope_cut_008_medium)),
                                    modifier = Modifier.align(Alignment.Center)
                                )
                            }
                        }
                    }
                    if (index < selectedProducts.size - 1) {
                        Spacer(modifier = Modifier.width(6.dp))
                    }
                }
            }
            Spacer(modifier = Modifier.height(16.dp))
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.Top,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Row(
                ) {
                    Image(
                        painter = painterResource(id = R.drawable.pin),
                        contentDescription = null,
                        modifier = Modifier.size(24.dp)
                    )
                    Column(
                        modifier = Modifier.padding(horizontal = 12.dp),
                    ) {
                        Text(
                            text = selectedDelivery.company,
                            color = Color.Black,
                            fontSize = 15.sp,
                            fontWeight = FontWeight.W500,
                            fontFamily = FontFamily(Font(R.font.manrope_cut_008_medium))
                        )
                        Text(
                            text = "Москва, ул. Лесная, 7",
                            color = Color(117, 117, 117, 255),
                            fontSize = 15.sp,
                            fontWeight = FontWeight.W500,
                            fontFamily = FontFamily(Font(R.font.manrope_cut_008_medium))
                        )
                        Row(
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            if (selectedDelivery.hasDiscount) {
                                Box {
                                    Text(
                                        text = formattedOriginalDeliveryPrice,
                                        color = Color.Black,
                                        fontSize = 15.sp,
                                        fontWeight = FontWeight.W500,
                                        fontFamily = FontFamily(Font(R.font.manrope_cut_008_medium))
                                    )
                                    Image(
                                        painter = painterResource(id = R.drawable.vector_for_discount),
                                        contentDescription = null,
                                        modifier = Modifier
                                            .width((7.625 * (formattedOriginalDeliveryPrice.length)).dp)
                                            .height(heightInDp)
                                            .align(Alignment.Center)
                                    )
                                }
                                Spacer(modifier = Modifier.width(4.dp))
                                Text(
                                    text = formattedDiscountedDeliveryPrice,
                                    color = Color(255, 64, 83, 255),
                                    fontSize = 15.sp,
                                    fontWeight = FontWeight.W500,
                                    fontFamily = FontFamily(Font(R.font.manrope_cut_008_medium))
                                )
                            } else {
                                Text(
                                    text = formattedOriginalDeliveryPrice,
                                    color = Color.Black,
                                    fontSize = 15.sp,
                                    fontWeight = FontWeight.W500,
                                    fontFamily = FontFamily(Font(R.font.manrope_cut_008_medium))
                                )
                            }
                            Text(
                                text = ", ${selectedDelivery.days}",
                                color = Color.Black,
                                fontSize = 15.sp,
                                fontWeight = FontWeight.W500,
                                fontFamily = FontFamily(Font(R.font.manrope_cut_008_medium))
                            )
                        }
                    }
                }
                Image(
                    painter = painterResource(id = R.drawable.arrow_forward_ios),
                    contentDescription = null,
                    modifier = Modifier
                        .size(24.dp)
                        .clickable {
                            analyticsHelper.trackButtonClick("view_delivery_options_${selectedDelivery.company}", "checkout_screen")
                            navController.navigate("delivery_options/${selectedDelivery.company}")
                        }
                )
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DeliveryOptionsScreen(
    navController: NavHostController,
    company: String,
    analyticsHelper: AnalyticsHelper
) {
    val grayText = if (company == "Авито") "Авито Доставка по Москве" else "$company по Москве"

    LaunchedEffect(Unit) {
        analyticsHelper.trackScreenView("delivery_options_screen")
    }

    Scaffold(
        containerColor = Color.White,
        modifier = Modifier.fillMaxSize(),
        topBar = {
            CenterAlignedTopAppBar(
                title = {
                    Text(
                        text = "Способы доставки",
                        color = Color.Black,
                        fontSize = 16.sp,
                        fontFamily = FontFamily(Font(R.font.manrope_cut_008_extrabold)),
                        fontWeight = FontWeight.W800
                    )
                },
                navigationIcon = {
                    IconButton(onClick = {
                        analyticsHelper.trackButtonClick("back_from_delivery_options", "delivery_options_screen")
                        navController.popBackStack()
                    }) {
                        Image(
                            painter = painterResource(id = R.drawable.close_button),
                            contentDescription = "Close",
                            modifier = Modifier.size(24.dp)
                        )
                    }
                },
                colors = TopAppBarDefaults.centerAlignedTopAppBarColors(
                    containerColor = Color.White
                )
            )
        }
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .padding(innerPadding)
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
        ) {
            val selectedTab = remember { mutableStateOf(0) }

            Row(
                modifier = Modifier
                    .padding(start = 16.dp, end = 16.dp, top = 4.dp)
            ) {
                listOf("Все", "В пункт выдачи", "Курьер").forEachIndexed { index, label ->
                    Box(
                        modifier = Modifier
                            .background(if (index == selectedTab.value) Color(0xFF141414) else Color(0xFFF2F1F0), shape = RoundedCornerShape(12.dp))
                            .clickable {
                                selectedTab.value = index
                                analyticsHelper.trackButtonClick("delivery_tab_$label", "delivery_options_screen")
                            }
                            .padding(top = 11.dp, bottom = 12.dp, start = 16.dp, end = 17.dp)
                    ) {
                        Text(
                            text = label,
                            color = if (index == selectedTab.value) Color.White else Color.Black,
                            fontSize = 15.sp,
                            fontWeight = FontWeight.W500,
                            fontFamily = FontFamily(Font(R.font.manrope_cut_008_medium))
                        )
                    }
                    if (index < 2) Spacer(modifier = Modifier.width(6.dp))
                }
            }

            Spacer(modifier = Modifier.height(22.dp))

            Text(
                text = grayText,
                color = Color(0xFF757575),
                fontSize = 15.sp,
                fontWeight = FontWeight.W500,
                fontFamily = FontFamily(Font(R.font.manrope_cut_008_medium)),
                modifier = Modifier.padding(horizontal = 16.dp)
            )

            Spacer(modifier = Modifier.height(12.dp))

            Column(
                modifier = Modifier.padding(horizontal = 16.dp)
            ) {
                listOf(
                    ("Авито" to "1–4 дня") to (619 to 123),
                    ("Почта России" to "3–4 дня") to (789 to 157),
                    ("СДЭК" to "4–7 дней") to (809 to 161),
                    ("Яндекс Доставка" to "от 4 часов") to (0 to 539)
                ).forEachIndexed { index, data ->
                    val (info, prices) = data
                    val (companyName, time) = info
                    val (struckPrice, discPrice) = prices
                    val isAvito = companyName == "Авито"
                    val density = LocalDensity.current
                    val heightInDp = with(density) { 15.sp.toDp() + 4.dp }

                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable {
                                analyticsHelper.trackButtonClick("select_delivery_company_$companyName", "delivery_options_screen")
                            },
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Box(
                            modifier = Modifier
                                .background(Color(0xFFF2F1F0), shape = RoundedCornerShape(90.dp))
                                .padding(12.dp)
                        ) {
                            Image(
                                painter = painterResource(id = R.drawable.pin),
                                contentDescription = null,
                                modifier = Modifier.size(24.dp)
                            )
                        }

                        Spacer(modifier = Modifier.width(12.dp))

                        Column {
                            Text(
                                text = companyName,
                                color = Color.Black,
                                fontSize = 15.sp,
                                fontWeight = FontWeight.W500,
                                fontFamily = FontFamily(Font(R.font.manrope_cut_008_medium))
                            )
                            Text(
                                text = time,
                                color = Color.Black,
                                fontSize = 15.sp,
                                fontWeight = FontWeight.W500,
                                fontFamily = FontFamily(Font(R.font.manrope_cut_008_medium))
                            )
                            if (isAvito) {
                                Text(
                                    text = "Самый дешёвый",
                                    color = Color(67, 191, 0, 255),
                                    fontSize = 15.sp,
                                    fontWeight = FontWeight.W500,
                                    fontFamily = FontFamily(Font(R.font.manrope_cut_008_medium))
                                )
                            }
                        }

                        Spacer(modifier = Modifier.weight(1f))

                        Row(
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            if (struckPrice > 0) {
                                Box {
                                    val str = formatPrice(struckPrice)
                                    Text(
                                        text = str,
                                        color = Color(0xFF757575),
                                        fontSize = 15.sp,
                                        fontWeight = FontWeight.W500,
                                        fontFamily = FontFamily(Font(R.font.manrope_cut_008_medium))
                                    )
                                    Image(
                                        painter = painterResource(id = R.drawable.vector_for_discount),
                                        contentDescription = null,
                                        modifier = Modifier
                                            .width((7.625 * str.length).dp)
                                            .height(heightInDp)
                                            .align(Alignment.Center)
                                    )
                                }
                                Spacer(modifier = Modifier.width(6.dp))
                                Text(
                                    text = "от " + formatPrice(discPrice),
                                    color = Color.Black,
                                    fontSize = 15.sp,
                                    fontWeight = FontWeight.W500,
                                    fontFamily = FontFamily(Font(R.font.manrope_cut_008_medium))
                                )
                            } else {
                                Text(
                                    text = "от " + formatPrice(discPrice),
                                    color = Color.Black,
                                    fontSize = 15.sp,
                                    fontWeight = FontWeight.W500,
                                    fontFamily = FontFamily(Font(R.font.manrope_cut_008_medium))
                                )
                            }
                        }
                    }

                    if (index < 3) Spacer(modifier = Modifier.height(28.dp))
                }
            }
        }
    }
}