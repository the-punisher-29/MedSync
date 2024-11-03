// src/products/uploadProducts.js
import { db } from "../../config/firebase.js";
import { collection, addDoc } from "../../config/firebase.js";
import fs from 'fs';
import path from 'path';

const uploadProductsToFirestore = async () => {
  try {
    // Read JSON file from the file system
    const filePath = path.join(process.cwd(), 'public/database/products.json'); // Adjust path if needed
    const productsData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    const productsCollection = collection(db, "products");

    // Loop through each product in the JSON data and add to Firestore
    for (const product of productsData) {
      await addDoc(productsCollection, product);
      console.log(`Uploaded: ${product.title}`);
    }

    console.log("All products have been uploaded successfully!");
  } catch (error) {
    console.error("Error uploading products:", error);
  }
};

// Call the function (optional: only call if you want this to run immediately)
uploadProductsToFirestore();
