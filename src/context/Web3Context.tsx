"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Web3 from "web3";
import { Contract } from "web3-eth-contract";
import {
  briVaultABI,
  briVaultAddress,
  USDCtokenAddress,
  USDCtokenABI,
} from "@/briVaultAbi/briVaultABI";

interface Web3ContextType {
  web3: Web3 | null;
  briVaultContract: Contract | null;
  USDCtokenContract: Contract | null;
  walletAddress: string | null;
  connectWallet: () => Promise<void>;
}

const Web3Context = createContext<Web3ContextType | null>(null);

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [briVaultContract, setBriVaultContract] = useState<Contract | null>(null);
  const [USDCtokenContract, setUSDCtokenContract] = useState<Contract | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const connectWallet = async () => {
    if (!(window as any).ethereum) {
      alert("Please install MetaMask");
      return;
    }

    try {
      const web3Instance = new Web3((window as any).ethereum);

      const accounts = await (window as any).ethereum.request({
        method: "eth_requestAccounts",
      });

      const account = accounts[0];

      // BriVault contract
      const briVaultInstance = new web3Instance.eth.Contract(
        briVaultABI,
        briVaultAddress
      );

      // USDC contract
      const usdcInstance = new web3Instance.eth.Contract(
        USDCtokenABI,
        USDCtokenAddress
      );

      setWeb3(web3Instance);
      setWalletAddress(account);
      setBriVaultContract(briVaultInstance);
      setUSDCtokenContract(usdcInstance);

      console.log("Connected:", account);
    } catch (error) {
      console.error("Wallet connection failed:", error);
    }
  };

  // Auto reconnect
  useEffect(() => {
    if ((window as any).ethereum) {
      (window as any).ethereum
        .request({ method: "eth_accounts" })
        .then((accounts: string[]) => {
          if (accounts.length > 0) connectWallet();
        });

      // Handle account change
      (window as any).ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
        } else {
          setWalletAddress(null);
        }
      });

      // Handle network change
      (window as any).ethereum.on("chainChanged", () => {
        window.location.reload();
      });
    }
  }, []);

  return (
    <Web3Context.Provider
      value={{
        web3,
        briVaultContract,
        USDCtokenContract,
        walletAddress,
        connectWallet,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error("useWeb3 must be used within Web3Provider");
  }
  return context;
};
