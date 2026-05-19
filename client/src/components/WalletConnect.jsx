import { useState } from "react";
import { ethers } from "ethers";
import toast from "react-hot-toast";

import { shorten } from "../utils/format";

const WalletConnect = () => {
  const [address, setAddress] = useState("");

  const connectWallet = async () => {
    if (!window.ethereum) {
      toast.error("MetaMask not detected.");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      setAddress(accounts[0] || "");
      toast.success("Wallet connected.");
    } catch (error) {
      toast.error(error.message || "Wallet connection failed.");
    }
  };

  return address ? (
    <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
      {shorten(address, 6, 4)}
    </span>
  ) : (
    <button type="button" className="btn-secondary text-xs" onClick={connectWallet}>
      Connect Wallet
    </button>
  );
};

export default WalletConnect;
