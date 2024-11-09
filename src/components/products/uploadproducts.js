import { db, collection, addDoc } from '../../config/firebase.js'; // updated imports// import your initialized Firestore instance

const products = [
  {
    "id": 1,
    "title": "Cetirizine 45mg Film-coated",
    "description": "Used to treat allergies and cold symptoms.",
    "price": 25.0,
    "image": "../assets/products/product1.jpg",
    "reviews": 3,
    "rating": 4
  },
  {
    "id": 2,
    "title": "Ibuprofen 500mg Capsule",
    "description": "Relieves pain, headache, menstrual cramps, and muscle aches.",
    "price": 32.0,
    "image": "../assets/products/product2.jpg",
    "reviews": 20,
    "rating": 5
  },
  {
    "id": 3,
    "title": "Paracetamol Syrup 125mg/5ml",
    "description": "Used for fever and mild pain relief.",
    "price": 35.0,
    "image": "../assets/products/product9.jpg",
    "reviews": 45,
    "rating": 5
  },
  {
    "id": 4,
    "title": "Benadryl Cough Syrup",
    "description": "Provides relief for cough, cold, and throat irritation.",
    "price": 55.0,
    "image": "../assets/products/product10.jpg",
    "reviews": 60,
    "rating": 4
  },
  {
    "id": 5,
    "title": "ORS Powder Sachet",
    "description": "Treats dehydration caused by diarrhea.",
    "price": 10.0,
    "image": "../assets/products/product11.jpg",
    "reviews": 150,
    "rating": 5
  },
  {
    "id": 6,
    "title": "Crocin Pain Relief 650mg",
    "description": "Reduces fever and relieves pain.",
    "price": 30.0,
    "image": "../assets/products/product12.jpg",
    "reviews": 120,
    "rating": 4
  },
  {
    "id": 7,
    "title": "Hand Sanitizer 100ml",
    "description": "Alcohol-based sanitizer for germ protection.",
    "price": 45.0,
    "image": "../assets/products/product13.jpg",
    "reviews": 90,
    "rating": 5
  },
  {
    "id": 8,
    "title": "D Cold Total Tablet",
    "description": "For nasal and sinus congestion, cold, and fever relief.",
    "price": 18.0,
    "image": "../assets/products/product14.jpg",
    "reviews": 40,
    "rating": 4
  },
  {
    "id": 9,
    "title": "Dabur Chyawanprash 500g",
    "description": "Immunity-boosting Ayurvedic health supplement.",
    "price": 160.0,
    "image": "../assets/products/product15.jpg",
    "reviews": 200,
    "rating": 4
  },
  {
    "id": 10,
    "title": "Dettol Antiseptic Liquid 200ml",
    "description": "Antiseptic for wound care and personal hygiene.",
    "price": 72.0,
    "image": "../assets/products/product16.jpg",
    "reviews": 300,
    "rating": 5
  },
  {
    "id": 11,
    "title": "Becosules Capsules",
    "description": "Vitamin B-complex supplement for immune support.",
    "price": 35.0,
    "image": "../assets/products/product17.jpg",
    "reviews": 130,
    "rating": 4
  },
  {
    "id": 12,
    "title": "Zincovit Syrup 200ml",
    "description": "Multivitamin and mineral syrup for immunity.",
    "price": 110.0,
    "image": "../assets/products/product18.jpg",
    "reviews": 70,
    "rating": 4
  },
  {
    "id": 13,
    "title": "Disprin Tablets",
    "description": "Pain relief and fever reduction tablet.",
    "price": 10.0,
    "image": "../assets/products/product19.jpg",
    "reviews": 180,
    "rating": 5
  },
  {
    "id": 14,
    "title": "Liv 52 Syrup 200ml",
    "description": "Liver care syrup with Ayurvedic ingredients.",
    "price": 130.0,
    "image": "../assets/products/product20.jpg",
    "reviews": 90,
    "rating": 4
  },
  {
    "id": 15,
    "title": "Vicks Vaporub 50g",
    "description": "Topical ointment for cold and cough relief.",
    "price": 55.0,
    "image": "../assets/products/product21.jpg",
    "reviews": 220,
    "rating": 5
  },
  {
    "id": 16,
    "title": "Revital H Capsules",
    "description": "Multivitamin supplement for energy and stamina.",
    "price": 150.0,
    "image": "../assets/products/product22.jpg",
    "reviews": 80,
    "rating": 4
  },
  {
    "id": 17,
    "title": "Savlon Antiseptic Cream 50g",
    "description": "For minor cuts, wounds, and skin infections.",
    "price": 40.0,
    "image": "../assets/products/product23.jpg",
    "reviews": 70,
    "rating": 5
  },
  {
    "id": 18,
    "title": "Eno Fruit Salt Sachet",
    "description": "Fast relief from acidity and heartburn.",
    "price": 5.0,
    "image": "../assets/products/product24.jpg",
    "reviews": 140,
    "rating": 5
  },
  {
    "id": 19,
    "title": "Moov Pain Relief Cream 30g",
    "description": "Topical cream for muscle pain and backaches.",
    "price": 55.0,
    "image": "../assets/products/product25.jpg",
    "reviews": 115,
    "rating": 4
  },
  {
    "id": 20,
    "title": "Himalaya Ashvagandha Tablet",
    "description": "Herbal supplement for stress relief and stamina.",
    "price": 200.0,
    "image": "../assets/products/product26.jpg",
    "reviews": 50,
    "rating": 4
  },
  {
    "id": 21,
    "title": "Glucon-D Original 200g",
    "description": "Instant energy drink powder for quick rehydration.",
    "price": 60.0,
    "image": "../assets/products/product27.jpg",
    "reviews": 170,
    "rating": 5
  },
  {
    "id": 22,
    "title": "Saridon Tablet",
    "description": "Quick relief from headaches and minor pains.",
    "price": 15.0,
    "image": "../assets/products/product28.jpg",
    "reviews": 100,
    "rating": 5
  },
  {
    "id": 23,
    "title": "Cetrilak Antiseptic Solution",
    "description": "Used for skin disinfection before and after surgery.",
    "price": 90.0,
    "image": "../assets/products/product29.jpg",
    "reviews": 60,
    "rating": 4
  },
  {
    "id": 24,
    "title": "Amrutanjan Pain Balm",
    "description": "Effective for headache, cold, and back pain relief.",
    "price": 30.0,
    "image": "../assets/products/product30.jpg",
    "reviews": 95,
    "rating": 5
  },
  {
    "id": 25,
    "title": "Dabur Honitus Cough Syrup",
    "description": "Ayurvedic cough syrup for soothing relief from cough.",
    "price": 85.0,
    "image": "../assets/products/product31.jpg",
    "reviews": 55,
    "rating": 4
  },
  {
    "id": 26,
    "title": "Dabur Red Toothpaste 100g",
    "description": "Ayurvedic toothpaste for strong and healthy teeth.",
    "price": 50.0,
    "image": "../assets/products/product32.jpg",
    "reviews": 200,
    "rating": 4
  },
  {
    "id": 27,
    "title": "Burnol Cream 20g",
    "description": "Antiseptic cream for burn wounds and cuts.",
    "price": 45.0,
    "image": "../assets/products/product33.jpg",
    "reviews": 30,
    "rating": 4
  },
  {
    "id": 28,
    "title": "Betadine Solution 100ml",
    "description": "Antiseptic for wound cleaning and disinfection.",
    "price": 100.0,
    "image": "../assets/products/product34.jpg",
    "reviews": 130,
    "rating": 4
  },
  {
    "id": 29,
    "title": "Combiflam Tablet",
    "description": "Pain relief and anti-inflammatory tablet.",
    "price": 20.0,
    "image": "../assets/products/product35.jpg",
    "reviews": 110,
    "rating": 4
  },
  {
    "id": 30,
    "title": "Electral Powder Sachet",
    "description": "Rehydration solution for electrolyte balance.",
    "price": 12.0,
    "image": "../assets/products/product36.jpg",
    "reviews": 250,
    "rating": 5
  }
]
;

const uploadProducts = async () => {
  const productsCollection = collection(db, 'products'); // reference to 'products' collection

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