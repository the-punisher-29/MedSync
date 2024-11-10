// Import Firestore methods from Firebase
import { db, collection, addDoc } from '../../config/firebase.js'; // update this import according to your Firebase config path

const products = [
  {
    "id": 1,
    "title": "Cetirizine 45mg Film-coated",
    "description": "Used to treat allergies and cold symptoms.",
    "price": 25.0,
    "image": "../assets/products/product1.jpeg",
    "reviews": 3,
    "rating": 4,
    "quantity": 100,
    "mfg_date": "2023-01-01",
    "expiry_date": "2025-01-01",
    "type": "Antihistamine"
  },
  {
    "id": 2,
    "title": "Ibuprofen 500mg Capsule",
    "description": "Relieves pain, headache, menstrual cramps, and muscle aches.",
    "price": 32.0,
    "image": "../assets/products/product2.webp",
    "reviews": 20,
    "rating": 5,
    "quantity": 150,
    "mfg_date": "2022-06-15",
    "expiry_date": "2024-06-15",
    "type": "Pain Reliever"
  },
  {
    "id": 3,
    "title": "Paracetamol Syrup 125mg/5ml",
    "description": "Used for fever and mild pain relief.",
    "price": 35.0,
    "image": "../assets/products/product9.jpg",
    "reviews": 45,
    "rating": 5,
    "quantity": 200,
    "mfg_date": "2023-03-10",
    "expiry_date": "2025-03-10",
    "type": "Fever Reducer"
  },
  {
    "id": 4,
    "title": "Benadryl Cough Syrup",
    "description": "Provides relief for cough, cold, and throat irritation.",
    "price": 55.0,
    "image": "../assets/products/product10.jpeg",
    "reviews": 60,
    "rating": 4,
    "quantity": 80,
    "mfg_date": "2023-07-05",
    "expiry_date": "2025-07-05",
    "type": "Cough Suppressant"
  },
  {
    "id": 5,
    "title": "ORS Powder Sachet",
    "description": "Treats dehydration caused by diarrhea.",
    "price": 10.0,
    "image": "../assets/products/product11.jpeg",
    "reviews": 150,
    "rating": 5,
    "quantity": 500,
    "mfg_date": "2023-02-20",
    "expiry_date": "2026-02-20",
    "type": "Hydration Supplement"
  },
  {
    "id": 6,
    "title": "Crocin Pain Relief 650mg",
    "description": "Reduces fever and relieves pain.",
    "price": 30.0,
    "image": "../assets/products/product12.webp",
    "reviews": 120,
    "rating": 4,
    "quantity": 120,
    "mfg_date": "2023-05-18",
    "expiry_date": "2025-05-18",
    "type": "Pain Reliever"
  },
  {
    "id": 7,
    "title": "Hand Sanitizer 100ml",
    "description": "Alcohol-based sanitizer for germ protection.",
    "price": 45.0,
    "image": "../assets/products/product13.jpg",
    "reviews": 90,
    "rating": 5,
    "quantity": 300,
    "mfg_date": "2023-08-01",
    "expiry_date": "2025-08-01",
    "type": "Sanitizer"
  },
  {
    "id": 8,
    "title": "D Cold Total Tablet",
    "description": "For nasal and sinus congestion, cold, and fever relief.",
    "price": 18.0,
    "image": "../assets/products/product14.jpeg",
    "reviews": 40,
    "rating": 4,
    "quantity": 400,
    "mfg_date": "2022-12-10",
    "expiry_date": "2024-12-10",
    "type": "Cold & Flu Relief"
  },
  {
    "id": 9,
    "title": "Dabur Chyawanprash 500g",
    "description": "Immunity-boosting Ayurvedic health supplement.",
    "price": 160.0,
    "image": "../assets/products/product15.jpg",
    "reviews": 200,
    "rating": 4,
    "quantity": 50,
    "mfg_date": "2023-06-01",
    "expiry_date": "2025-06-01",
    "type": "Ayurvedic Supplement"
  },
  {
    "id": 10,
    "title": "Dettol Antiseptic Liquid 200ml",
    "description": "Antiseptic for wound care and personal hygiene.",
    "price": 72.0,
    "image": "../assets/products/product16.jpeg",
    "reviews": 300,
    "rating": 5,
    "quantity": 250,
    "mfg_date": "2023-09-12",
    "expiry_date": "2025-09-12",
    "type": "Antiseptic"
  },
  {
    "id": 11,
    "title": "Becosules Capsules",
    "description": "Vitamin B-complex supplement for immune support.",
    "price": 35.0,
    "image": "../assets/products/product17.webp",
    "reviews": 130,
    "rating": 4,
    "quantity": 200,
    "mfg_date": "2023-04-25",
    "expiry_date": "2025-04-25",
    "type": "Vitamin Supplement"
  },
  {
    "id": 12,
    "title": "Zincovit Syrup 200ml",
    "description": "Multivitamin and mineral syrup for immunity.",
    "price": 110.0,
    "image": "../assets/products/product18.webp",
    "reviews": 70,
    "rating": 4,
    "quantity": 60,
    "mfg_date": "2023-07-08",
    "expiry_date": "2025-07-08",
    "type": "Vitamin Supplement"
  },
  {
    "id": 13,
    "title": "Disprin Tablets",
    "description": "Pain relief and fever reduction tablet.",
    "price": 10.0,
    "image": "../assets/products/product19.jpeg",
    "reviews": 180,
    "rating": 5,
    "quantity": 350,
    "mfg_date": "2023-01-10",
    "expiry_date": "2025-01-10",
    "type": "Pain Reliever"
  },
  {
    "id": 14,
    "title": "Liv 52 Syrup 200ml",
    "description": "Liver care syrup with Ayurvedic ingredients.",
    "price": 130.0,
    "image": "../assets/products/product20.jpeg",
    "reviews": 90,
    "rating": 4,
    "quantity": 80,
    "mfg_date": "2022-11-05",
    "expiry_date": "2024-11-05",
    "type": "Liver Health Supplement"
  },
  {
    "id": 15,
    "title": "Vicks Vaporub 50g",
    "description": "Topical ointment for cold and cough relief.",
    "price": 55.0,
    "image": "../assets/products/product21.jpeg",
    "reviews": 220,
    "rating": 5,
    "quantity": 150,
    "mfg_date": "2023-08-01",
    "expiry_date": "2025-08-01",
    "type": "Topical Ointment"
  },
  {
    "id": 16,
    "title": "Revital H Capsules",
    "description": "Multivitamin supplement for energy and stamina.",
    "price": 150.0,
    "image": "../assets/products/product22.webp",
    "reviews": 80,
    "rating": 4,
    "quantity": 120,
    "mfg_date": "2023-09-20",
    "expiry_date": "2025-09-20",
    "type": "Energy Supplement"
  },
  {
    "id": 17,
    "title": "Savlon Antiseptic Cream 50g",
    "description": "For minor cuts, wounds, and skin infections.",
    "price": 40.0,
    "image": "../assets/products/product23.jpeg",
    "reviews": 70,
    "rating": 5,
    "quantity": 200,
    "mfg_date": "2023-03-15",
    "expiry_date": "2025-03-15",
    "type": "Antiseptic Cream"
  },
  {
    "id": 18,
    "title": "Benzocaine Topical Gel",
    "description": "For toothache and gum pain relief.",
    "price": 50.0,
    "image": "../assets/products/product24.jpeg",
    "reviews": 120,
    "rating": 5,
    "quantity": 80,
    "mfg_date": "2023-06-05",
    "expiry_date": "2025-06-05",
    "type": "Topical Pain Reliever"
  },
  {
    "id": 19,
    "title": "Cipla Glucon-D",
    "description": "Instant energy drink for hydration and energy.",
    "price": 30.0,
    "image": "../assets/products/product25.jpeg",
    "reviews": 200,
    "rating": 4,
    "quantity": 500,
    "mfg_date": "2023-02-14",
    "expiry_date": "2025-02-14",
    "type": "Energy Drink"
  },
  {
    "id": 20,
    "title": "GSK Sensodyne Toothpaste 100g",
    "description": "Toothpaste for sensitive teeth.",
    "price": 85.0,
    "image": "../assets/products/product26.webp",
    "reviews": 150,
    "rating": 5,
    "quantity": 180,
    "mfg_date": "2023-04-01",
    "expiry_date": "2025-04-01",
    "type": "Oral Care"
  },
  {
    "id": 21,
    "title": "Purell Hand Sanitizer 250ml",
    "description": "Kills 99.9% of germs in seconds.",
    "price": 150.0,
    "image": "../assets/products/product27.jpg",
    "reviews": 70,
    "rating": 4,
    "quantity": 100,
    "mfg_date": "2023-05-15",
    "expiry_date": "2025-05-15",
    "type": "Sanitizer"
  },
  {
    "id": 22,
    "title": "Calpol 500mg Tablet",
    "description": "Pain and fever relief for children and adults.",
    "price": 20.0,
    "image": "../assets/products/product28.webp",
    "reviews": 60,
    "rating": 4,
    "quantity": 200,
    "mfg_date": "2023-07-05",
    "expiry_date": "2025-07-05",
    "type": "Pain Reliever"
  },
  {
    "id": 23,
    "title": "Himalaya Tulsi Face Wash 100g",
    "description": "For clear skin and pollution protection.",
    "price": 80.0,
    "image": "../assets/products/product29.jpeg",
    "reviews": 50,
    "rating": 4,
    "quantity": 150,
    "mfg_date": "2023-02-25",
    "expiry_date": "2025-02-25",
    "type": "Face Wash"
  },
  {
    "id": 24,
    "title": "Morpheme Biotech Ashwagandha Capsules",
    "description": "For stress relief and improved stamina.",
    "price": 280.0,
    "image": "../assets/products/product30.webp",
    "reviews": 100,
    "rating": 5,
    "quantity": 90,
    "mfg_date": "2023-08-15",
    "expiry_date": "2025-08-15",
    "type": "Herbal Supplement"
  },
  {
    "id": 25,
    "title": "Liril 2000 Soap",
    "description": "Lemon fragrance soap for fresh skin.",
    "price": 25.0,
    "image": "../assets/products/product31.jpeg",
    "reviews": 60,
    "rating": 4,
    "quantity": 500,
    "mfg_date": "2023-01-25",
    "expiry_date": "2025-01-25",
    "type": "Soap"
  },
  {
    "id": 26,
    "title": "Himalaya Neem Face Pack",
    "description": "Face pack for acne-prone skin.",
    "price": 75.0,
    "image": "../assets/products/product32.webp",
    "reviews": 45,
    "rating": 4,
    "quantity": 180,
    "mfg_date": "2023-09-01",
    "expiry_date": "2025-09-01",
    "type": "Face Pack"
  },
  {
    "id": 27,
    "title": "Viva Collagen Drink",
    "description": "Supports skin elasticity and joint health.",
    "price": 210.0,
    "image": "../assets/products/product33.jpeg",
    "reviews": 80,
    "rating": 5,
    "quantity": 150,
    "mfg_date": "2023-03-05",
    "expiry_date": "2025-03-05",
    "type": "Collagen Supplement"
  },
  {
    "id": 28,
    "title": "Head & Shoulders Shampoo 400ml",
    "description": "Shampoo for dandruff control.",
    "price": 145.0,
    "image": "../assets/products/product34.jpeg",
    "reviews": 180,
    "rating": 4,
    "quantity": 120,
    "mfg_date": "2023-07-10",
    "expiry_date": "2025-07-10",
    "type": "Shampoo"
  },
  {
    "id": 29,
    "title": "Vicks Inhaler",
    "description": "Nasal inhaler for cold relief.",
    "price": 35.0,
    "image": "../assets/products/product35.jpg",
    "reviews": 95,
    "rating": 4,
    "quantity": 300,
    "mfg_date": "2023-08-12",
    "expiry_date": "2025-08-12",
    "type": "Nasal Decongestant"
  },
  {
    "id": 30,
    "title": "Benzalkonium Chloride 500ml",
    "description": "Antiseptic disinfectant solution.",
    "price": 90.0,
    "image": "../assets/products/product36.jpeg",
    "reviews": 40,
    "rating": 5,
    "quantity": 250,
    "mfg_date": "2023-10-01",
    "expiry_date": "2025-10-01",
    "type": "Disinfectant"
  }
];


const uploadProducts = async () => {
  const productsCollection = collection(db, 'products'); // reference to 'products' collection in Firestore

  for (const product of products) {
    try {
      await addDoc(productsCollection, product); // add each product to Firestore
      console.log(`Product ${product.id} added to Firestore`);
    } catch (error) {
      console.error(`Error adding product ${product.id}:`, error);
    }
  }
};

uploadProducts();
