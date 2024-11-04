# MedSync Project

MedSync is a web application that provides a seamless experience for users to manage their medical needs, including product listings, services, and user authentication.

## Getting Started

To run the project locally, follow these steps:

### Prerequisites

- **Node Version Manager (NVM)**: Make sure you have NVM installed on your machine. NVM allows you to easily manage multiple versions of Node.js.
  
- **Reason for Downgrading Node.js**: Due to compatibility issues with certain packages in the MedSync project, it is necessary to downgrade Node.js to version 16. Using this version ensures that all dependencies function correctly, particularly those that may not be fully compatible with later versions of Node.js. This step is crucial to avoid errors during installation and runtime, especially related to the `cracko` package and other dependencies that may have known issues with newer Node versions.


### Steps to Run the Project Locally

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/MedSync.git
   cd MedSync
Delete the node_modules Folder If you've previously installed dependencies, it's a good idea to start fresh:

bash
Copy code
rm -rf node_modules
Downgrade Node Version Use NVM to switch to Node.js version 16:

bash
Copy code
nvm install 16
nvm use 16
Install Dependencies Run the following command to install the required packages:

bash
Copy code
npm install
Start the Development Server Now you can start the application with:

bash
Copy code
npm start
Open the Application Once the server is running, open your browser and go to http://localhost:3000 to view the application.


Features

User authentication with Google sign-in
Product listings from Firestore
Responsive design using Chakra UI
Ability to register for events

Technologies Used
React
Firebase (Firestore for database)
Chakra UI
React Reveal for animations

Troubleshooting
If you encounter any issues related to package versions or dependencies, ensure that you have followed the steps carefully, especially downgrading the Node.js version to 16.
