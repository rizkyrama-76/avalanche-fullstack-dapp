const connectBtn = document.getElementById("connectBtn");
const statusEl = document.getElementById("status");
const addressEl = document.getElementById("address");
const networkEl = document.getElementById("network");
const balanceEl = document.getElementById("balance");

// Avalanche Fuji Testnet chainId (hex)
const AVALANCHE_FUJI_CHAIN_ID = "0xa869";

let isConnected = false;
let currentAddress = null;

function formatAvaxBalance(balanceWei) {
  const balance = parseInt(balanceWei, 16);
  return (balance / 1e18).toFixed(4);
}

function shortenAddress(address) {
  return address.slice(0, 6) + "..." + address.slice(-4);
}

// RESET UI (Disconnect versi frontend)
function disconnectWallet() {
  isConnected = false;
  currentAddress = null;

  statusEl.textContent = "Disconnected ❌";
  statusEl.style.color = "#e84118";
  addressEl.textContent = "-";
  networkEl.textContent = "-";
  balanceEl.textContent = "-";

  connectBtn.textContent = "Connect Wallet";
}

// CONNECT WALLET
async function connectWallet() {
  if (typeof window.ethereum === "undefined") {
    statusEl.textContent = "Wallet Not Found ❌";
    alert("Core Wallet tidak terdeteksi. Silakan install Core Wallet.");
    return;
  }

  try {
    statusEl.textContent = "Connecting...";

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    currentAddress = accounts[0];
    isConnected = true;

    addressEl.textContent = shortenAddress(currentAddress);
    connectBtn.textContent = "Disconnect Wallet";

    const chainId = await window.ethereum.request({
      method: "eth_chainId",
    });

    if (chainId === AVALANCHE_FUJI_CHAIN_ID) {
      networkEl.textContent = "Avalanche Fuji Testnet";
      statusEl.textContent = "Connected ✅";
      statusEl.style.color = "#4cd137";

      const balanceWei = await window.ethereum.request({
        method: "eth_getBalance",
        params: [currentAddress, "latest"],
      });

      balanceEl.textContent = formatAvaxBalance(balanceWei);
    } else {
      networkEl.textContent = "Wrong Network ❌";
      statusEl.textContent = "Please switch to Avalanche Fuji";
      statusEl.style.color = "#fbc531";
      balanceEl.textContent = "-";
    }
  } catch (error) {
    console.error(error);
    statusEl.textContent = "Connection Failed ❌";
    statusEl.style.color = "red";
  }
}

// BUTTON TOGGLE
connectBtn.addEventListener("click", () => {
  if (isConnected) {
    disconnectWallet();
  } else {
    connectWallet();
  }
});

// LISTEN EVENTS
if (window.ethereum) {
  window.ethereum.on("accountsChanged", (accounts) => {
    if (accounts.length === 0) {
      disconnectWallet();
    } else if (isConnected) {
      currentAddress = accounts[0];
      addressEl.textContent = shortenAddress(currentAddress);
    }
  });

  window.ethereum.on("chainChanged", () => {
    window.location.reload();
  });
}
