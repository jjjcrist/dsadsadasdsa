import React from 'react';
import { createRoot } from 'react-dom/client';
import { createAppKit } from '@reown/appkit';
import { mainnet, bsc } from '@reown/appkit/networks';
import { EthersAdapter } from '@reown/appkit-adapter-ethers';
import MyDApp from './components/MyDApp';
import './styles.css';



// 1. Get projectId at https://cloud.reown.com
const projectId = '9bbae8b57e70527ed45720c911751924'; // Replace with your actual project ID

// 2. Create your application's metadata object
const metadata = {
  name: 'My Website',
  description: 'My Website description',
  url: 'https://mywebsite.com', // URL must match your domain & subdomain
  icons: ['https://avatars.mywebsite.com/'], // Add your custom icon URL
};

// 3. Create a AppKit instance
const modal = createAppKit({
  adapters: [new EthersAdapter()],
  metadata,
  networks: [mainnet, bsc],
  projectId,
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
  },
});

// Expose modal to the global context
window.modal = modal;

// Render the React application
const root = createRoot(document.getElementById('root'));
root.render(<MyDApp />);
