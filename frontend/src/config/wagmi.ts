import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: '',
  projectId: '8f3211ceea8d03b6e85f9f5c3aeca715',
  chains: [sepolia],
  ssr: false,
});
