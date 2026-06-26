export const PRICING_MATRIX: Record<string, { symbol: string; monthly: any; annual: any }> = {
  USD: {
    symbol: '$',
    monthly: { basic: 19, pro: 49, enterprise: 99 },
    annual: { basic: 15, pro: 39, enterprise: 79 } // 20% off
  },
  EUR: {
    symbol: '€',
    monthly: { basic: 18, pro: 45, enterprise: 92 },
    annual: { basic: 14, pro: 36, enterprise: 73 }
  },
  INR: {
    symbol: '₹',
    monthly: { basic: 1499, pro: 3999, enterprise: 7999 },
    annual: { basic: 1199, pro: 3199, enterprise: 6399 }
  }
};

export const BENTO_ITEMS = [
  { id: 1, title: 'Autonomous Agents', content: 'Deploy self-healing worker nodes that analyze context, adapt to runtime exceptions, and execute multi-step workflows without human intervention.' },
  { id: 2, title: 'Edge Inference', content: 'Run compressed LLM matrices directly on user devices for zero-latency interactions and strict data privacy compliance.' },
  { id: 3, title: 'Vector Sync', content: 'Automatically map structured database rows into high-dimensional vector space for instant semantic retrieval.' },
  { id: 4, title: 'Neural Observability', content: 'Visualize token flow and attention head activations in real-time to debug complex prompt chains.' }
];
