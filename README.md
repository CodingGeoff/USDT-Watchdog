# USDT Watchdog

USDT Watchdog is a Next.js application designed to monitor and display the latest block information and USDT token transfers on the Ethereum blockchain. This project leverages the viem library to interact with the Ethereum network and provides real-time updates on block height, block hash, and USDT transfer events.

## Demo

Check out the live demo of the project [here](https://usdt-watchdog-k27w2yhrb-boc-lc-126coms-projects.vercel.app/).

## Features

- **Real-time Block Monitoring**: Continuously listens for new blocks and displays the latest block height and hash.
- **USDT Transfer Tracking**: Captures and displays the most recent USDT token transfer events, including transaction hash, sender, receiver, and amount.

## Technologies Used

- **Next.js**: A React framework for building server-side rendered applications.
- **TypeScript**: A statically typed superset of JavaScript.
- **viem**: A library for interacting with the Ethereum blockchain.
- **Alchemy**: A blockchain development platform providing the Ethereum node infrastructure.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/codinggeoff/usdt-watchdog.git
    cd usdt-watchdog
    ```

2. Install dependencies:

    ```bash
    npm install
    # or
    yarn install
    ```

3. Create a `.env.local` file in the root directory and add your Alchemy project ID:

    ```env
    NEXT_PUBLIC_ALCHEMY_PROJECT_ID=your-alchemy-project-id
    ```

### Running the Application

Start the development server:

```bash
npm run dev
# or
yarn dev
```

Open http://localhost:3000 with your browser to see the result.

## Project Structure
app/page.tsx: The main page component that handles block and USDT transfer monitoring.
app/layout.tsx: Custom App component to initialize global styles.
app/globals.css: Global CSS styles.

Usage
Upon running the application, you will see the latest block information and a list of recent USDT transfer events. The application updates in real-time as new blocks are mined and new USDT transfers occur.

Contributing
Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

License
This project is licensed under the MIT License. See the LICENSE file for details.

Acknowledgements
Next.js
TypeScript
viem
Alchemy
Contact
For any inquiries or feedback, please contact supergreatgeoff@gmail.com.
