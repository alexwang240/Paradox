// Zama24Game contract deployed on Sepolia
export const CONTRACT_ADDRESS = '0x6d28d7BA60d67d0dc8D12C3B04b9ddAE5255e5F5';

// ABI copied from artifacts/contracts/Zama24Game.sol/Zama24Game.json
export const CONTRACT_ABI = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "player",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "round",
        "type": "uint256"
      }
    ],
    "name": "GameStarted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "player",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "round",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint8",
        "name": "firstIndex",
        "type": "uint8"
      },
      {
        "indexed": false,
        "internalType": "uint8",
        "name": "secondIndex",
        "type": "uint8"
      },
      {
        "indexed": false,
        "internalType": "euint32",
        "name": "encryptedDifference",
        "type": "bytes32"
      }
    ],
    "name": "ResultComputed",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "player",
        "type": "address"
      }
    ],
    "name": "getEncryptedNumbers",
    "outputs": [
      {
        "internalType": "euint32[4]",
        "name": "numbers",
        "type": "bytes32[4]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "player",
        "type": "address"
      }
    ],
    "name": "getLastResult",
    "outputs": [
      {
        "internalType": "euint32",
        "name": "result",
        "type": "bytes32"
      },
      {
        "internalType": "bool",
        "name": "hasResult",
        "type": "bool"
      },
      {
        "internalType": "uint8",
        "name": "firstIndex",
        "type": "uint8"
      },
      {
        "internalType": "uint8",
        "name": "secondIndex",
        "type": "uint8"
      },
      {
        "internalType": "uint256",
        "name": "round",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "player",
        "type": "address"
      }
    ],
    "name": "hasActiveNumbers",
    "outputs": [
      {
        "internalType": "bool",
        "name": "hasNumbers",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "startGame",
    "outputs": [
      {
        "internalType": "euint32[4]",
        "name": "numbers",
        "type": "bytes32[4]"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint8",
        "name": "firstIndex",
        "type": "uint8"
      },
      {
        "internalType": "uint8",
        "name": "secondIndex",
        "type": "uint8"
      }
    ],
    "name": "submitGuess",
    "outputs": [
      {
        "internalType": "euint32",
        "name": "encryptedDifference",
        "type": "bytes32"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;
