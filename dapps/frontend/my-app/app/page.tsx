"use client";

import { useState } from "react";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useReadContract,
  useWriteContract,
  useBalance,
  useChainId,
} from "wagmi";
import { injected } from "wagmi/connectors";
import { avalancheFuji } from "wagmi/chains";
import type { Address } from "viem";
import { formatUnits } from "viem";

// ==============================
// 🔹 CONFIG
// ==============================
const CONTRACT_ADDRESS = "0x25790fb416203fe2ec24cf2d79ddb36dea9cbf89";

const SIMPLE_STORAGE_ABI = [
  {
    inputs: [],
    name: "getValue",
    outputs: [{ type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "_value", type: "uint256" }],
    name: "setValue",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export default function Page() {
  // ==============================
  // 🔹 WALLET
  // ==============================
  const { address, isConnected } = useAccount();
  const { connect, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();

  const { data: balance } = useBalance({
    address: address as Address,
    query: {
      enabled: Boolean(address),
    },
  });

  // ==============================
  // 🔹 CONTRACT
  // ==============================
  const [inputValue, setInputValue] = useState("");

  const {
    data: value,
    isLoading,
    refetch,
  } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: SIMPLE_STORAGE_ABI,
    functionName: "getValue",
  });

  const { writeContract, isPending: isWriting } = useWriteContract();

  const handleSetValue = () => {
    if (!inputValue) return;

    writeContract({
      address: CONTRACT_ADDRESS,
      abi: SIMPLE_STORAGE_ABI,
      functionName: "setValue",
      args: [BigInt(inputValue)],
    });
  };

  // ==============================
  // 🔹 UI (HTML STYLE)
  // ==============================
  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="w-full max-w-md border border-gray-700 rounded-lg p-6 space-y-4">
        <h1 className="text-xl font-bold text-center">❄️ Avalanche dApp</h1>
        <p className="text-center text-gray-400">
          Connect Wallet (Core Wallet)
        </p>

        {/* CONNECT BUTTON */}
        {!isConnected && (
          <button
            onClick={() => connect({ connector: injected() })}
            disabled={isConnecting}
            className="w-full bg-white text-black py-2 rounded"
          >
            {isConnecting ? "Connecting..." : "Connect Wallet"}
          </button>
        )}

        {/* INFO CARD */}
        <div className="border border-gray-700 rounded p-4 space-y-2 text-sm">
          <p>
            <strong>Status:</strong>{" "}
            <span className={isConnected ? "text-green-400" : "text-red-400"}>
              {isConnected ? "Connected" : "Not Connected"}
            </span>
          </p>

          <p>
            <strong>Wallet Address:</strong>
          </p>
          <p className="break-all text-xs text-gray-300">{address ?? "-"}</p>

          <p>
            <strong>Nama:</strong> RIZKY RAMADHANI
          </p>
          <p>
            <strong>NIM:</strong> 231011400486
          </p>

          <p>
            <strong>Network:</strong>{" "}
            {chainId === avalancheFuji.id ? "Avalanche Fuji" : "-"}
          </p>

          <p>
            <strong>Balance:</strong>{" "}
            {balance
              ? `${Number(formatUnits(balance.value, balance.decimals)).toFixed(
                  4
                )} AVAX`
              : "-"}
          </p>

          {isConnected && (
            <button
              onClick={() => disconnect()}
              className="text-red-400 underline text-xs pt-1"
            >
              Disconnect
            </button>
          )}
        </div>

        {/* READ CONTRACT */}
        <div className="border-t border-gray-700 pt-4">
          <p className="text-gray-400 text-sm mb-1">Contract Value (read)</p>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <p className="text-2xl font-bold">{value?.toString()}</p>
          )}
          <button
            onClick={() => refetch()}
            className="text-xs underline text-gray-300"
          >
            Refresh value
          </button>
        </div>

        {/* WRITE CONTRACT */}
        <div className="border-t border-gray-700 pt-4 space-y-2">
          <p className="text-gray-400 text-sm">Update Contract Value</p>
          <input
            type="number"
            placeholder="New value"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full p-2 rounded bg-black border border-gray-600"
          />
          <button
            onClick={handleSetValue}
            disabled={isWriting}
            className="w-full bg-blue-600 py-2 rounded"
          >
            {isWriting ? "Updating..." : "Set Value"}
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center pt-2">
          Smart contract = single source of truth
        </p>
      </div>
    </main>
  );
}
