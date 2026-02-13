"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import WalletConnect from "@/components/walletconnect";
import { useWeb3 } from "@/context/Web3Context";

import { Globe, Trophy, Users, Coins, Timer } from "lucide-react";
import Link from "next/link";

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="text-yellow-400">{icon}</div>
      <p className="text-sm text-zinc-400">{label}</p>
      <p className="text-xl font-semibold text-white">{value}</p>
    </div>
  );
}

export default function Home() {
  const { briVaultContract, web3, walletAddress} = useWeb3();
  const [teamsCount, setTeamsCount] = useState<string>("");
  const [TVLvalue, setTVLvalue] = useState<string>("");
  const [participants, setParticipants] = useState<string>("");
  const [getWinner, setGetWinner] = useState<string>("");
  const [eventLabel, setEventLabel] = useState("Event Starts In");
  const [eventCountdown, setEventCountdown] = useState("0d 0h 0m");

  function formatSeconds(sec: number) {
  const days = Math.floor(sec / 86400);
  const hours = Math.floor((sec % 86400) / 3600);
  const minutes = Math.floor((sec % 3600) / 60);

  return `${days}d ${hours}h ${minutes}m`;
  }

useEffect(() => {
  const fetchValues = async () => {
    if (!briVaultContract || !web3) return;

    try {
      const teamsNumber = await briVaultContract.methods.getTeamsLength().call();

      const start = Number(await briVaultContract.methods.eventStartDate().call());
      const end = Number(await briVaultContract.methods.eventEndDate().call());

     const updateCountdown = () => {
      const now = Math.floor(Date.now() / 1000);

      if (now < start) {
        setEventLabel("Event Starts In");
        const secondsLeft = start - now;
        setEventCountdown(formatSeconds(secondsLeft));
      } else if (now < end) {
        setEventLabel("Event Ends In");
        const secondsLeft = end - now;
        setEventCountdown(formatSeconds(secondsLeft));
      } else {
        setEventLabel("Event Finished");
        setEventCountdown("0d 0h 0m");
      }
    };

      const tvl = await briVaultContract.methods.totalAssets().call();
      const tvlFormatted = web3.utils.fromWei(tvl as string, "ether");

      // Participants
      const participantsCount = await briVaultContract.methods.numberOfParticipants().call();

      const winnerSet = await briVaultContract.methods._setWinner().call();

      // Update state
      setTeamsCount(teamsNumber.toString());
      setTVLvalue(tvlFormatted);
      setParticipants(participantsCount.toString());
      setGetWinner(winnerSet);

    } catch (error) {
      console.error("Failed to fetch values:", error);
    }
  };

  fetchValues();
}, [briVaultContract, web3]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white">
      
      {/* Wallet */}
      <section className="flex justify-end px-10 pt-6">
        <WalletConnect />
      </section>

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="mb-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 flex items-center justify-center gap-4">
            BriVault Tournament
            <Trophy className="h-16 w-16 text-yellow-400" />
          </h1>

          <h2 className="text-2xl font-semibold text-zinc-300">
            Predict a country to win the World Cup 2026 and earn more
          </h2>
        </div>

        {/* ACTION CARDS */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          
         <Link href="/stake">
  <Card className="bg-zinc-900 border-zinc-800 hover:scale-105 transition-transform cursor-pointer h-full">
    <CardContent className="p-6 flex flex-col justify-between h-full">
      <div>
        <Coins className="h-8 w-8 text-yellow-400" />
        <h3 className="mt-4 text-xl font-semibold text-white">
          Stake
        </h3>
        <p className="mt-2 text-zinc-400">
          Deposit tokens before the event begins and receive vault shares.
        </p>
      </div>
    </CardContent>
  </Card>
</Link>

<Link href="/choose-team">
  <Card className="bg-zinc-900 border-zinc-800 hover:scale-105 transition-transform cursor-pointer h-full">
    <CardContent className="p-6 flex flex-col justify-between h-full">
      <div>
        <Globe className="h-8 w-8 text-yellow-400" />
        <h3 className="mt-4 text-xl font-semibold text-white">
          Choose a Team
        </h3>
        <p className="mt-2 text-zinc-400">
          Pick one of 48 teams and lock your shares to that country.
        </p>
      </div>
    </CardContent>
  </Card>
</Link>

<Link href="/claim">
  <Card className="bg-zinc-900 border-zinc-800 hover:scale-105 transition-transform cursor-pointer h-full">
    <CardContent className="p-6 flex flex-col justify-between h-full">
      <div>
        <Trophy className="h-8 w-8 text-yellow-400" />
        <h3 className="mt-4 text-xl font-semibold text-white">
          Claim Winnings
        </h3>
        <p className="mt-2 text-zinc-400">
          Winners claim their proportional share of the vault.
        </p>
      </div>

      <div className="mt-6">
        {getWinner ? (
          <span className="px-3 py-1 text-sm bg-green-600 text-white rounded-full">
            Winner Set
          </span>
        ) : (
          <span className="px-3 py-1 text-sm bg-red-600 text-white rounded-full">
            Winner Not Set
          </span>
        )}
      </div>
    </CardContent>
  </Card>
</Link>

<Link href="/cancel">
  <Card className="bg-zinc-900 border-zinc-800 hover:scale-105 transition-transform cursor-pointer h-full">
    <CardContent className="p-6 flex flex-col justify-between h-full">
      <div>
        <Users className="h-8 w-8 text-yellow-400" />
        <h3 className="mt-4 text-xl font-semibold text-white">
          Cancel Participation
        </h3>
        <p className="mt-2 text-zinc-400">
          Withdraw your stake before the event starts.
        </p>
      </div>
    </CardContent>
  </Card>
</Link>


        </div>
      </section>

      {/* STATS */}
      <section className="bg-zinc-950 border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-4 gap-8 text-center">
          <Stat
            icon={<Users className="h-6 w-6" />}
            label="Participants"
            value={participants}
          />
          <Stat
            icon={<Coins className="h-6 w-6" />}
            label="TVL"
            value={`$${TVLvalue}`}
          />
         <Stat
              icon={<Timer className="h-6 w-6" />}
              label={eventLabel}
              value={eventCountdown}
            />

          <Stat
            icon={<Trophy className="h-6 w-6" />}
            label="Teams"
            value={teamsCount}
          />
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-24">
        <h2 className="text-4xl font-bold text-white">
          Ready to Compete?
        </h2>
        <p className="mt-4 text-zinc-400">
          Stake early. Choose wisely. Win on-chain.
        </p>
      </section>
    </main>
  );
}
