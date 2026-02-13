"use client";

import { Button } from "@/components/ui/button";
import { useWeb3 } from "@/context/Web3Context";

export default function WalletConnect() {
  const { walletAddress, connectWallet } = useWeb3();

  return (
    <Button
      size="lg"
      onClick={connectWallet}
      className="mt-4 bg-yellow-400 text-black hover:bg-yellow-300 cursor-pointer py-4 px-10 font-semibold"
    >
      {walletAddress
        ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
        : "Connect Wallet"}
    </Button>
  );
}

