"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useWeb3 } from "@/context/Web3Context";

export default function ClaimPage() {
  const { briVaultContract, walletAddress } = useWeb3();
  const [loading, setLoading] = useState(false);

  const handleClaimRewards = async () => {
    if (!briVaultContract || !walletAddress) {
      alert("Connect wallet first");
      return;
    }

    try {
      setLoading(true);

      await briVaultContract.methods
        .getWinnerClaim()
        .send({ from: walletAddress });

      alert("Rewards claimed successfully 🎉");

    } catch (err: any) {
      console.error(err);
      alert(err?.message || "Claim failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white flex items-center justify-center px-6">
      <Card className="max-w-md w-full bg-zinc-900 border-zinc-800">
        <CardContent className="p-6">
          <h1 className="text-3xl font-bold text-center mb-6 text-white">
            Claim Rewards
          </h1>

          <div className="flex flex-col gap-4">
            <p className="text-zinc-400 text-center">
              If your selected team won the tournament,
              you can claim your proportional vault rewards.
            </p>

            <Button
              size="lg"
              onClick={handleClaimRewards}
              disabled={loading}
              className="bg-yellow-400 text-black hover:bg-yellow-300"
            >
              {loading ? "Claiming..." : "Claim Rewards"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
