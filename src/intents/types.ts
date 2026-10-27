/** A 1Click quote response, including the fields the manager key signs. */
export interface OneClickQuoteResponse {
  quote: {
    amountIn: string;
    amountInFormatted: string;
    amountInUsd: string;
    minAmountIn: string;
    amountOut: string;
    amountOutFormatted: string;
    amountOutUsd: string;
    minAmountOut: string;
    timeEstimate?: number;
    refundFee?: string;
    withdrawFee?: string;
    depositAddress?: string;
    depositMemo?: string;
    deadline?: string;
    timeWhenInactive?: string;
  };
  quoteRequest: {
    dry: boolean;
    depositMode?: string;
    swapType: string;
    slippageTolerance: number;
    originAsset: string;
    depositType: string;
    destinationAsset: string;
    amount: string;
    refundTo: string;
    refundType: string;
    recipient: string;
    recipientType: string;
    deadline: string;
    confidentiality?: string;
    quoteWaitingTimeMs?: number;
    insured?: boolean;
    referral?: string;
    virtualChainRecipient?: string;
    virtualChainRefundRecipient?: string;
    customRecipientMsg?: string;
    appFees?: { recipient: string; fee: number }[];
  };
  signature: string;
  timestamp: string;
  correlationId: string;
}

export const ZEC_ASSET = "nep141:zec.omft.near";

/** Published 1Click manager key. See defuse-protocol/one-click-sdk-typescript. */
export const ONE_CLICK_MANAGER_PUB_KEY =
  "ed25519:reYaWhvwu8Jzo3WUM3zhn6VrhuMEF4eADL17qtRVifc";

export interface OriginAsset {
  id: string;
  label: string;
  chain: string;
  asset: string;
  decimals: number;
  placeholder: string;
}

export const ORIGINS: OriginAsset[] = [
  {
    id: "base-usdc",
    label: "USDC on Base",
    chain: "Base",
    asset: "nep141:base-0x833589fcd6edb6e08f4c7c32d4f71b54bda02913.omft.near",
    decimals: 6,
    placeholder: "0x…",
  },
  {
    id: "sol-usdc",
    label: "USDC on Solana",
    chain: "Solana",
    asset: "nep141:sol-5ce3bf3a31af18be40ba30f721101b4341690186.omft.near",
    decimals: 6,
    placeholder: "Solana address",
  },
  {
    id: "sol",
    label: "SOL",
    chain: "Solana",
    asset: "nep141:sol.omft.near",
    decimals: 9,
    placeholder: "Solana address",
  },
];
