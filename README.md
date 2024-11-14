# MedSync

## Table of Contents
1. [Project Overview](#project-overview)
2. [Getting Started](#getting-started)
   - [Prerequisites](#prerequisites)
   - [Steps to Run the Project Locally](#steps-to-run-the-project-locally)
3. [Features](#features)
   - [User Interface](#user-interface)
   - [Admin Panel](#admin-panel)
4. [Tech Stack](#tech-stack)
5. [Why Firebase?](#why-firebase)
6. [How Firebase Handles Product Images](#how-firebase-handles-product-images)
7. [Summary](#summary)
8. [Troubleshooting](#troubleshooting)
9. [Contributing](#contributing)
10. [License](#license)
11. [Contact Information](#contact-information)

**MedSync** is a pharmacy management platform connecting patients with the IITJ PHC Pharmacy. It enables users to browse, order, and track medicines while providing admins with analytics, inventory management, and user communication tools. With Firebase as the backend, MedSync offers secure, real-time updates and efficient data handling.

## Getting Started

To run the project locally, follow these steps:

### Prerequisites
- **Node Version Manager (NVM)**: Make sure you have NVM installed on your machine. NVM allows you to easily manage multiple versions of Node.js.
  
- **Reason for Downgrading Node.js**: Due to compatibility issues with certain packages in the MedSync project, it is necessary to downgrade Node.js to version 16. Using this version ensures that all dependencies function correctly, particularly those that may not be fully compatible with later versions of Node.js. This step is crucial to avoid errors during installation and runtime, especially related to the `cracko` package and other dependencies that may have known issues with newer Node versions.


### Steps to Run the Project Locally

1. **Clone the Repository**
   ```bash
   git clone https://github.com/the-punisher-29/MedSync.git
   cd MedSync
   ```

2.**Delete the node_modules Folder If you've previously installed dependencies, it's a good idea to start fresh:**
   ```bash
   rm -rf node_modules
   ```

3.**Downgrade Node Version Use NVM to switch to Node.js version 16:**
   ```bash
   nvm install 16
   nvm use 16
   ```

4.**Install Dependencies Run the following command to install the required packages:**
   ```bash
   npm install
   ```


5.**Start the Development Server Now you can start the application with:**
   
  ```bash
  npm start
  ```

6.**Open the Application Once the server is running, open your browser and go to http://localhost:3000 to view the application.**

## Features

### User Interface
1. **Medicine Ordering**: Users can browse medicines, add items to a cart, and proceed with checkout.
2. **UPI QR Payments**: Seamless payments through UPI with QR code generation and payment screenshot upload for verification.
3. **Order Tracking**: Users can view the status and history of their orders for easy reordering.
4. **User Feedback**: A contact form allows direct communication with the pharmacy; users can also leave reviews in their profiles.
5. **Profile Management**: Users can view and edit personal details, access their order history, and manage reviews.

### Admin Panel
1. **Analytics and Reporting**: Visual analytics on medicine stock, expiry, and sales trends.
2. **Order Management**: View and update order statuses to keep users informed.
3. **Stock Management**: Modify medicine quantities, update expiration dates, and mark medicines as available/unavailable.
4. **User Contact Management**: Access and respond to messages from users to maintain communication.
5. **Sales History**: Track recent sales and identify trends in medicine usage.

## Tech Stack

- **Frontend**: React, Tailwind CSS, React-Router for navigation, Chakra UI (Admin Panel), React Icons.
- **Backend**: Firebase Authentication, Firestore (NoSQL), Firebase Storage for profile pictures and payment confirmations.
- **Data Visualization**: Chart.js / React-Chart.js for visual analytics in the admin panel.

## Why Firebase?

1. **Real-Time Synchronization:** Firestore's real-time data sync ensures that updates to stock, orders, and messages are immediately reflected across all devices, keeping the Medsync platform up-to-date at all times.
2. **Scalability**:  Firebase's infrastructure is built to scale effortlessly, accommodating an increasing number of users and growing data without compromising performance.
3. **Schema Flexibility**:As a NoSQL database, Firestore allows for rapid adjustments to the database schema, facilitating seamless updates and flexibility as Medsync evolves.
4. **Offline Support**: : Firebase offers offline support, allowing users to access the platform and perform key actions even with inconsistent internet connectivity.
5. **Security and Access Control**: With Firebase's built-in security rules, the app ensures that only authorized users, such as admins, have access to sensitive data, providing robust security for both users and administrators.
6. **Cost-Effective**: The pay-as-you-go model ensures that Medsync only pays for the resources it uses, making Firebase an economical choice that scales with the project’s growth.

## How Firebase handles product images?

1. **Cloud Storage:** Firebase Cloud Storage is used to upload and store media files. This service automatically scales with the storage requirements, making it suitable for storing product images and other media assets related to the products in your database.
2. **Storing as BLOBs:** Files like images are stored as binary data. In this case, the images (e.g., product images or service icons) are converted into a byte array (BLOB format) before being stored in Firebase Cloud Storage.
3. **Referencing Images:** The image URLs (the path to these files in Firebase Storage) are typically stored in your Firestore database or Realtime Database as part of your product's attributes. These URLs can then be referenced in your application, allowing you to retrieve and display images dynamically.

## Summary

MedSync brings efficiency to pharmacy management by offering a robust user interface and powerful backend solutions. Using Firebase, it leverages real-time data handling, secure authentication, and flexible scalability—making it ideal for a healthcare-focused platform.


### Troubleshooting
- If you encounter any issues related to package versions or dependencies, ensure that you have followed the steps carefully, especially downgrading the Node.js version to 16.
