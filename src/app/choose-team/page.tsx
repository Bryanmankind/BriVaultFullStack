"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { useWeb3 } from "@/context/Web3Context";
import Web3 from "web3";

const COUNTRIES = [
  // Hosts (automatic)
  "United States",
  "Mexico",
  "Canada",
  // Africa (CAF)
  "Algeria",
  "Cape Verde",
  "Egypt",
  "Ghana",
  "Ivory Coast",
  "Morocco",
  "Senegal",
  "South Africa",
  "Tunisia",

  // Asia (AFC)
  "Australia",
  "Iran",
  "Japan",
  "Jordan",
  "Qatar",
  "Saudi Arabia",
  "South Korea",
  "Uzbekistan",

  // Europe (UEFA)
  "Croatia",
  "England",
  "France",
  "Norway",
  "Portugal",

  // South America (CONMEBOL)
  "Argentina",
  "Brazil",
  "Colombia",
  "Ecuador",
  "Paraguay",
  "Uruguay",

  // Oceania (OFC)
  "New Zealand",

  // Remaining spots / playoffs (placeholder)
  "Team 1",
  "Team 2",
  "Team 3",
  "Team 4",
  "Team 5",
  "Team 6",
  "Team 7",
  "Team 8",
  "Team 9",
  "Team 10",
  "Team 11",
  "Team 12",
  "Team 13",
  "Team 14",
  "Team 15",
  "Team 16",
  "Team 17",
  "Team 18",
  "Team 19",
  "Team 20"
];


export default function ChooseTeamPage() {
  const { briVaultContract, walletAddress } = useWeb3();
  const [selectedCountry, setSelectedCountry] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // 🔐 these should come from contract reads later
  const hasJoined = false; // joined[msg.sender]
  const userCountry = null; // userToCountryId[msg.sender]

  const handleJoin = async () => {
    if (selectedCountry === null || !briVaultContract || !walletAddress) return;

    try {
      setLoading(true);

      await briVaultContract.methods
        .joinEvent(selectedCountry)
        .send({ from: walletAddress });

      console.log("Joined event with country ID:", selectedCountry);
      alert("Successfully joined the event 🚀");
    } catch (err: any) {
      console.error(err);
      alert(err?.message || "Transaction failed");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStake = () => {
    console.log("updateJoinEvent()");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white px-6 py-20">
      <h1 className="text-4xl font-bold text-center mb-4">
        Choose Your Team
      </h1>

      <p className="text-center text-zinc-400 mb-12">
        Your shares will be locked to this country for the tournament.
      </p>

      {/* COUNTRY GRID */}
      <div className="max-w-6xl mx-auto grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 text-white">
        {COUNTRIES.map((country, index) => {
          const isSelected = selectedCountry === index;
          const isUserCountry = userCountry === index;

          return (
            <Card
              key={index}
              onClick={() => !hasJoined && setSelectedCountry(index)}
              className={`cursor-pointer transition border
                ${
                  isSelected || isUserCountry
                    ? "border-yellow-400 bg-zinc-800"
                    : "border-zinc-800 bg-zinc-900 hover:border-zinc-700"
                }
                ${hasJoined && !isUserCountry ? "opacity-40 cursor-not-allowed" : ""}
              `}
            >
              <CardContent className="p-6 text-center">
                <Globe className="mx-auto h-8 w-8 text-yellow-400" />
                <h3 className="mt-4 font-semibold text-white">{country}</h3>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* ACTION BUTTON */}
      <div className="flex justify-center mt-12">
        {!hasJoined ? (
          <Button
            size="lg"
            disabled={selectedCountry === null || loading}
            onClick={handleJoin}
            className="bg-yellow-400 text-black hover:bg-yellow-300"
          >
            {loading ? "Joining..." : "Confirm Team Selection"}
          </Button>
        ) : (
          <Button
            size="lg"
            onClick={handleUpdateStake}
            className="bg-yellow-400 text-black hover:bg-yellow-300"
          >
            Update Stake
          </Button>
        )}
      </div>
    </div>
  );
}

export { ChooseTeamPage as ChooseTeam };
