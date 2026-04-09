import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      // Brand
      brand: 'Hand', brandSuffix: 'Craft',
      
      // Navbar
      searchPlaceholder: 'Search handcrafted items...',
      wishlist: 'Wishlist', cart: 'Cart', notifications: 'Notifications',
      noNotifications: 'No notifications yet', markAllRead: 'Mark all read',
      login: 'Log in', signup: 'Sign up', logout: 'Logout',
      profileSettings: 'Profile Settings', myOrders: 'My Orders',
      darkMode: 'Dark Mode', lightMode: 'Light Mode',

      // Home
      heroTitle: 'Crafted with Passion.',
      heroSubtitle: 'Discover unique pieces from independent artisans across the country.',
      shopNewArrivals: 'Shop New Arrivals',
      allCategories: 'All',
      sortBy: 'Sort by',
      popular: 'Popular', newest: 'Newest', topRated: 'Top Rated',
      priceLowHigh: 'Price: Low to High', priceHighLow: 'Price: High to Low',
      noProducts: 'No products found',
      clearFilters: 'Clear all filters',

      // Product Detail
      home: 'Home', reviews: 'reviews',
      soldBy: 'Sold by', addToCart: 'Add to Cart',
      addedToCart: 'Added to cart!',
      outOfStock: 'Currently Out of Stock',
      onlyLeft: 'Only', leftInStock: 'left in stock',
      mrpInclusive: 'M.R.P. inclusive of all taxes',
      dispatch48: 'Dispatch within 48 hours',
      freeDelivery: 'Free delivery across India',
      securePayment: 'Secure payment & Easy returns',
      messageArtisan: 'Message',
      artisanStory: "The Artisan's Story",
      masterCraftsman: 'Master Craftsman',
      artisanQuote: 'Every piece tells a story of tradition, passed down through generations of skilled artisans.',
      aboutMaker: 'About the Maker',
      artisanBio: "This artisan dedicates their life to preserving traditional Indian craftsmanship. Each piece is handmade with love, care, and generations of knowledge.",
      noReviews: 'No reviews yet for this product.',

      // Wishlist
      yourWishlist: 'Your Wishlist',
      noItemsSaved: 'No items saved yet',
      wishlistHint: 'Save items you like in your wishlist. Review them anytime and easily move them to cart.',
      discoverProducts: 'Discover Products',
      moveToCart: 'Move to Cart',

      // Cart
      shoppingCart: 'Shopping Cart',
      emptyCart: 'Your cart is empty',
      emptyCartHint: 'Add some beautiful handcrafted items to get started.',
      startShopping: 'Start Shopping',
      orderSummary: 'Order Summary',
      subtotal: 'Subtotal', shipping: 'Shipping', total: 'Total',
      freeShipping: 'Free',
      proceedToCheckout: 'Proceed to Checkout',

      // Profile
      myProfile: 'My Profile',
      editProfile: 'Edit Profile',
      changePassword: 'Change Password',
      fullName: 'Full Name', phoneNumber: 'Phone Number',
      saveChanges: 'Save Changes', saving: 'Saving...',
      currentPassword: 'Current Password',
      newPassword: 'New Password', confirmPassword: 'Confirm New Password',
      updatePassword: 'Update Password', updating: 'Updating...',
      profileUpdated: 'Profile updated successfully!',
      passwordChanged: 'Password changed successfully!',
      passwordNoMatch: 'New passwords do not match',
      passwordTooShort: 'Password must be at least 6 characters',
      passwordNote: "After changing your password, you'll stay logged in on this device.",
      failedLoadProfile: 'Failed to load profile',
      failedUpdateProfile: 'Failed to update profile',
      failedChangePassword: 'Failed to change password',

      // Orders
      myOrdersTitle: 'My Orders',
      noOrders: "You haven't placed any orders yet.",
      browseProducts: 'Browse Products',
      cancelOrder: 'Cancel Order',
      trackOrder: 'Track Order',

      // Artisan Dashboard
      artisanDashboardTitle: 'Artisan Dashboard',
      artisanWelcome: "Welcome back. Here's what's happening with your store today.",
      totalRevenue: 'Total Revenue', totalOrders: 'Total Orders',
      activeProducts: 'Active Products', performance: 'Performance (30d)',
      quickActions: 'Quick Actions',
      addNewProduct: 'Add New Product', manageOrders: 'Manage Orders',
      recentSales: 'Recent Sales Trend',

      // Artisan Products
      myProducts: 'My Products',
      manageCatalog: 'Manage your catalog and inventory',
      addProduct: 'Add Product',

      // Artisan Orders
      manageOrdersTitle: 'Manage Orders',
      fulfillOrders: 'Fulfill your orders and update dispatch status',
      noOrdersYet: 'No orders yet',
      noOrdersHint: 'When customers buy your products, they will appear here.',
      markShipped: 'Mark as Shipped', markDelivered: 'Mark as Delivered',
      itemsToFulfill: 'Items to Fulfill',

      // Messages
      messages: 'Messages', startConversation: 'Start a conversation',
      sendMessageHint: 'Send a message to ask about products, custom orders, or anything else!',

      // Chatbot
      chatbotGreeting: "Hello! 👋 I'm your HandCraft assistant.",

      // Generic
      loading: 'Loading...', error: 'Error', success: 'Success',
      ok: 'OK', cancel: 'Cancel', save: 'Save', delete: 'Delete',
      confirm: 'Confirm', yes: 'Yes', no: 'No', back: 'Back',
    }
  },
  hi: {
    translation: {
      brand: 'हैंड', brandSuffix: 'क्राफ्ट',
      searchPlaceholder: 'हस्तशिल्प खोजें...',
      wishlist: 'इच्छा सूची', cart: 'कार्ट', notifications: 'सूचनाएं',
      noNotifications: 'कोई सूचना नहीं', markAllRead: 'सब पढ़ा हुआ',
      login: 'लॉग इन', signup: 'साइन अप', logout: 'लॉग आउट',
      profileSettings: 'प्रोफ़ाइल सेटिंग्स', myOrders: 'मेरे ऑर्डर',
      darkMode: 'डार्क मोड', lightMode: 'लाइट मोड',
      heroTitle: 'जुनून से बनाया गया।', heroSubtitle: 'देशभर के स्वतंत्र कारीगरों से अनूठे उत्पाद खोजें।',
      shopNewArrivals: 'नए उत्पाद खरीदें', allCategories: 'सभी',
      sortBy: 'के अनुसार', popular: 'लोकप्रिय', newest: 'नवीनतम',
      topRated: 'शीर्ष रेटेड', priceLowHigh: 'कीमत: कम से ज़्यादा', priceHighLow: 'कीमत: ज़्यादा से कम',
      noProducts: 'कोई उत्पाद नहीं मिला', clearFilters: 'सभी फिल्टर साफ़ करें',
      home: 'होम', reviews: 'समीक्षाएँ', soldBy: 'विक्रेता', addToCart: 'कार्ट में जोड़ें',
      addedToCart: 'कार्ट में जोड़ा गया!', outOfStock: 'स्टॉक में नहीं',
      onlyLeft: 'केवल', leftInStock: 'बचा है',
      mrpInclusive: 'एम.आर.पी. सभी करों सहित',
      dispatch48: '48 घंटों में प्रेषण', freeDelivery: 'पूरे भारत में मुफ़्त डिलीवरी',
      securePayment: 'सुरक्षित भुगतान और आसान रिटर्न',
      messageArtisan: 'संदेश भेजें',
      artisanStory: 'कारीगर की कहानी', masterCraftsman: 'मास्टर कारीगर',
      yourWishlist: 'आपकी इच्छा सूची', noItemsSaved: 'अभी तक कोई आइटम सहेजा नहीं गया',
      discoverProducts: 'उत्पाद खोजें', moveToCart: 'कार्ट में ले जाएं',
      shoppingCart: 'शॉपिंग कार्ट', emptyCart: 'आपका कार्ट खाली है',
      startShopping: 'खरीदारी शुरू करें', orderSummary: 'ऑर्डर सारांश',
      subtotal: 'उप-योग', shipping: 'शिपिंग', total: 'कुल',
      freeShipping: 'मुफ़्त', proceedToCheckout: 'चेकआउट पर जाएं',
      myProfile: 'मेरी प्रोफ़ाइल', editProfile: 'प्रोफ़ाइल संपादित करें',
      changePassword: 'पासवर्ड बदलें', fullName: 'पूरा नाम', phoneNumber: 'फ़ोन नंबर',
      saveChanges: 'परिवर्तन सहेजें', saving: 'सहेज रहे हैं...',
      currentPassword: 'वर्तमान पासवर्ड', newPassword: 'नया पासवर्ड',
      confirmPassword: 'नया पासवर्ड पुष्टि करें', updatePassword: 'पासवर्ड अपडेट करें',
      profileUpdated: 'प्रोफ़ाइल सफलतापूर्वक अपडेट!', passwordChanged: 'पासवर्ड सफलतापूर्वक बदला!',
      myOrdersTitle: 'मेरे ऑर्डर', cancelOrder: 'ऑर्डर रद्द करें',
      artisanDashboardTitle: 'कारीगर डैशबोर्ड',
      totalRevenue: 'कुल राजस्व', totalOrders: 'कुल ऑर्डर',
      activeProducts: 'सक्रिय उत्पाद', quickActions: 'त्वरित कार्य',
      addNewProduct: 'नया उत्पाद जोड़ें', manageOrders: 'ऑर्डर प्रबंधित करें',
      myProducts: 'मेरे उत्पाद', addProduct: 'उत्पाद जोड़ें',
      messages: 'संदेश', loading: 'लोड हो रहा है...', cancel: 'रद्द करें', save: 'सहेजें',
      back: 'वापस',
    }
  },
  te: {
    translation: {
      brand: 'హ్యాండ్', brandSuffix: 'క్రాఫ్ట్',
      searchPlaceholder: 'చేతిపనులు వెతకండి...',
      wishlist: 'ఇష్టాంశాలు', cart: 'కార్ట్', notifications: 'నోటిఫికేషన్లు',
      noNotifications: 'నోటిఫికేషన్లు లేవు', markAllRead: 'అన్నీ చదివినవి',
      login: 'లాగిన్', signup: 'సైన్ అప్', logout: 'లాగ్ అవుట్',
      profileSettings: 'ప్రొఫైల్ సెట్టింగ్స్', myOrders: 'నా ఆర్డర్లు',
      darkMode: 'డార్క్ మోడ్', lightMode: 'లైట్ మోడ్',
      heroTitle: 'అభిరుచితో తయారు చేసారు.', heroSubtitle: 'దేశవ్యాప్తంగా స్వతంత్ర కళాకారుల నుండి ప్రత్యేక వస్తువులను కనుగొనండి.',
      shopNewArrivals: 'కొత్త వస్తువులు చూడండి', allCategories: 'అన్నీ',
      sortBy: 'క్రమం', popular: 'ప్రసిద్ధ', newest: 'కొత్తవి',
      home: 'హోమ్', reviews: 'రివ్యూలు', soldBy: 'అమ్మకందారు', addToCart: 'కార్ట్‌కు జోడించు',
      addedToCart: 'కార్ట్‌కు జోడించబడింది!', outOfStock: 'స్టాక్ లేదు',
      messageArtisan: 'సందేశం పంపండి',
      yourWishlist: 'మీ ఇష్టాంశాలు', discoverProducts: 'వస్తువులు చూడండి',
      moveToCart: 'కార్ట్‌కు తరలించు',
      shoppingCart: 'షాపింగ్ కార్ట్', emptyCart: 'మీ కార్ట్ ఖాళీగా ఉంది',
      startShopping: 'షాపింగ్ ప్రారంభించండి',
      subtotal: 'ఉప మొత్తం', shipping: 'షిప్పింగ్', total: 'మొత్తం',
      myProfile: 'నా ప్రొఫైల్', editProfile: 'ప్రొఫైల్ మార్చు',
      changePassword: 'పాస్‌వర్డ్ మార్చు', fullName: 'పూర్తి పేరు', phoneNumber: 'ఫోన్ నంబర్',
      saveChanges: 'మార్పులు సేవ్ చేయండి', currentPassword: 'ప్రస్తుత పాస్‌వర్డ్',
      newPassword: 'కొత్త పాస్‌వర్డ్', confirmPassword: 'కొత్త పాస్‌వర్డ్ నిర్ధారించండి',
      profileUpdated: 'ప్రొఫైల్ విజయవంతంగా నవీకరించబడింది!',
      passwordChanged: 'పాస్‌వర్డ్ విజయవంతంగా మార్చబడింది!',
      myOrdersTitle: 'నా ఆర్డర్లు',
      totalRevenue: 'మొత్తం ఆదాయం', totalOrders: 'మొత్తం ఆర్డర్లు',
      myProducts: 'నా ఉత్పత్తులు', addProduct: 'ఉత్పత్తి జోడించు',
      messages: 'సందేశాలు', loading: 'లోడ్ అవుతోంది...', cancel: 'రద్దు చేయండి',
      back: 'వెనక్కి',
    }
  },
  ta: {
    translation: {
      brand: 'ஹேண்ட்', brandSuffix: 'கிராஃப்ட்',
      searchPlaceholder: 'கைவினைப் பொருட்களைத் தேடுங்கள்...',
      wishlist: 'விருப்பப்பட்டியல்', cart: 'வண்டி', notifications: 'அறிவிப்புகள்',
      noNotifications: 'அறிவிப்புகள் இல்லை', markAllRead: 'அனைத்தையும் படித்ததாகக் குறி',
      login: 'உள்நுழை', signup: 'பதிவு', logout: 'வெளியேறு',
      profileSettings: 'சுயவிவர அமைப்புகள்', myOrders: 'என் ஆர்டர்கள்',
      darkMode: 'இருள் பயன்முறை', lightMode: 'ஒளி பயன்முறை',
      heroTitle: 'ஆர்வத்துடன் வடிவமைக்கப்பட்டது.',
      heroSubtitle: 'நாடு முழுவதும் உள்ள சுயாதீன கைவினைஞர்களிடமிருந்து தனித்துவமான பொருட்களைக் கண்டறியுங்கள்.',
      shopNewArrivals: 'புதிய வரவுகளை வாங்குங்கள்', allCategories: 'அனைத்தும்',
      home: 'முகப்பு', reviews: 'மதிப்புரைகள்', soldBy: 'விற்பனையாளர்', addToCart: 'வண்டியில் சேர்',
      addedToCart: 'வண்டியில் சேர்க்கப்பட்டது!', outOfStock: 'கையிருப்பில் இல்லை',
      messageArtisan: 'செய்தி',
      yourWishlist: 'உங்கள் விருப்பப்பட்டியல்', discoverProducts: 'பொருட்களை கண்டறியுங்கள்',
      moveToCart: 'வண்டிக்கு நகர்த்து',
      shoppingCart: 'வண்டி', emptyCart: 'உங்கள் வண்டி காலியாக உள்ளது',
      startShopping: 'ஷாப்பிங் தொடங்கு',
      myProfile: 'என் சுயவிவரம்', editProfile: 'சுயவிவரத்தை திருத்து',
      changePassword: 'கடவுச்சொல்லை மாற்று', fullName: 'முழு பெயர்',
      phoneNumber: 'தொலைபேசி எண்',
      saveChanges: 'மாற்றங்களைச் சேமி',
      profileUpdated: 'சுயவிவரம் புதுப்பிக்கப்பட்டது!',
      passwordChanged: 'கடவுச்சொல் மாற்றப்பட்டது!',
      myOrdersTitle: 'என் ஆர்டர்கள்',
      totalRevenue: 'மொத்த வருவாய்', totalOrders: 'மொத்த ஆர்டர்கள்',
      myProducts: 'என் பொருட்கள்', addProduct: 'பொருள் சேர்',
      messages: 'செய்திகள்', loading: 'ஏற்றுகிறது...', cancel: 'ரத்து', back: 'பின்',
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    }
  });

export default i18n;
