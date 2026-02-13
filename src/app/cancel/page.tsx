"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useWeb3 } from "@/context/Web3Context";

export default function CancelPage() {
  const { briVaultContract, walletAddress } = useWeb3();
  const [loading, setLoading] = useState(false);

  const handleCancelParticipation = async () => {
    if (!briVaultContract || !walletAddress) {
      alert("Connect wallet first");
      return;
    }

    try {
      setLoading(true);

      await briVaultContract.methods
        .cancelParticipation()
        .send({
          from: walletAddress,
        });

      alert("Participation cancelled successfully ❌");
    } catch (error: unknown) {
      console.error(error);

      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Cancellation failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white flex items-center justify-center px-6">
      <Card className="max-w-md w-full bg-zinc-900 border-zinc-800">
        <CardContent className="p-6">
          <h1 className="text-3xl font-bold text-center mb-6 text-white">
            Cancel Participation
          </h1>

          <div className="flex flex-col gap-4">
            <p className="text-zinc-400 text-center">
              You can withdraw your stake before the event starts.
              This action cannot be undone.
            </p>

            <Button
              size="lg"
              onClick={handleCancelParticipation}
              disabled={loading || !walletAddress}
              className="bg-red-500 text-white hover:bg-red-400 disabled:opacity-50"
            >
              {loading ? "Processing..." : "Cancel Participation"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
