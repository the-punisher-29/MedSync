# MedSync

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

1. **Real-Time Sync**: Firestore offers real-time updates for stock, orders, and messages.
2. **Scalability**: Effortlessly handles growth in data and users.
3. **Schema Flexibility**: NoSQL design allows easy adjustments to data structure without downtime.
4. **Offline Support**: Ensures reliable access for users even with inconsistent connectivity.
5. **Security**: Secure access control, limiting admin privileges to authorized emails.
6. **Cost-Effective**: Pay-as-you-go model keeps the platform budget-friendly while scaling.

## Summary

MedSync brings efficiency to pharmacy management by offering a robust user interface and powerful backend solutions. Using Firebase, it leverages real-time data handling, secure authentication, and flexible scalability—making it ideal for a healthcare-focused platform.


### Troubleshooting
- If you encounter any issues related to package versions or dependencies, ensure that you have followed the steps carefully, especially downgrading the Node.js version to 16.
