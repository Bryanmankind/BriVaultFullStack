"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useWeb3 } from "@/context/Web3Context";
import Web3 from "web3";

export default function StakePage() {
  const { briVaultContract, USDCtokenContract, walletAddress } = useWeb3();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleStake = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!briVaultContract || !USDCtokenContract || !walletAddress) {
      alert("Connect wallet first");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      alert("Enter a valid amount");
      return;
    }

    try {
      setLoading(true);

      const amountInWei = Web3.utils.toWei(amount, "ether");

      const allowance = await USDCtokenContract.methods
        .allowance(walletAddress, briVaultContract.options.address)
        .call();

      if (BigInt(String(allowance)) < BigInt(amountInWei)) {
        await USDCtokenContract.methods
          .approve(briVaultContract.options.address, amountInWei)
          .send({ from: walletAddress });
      }

      const hasJoined: boolean = await briVaultContract.methods
        .joined(walletAddress)
        .call();

      if (hasJoined) {
        await briVaultContract.methods
          .deposit(amountInWei, walletAddress)
          .send({ from: walletAddress });

        await briVaultContract.methods
          .updateJoinEvent()
          .send({ from: walletAddress });
      } else {
        await briVaultContract.methods
          .deposit(amountInWei, walletAddress)
          .send({ from: walletAddress });
      }

      alert("Stake successful 🚀");
      setAmount("");
    } catch (err: any) {
      console.error(err);
      alert(err?.message || "Transaction failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white flex items-center justify-center px-6">
      <Card className="max-w-md w-full bg-zinc-900 border-zinc-800">
        <CardContent className="p-6">
          <h1 className="text-3xl font-bold text-center mb-6 text-white">
            Stake Tokens
          </h1>

          <form onSubmit={handleStake} className="flex flex-col gap-4">
            <input
              type="number"
              min="0"
              step="any"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-3 rounded bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />

            <Button
              type="submit"
              size="lg"
              disabled={loading}
              className="bg-yellow-400 text-black hover:bg-yellow-300"
            >
              {loading ? "Processing..." : "Stake"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
