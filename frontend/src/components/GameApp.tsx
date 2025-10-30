import { useEffect, useMemo, useState } from 'react';
import { Contract } from 'ethers';
import { useAccount, useReadContract } from 'wagmi';

import { useEthersSigner } from '../hooks/useEthersSigner';
import { useZamaInstance } from '../hooks/useZamaInstance';
import { CONTRACT_ABI, CONTRACT_ADDRESS } from '../config/contracts';
import '../styles/GameApp.css';

type EncryptedNumbers = readonly string[] | undefined;

export function GameApp() {
  const { address, isConnected } = useAccount();
  const signerPromise = useEthersSigner();
  const { instance, isLoading: isZamaLoading } = useZamaInstance();

  const [isStarting, setIsStarting] = useState(false);
  const [isDecryptingNumbers, setIsDecryptingNumbers] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDecryptingResult, setIsDecryptingResult] = useState(false);
  const [decryptedNumbers, setDecryptedNumbers] = useState<number[] | null>(null);
  const [decryptedDifference, setDecryptedDifference] = useState<number | null>(null);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [statusMessage, setStatusMessage] = useState<string>('');

  const { data: hasNumbersData, refetch: refetchHasNumbers } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'hasActiveNumbers',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      refetchOnWindowFocus: false,
    },
  });

  const hasNumbers = Boolean(hasNumbersData);

  const {
    data: encryptedNumbers,
    refetch: refetchNumbers,
  } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getEncryptedNumbers',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && hasNumbers,
      refetchOnWindowFocus: false,
    },
  });

  const {
    data: lastResult,
    refetch: refetchResult,
  } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getLastResult',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && hasNumbers,
      refetchOnWindowFocus: false,
    },
  });

  const resultTuple = useMemo(() => {
    if (!lastResult) {
      return undefined;
    }
    return lastResult as unknown as readonly [string, boolean, bigint, bigint, bigint];
  }, [lastResult]);

  useEffect(() => {
    if (!hasNumbers) {
      setDecryptedNumbers(null);
      setSelectedIndices([]);
    }
  }, [hasNumbers]);

  useEffect(() => {
    if (!resultTuple || !resultTuple[1]) {
      setDecryptedDifference(null);
    }
  }, [resultTuple]);

  const encryptedNumberList: string[] = useMemo(() => {
    if (!encryptedNumbers) return [];
    return Array.from(encryptedNumbers as readonly string[]);
  }, [encryptedNumbers]);

  const selectedDifference = useMemo(() => {
    if (!decryptedNumbers || selectedIndices.length !== 2) {
      return null;
    }
    const [first, second] = selectedIndices;
    const sum = decryptedNumbers[first] + decryptedNumbers[second];
    return Math.abs(sum - 24);
  }, [decryptedNumbers, selectedIndices]);

  const toggleIndex = (index: number) => {
    setSelectedIndices(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      }
      if (prev.length < 2) {
        return [...prev, index];
      }
      return [prev[1], index];
    });
  };

  const handleStartGame = async () => {
    if (!isConnected) {
      alert('Please connect your wallet to start the game.');
      return;
    }

    if (!signerPromise) {
      alert('Wallet signer unavailable.');
      return;
    }

    setIsStarting(true);
    setStatusMessage('Starting a new encrypted round...');

    try {
      const signer = await signerPromise;
      if (!signer) {
        throw new Error('Unable to resolve wallet signer.');
      }

      const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      const tx = await contract.startGame();
      setStatusMessage('Waiting for confirmation...');
      await tx.wait();

      setStatusMessage('Game ready! Fetching encrypted numbers.');
      setDecryptedNumbers(null);
      setDecryptedDifference(null);
      setSelectedIndices([]);

      await Promise.all([refetchHasNumbers(), refetchNumbers(), refetchResult()]);
      setStatusMessage('');
    } catch (error) {
      console.error('Failed to start game', error);
      setStatusMessage('Failed to start game. Try again.');
    } finally {
      setIsStarting(false);
    }
  };

  const decryptHandles = async (handles: EncryptedNumbers): Promise<number[]> => {
    if (!handles || handles.length === 0) {
      throw new Error('No encrypted values to decrypt');
    }
    if (!instance || isZamaLoading) {
      throw new Error('Encryption service not ready');
    }
    if (!address) {
      throw new Error('Wallet address required for decryption');
    }
    if (!signerPromise) {
      throw new Error('Wallet signer unavailable');
    }

    const signer = await signerPromise;
    if (!signer) {
      throw new Error('Unable to resolve wallet signer');
    }

    const keypair = instance.generateKeypair();
    const handleContractPairs = handles.map(handle => ({
      handle,
      contractAddress: CONTRACT_ADDRESS,
    }));

    const startTimestamp = Math.floor(Date.now() / 1000).toString();
    const durationDays = '10';
    const contractAddresses = [CONTRACT_ADDRESS];

    const eip712 = instance.createEIP712(keypair.publicKey, contractAddresses, startTimestamp, durationDays);
    const signature = await signer.signTypedData(
      eip712.domain,
      { UserDecryptRequestVerification: eip712.types.UserDecryptRequestVerification },
      eip712.message,
    );

    const decryptedMap = await instance.userDecrypt(
      handleContractPairs,
      keypair.privateKey,
      keypair.publicKey,
      signature.replace('0x', ''),
      contractAddresses,
      address,
      startTimestamp,
      durationDays,
    );

    return handles.map(handle => {
      const value = decryptedMap[handle];
      if (value === undefined) {
        throw new Error('Missing decrypted value');
      }
      return Number(value);
    });
  };

  const handleDecryptNumbers = async () => {
    try {
      setIsDecryptingNumbers(true);
      setStatusMessage('Decrypting numbers...');
      const values = await decryptHandles(encryptedNumbers as EncryptedNumbers);
      setDecryptedNumbers(values);
      setStatusMessage('Numbers decrypted!');
    } catch (error) {
      console.error('Failed to decrypt numbers', error);
      setStatusMessage('Failed to decrypt numbers.');
    } finally {
      setIsDecryptingNumbers(false);
    }
  };

  const handleSubmitGuess = async () => {
    if (selectedIndices.length !== 2) {
      alert('Select exactly two numbers.');
      return;
    }
    if (!signerPromise) {
      alert('Wallet signer unavailable.');
      return;
    }

    setIsSubmitting(true);
    setStatusMessage('Submitting guess...');

    try {
      const signer = await signerPromise;
      if (!signer) {
        throw new Error('Unable to resolve wallet signer');
      }

      const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      const [firstIndex, secondIndex] = selectedIndices;
      const tx = await contract.submitGuess(firstIndex, secondIndex);
      setStatusMessage('Waiting for guess confirmation...');
      await tx.wait();

      setStatusMessage('Guess confirmed! Fetching result.');
      await Promise.all([refetchResult(), refetchNumbers()]);
    } catch (error) {
      console.error('Failed to submit guess', error);
      setStatusMessage('Failed to submit guess.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDecryptResult = async () => {
    if (!resultTuple || !resultTuple[1]) {
      alert('No result to decrypt yet.');
      return;
    }

    try {
      setIsDecryptingResult(true);
      setStatusMessage('Decrypting difference...');
      const values = await decryptHandles([resultTuple[0]]);
      setDecryptedDifference(values[0]);
      setStatusMessage('Difference decrypted!');
    } catch (error) {
      console.error('Failed to decrypt result', error);
      setStatusMessage('Failed to decrypt result.');
    } finally {
      setIsDecryptingResult(false);
    }
  };

  const disableActions = isStarting || isSubmitting || isDecryptingNumbers || isDecryptingResult;

  return (
    <div className="game-app">
      <section className="game-panel">
        <header className="game-header">
          <h2 className="game-title">Encrypted 24 Challenge</h2>
          <p className="game-subtitle">
            Generate four confidential numbers, decrypt them locally, and try to hit 24.
          </p>
        </header>

        <div className="game-actions">
          <button
            className="primary-button"
            onClick={handleStartGame}
            disabled={isStarting || !isConnected || disableActions}
          >
            {isStarting ? 'Starting...' : 'Start Game'}
          </button>
          <button
            className="secondary-button"
            onClick={handleDecryptNumbers}
            disabled={
              !hasNumbers ||
              isDecryptingNumbers ||
              disableActions ||
              !instance ||
              isZamaLoading
            }
          >
            {isDecryptingNumbers ? 'Decrypting...' : 'Decrypt Numbers'}
          </button>
        </div>

        <div className="numbers-grid">
          {Array.from({ length: 4 }).map((_, index) => {
            const encrypted = encryptedNumberList[index];
            const decrypted = decryptedNumbers?.[index];
            const isSelected = selectedIndices.includes(index);
            return (
              <button
                key={index}
                type="button"
                className={`number-card ${isSelected ? 'selected' : ''}`}
                onClick={() => toggleIndex(index)}
                disabled={!hasNumbers || disableActions}
              >
                <span className="number-index">#{index + 1}</span>
                <span className="number-value">
                  {decrypted !== undefined ? decrypted : encrypted ? 'Encrypted' : '--'}
                </span>
                {encrypted && <span className="number-hint">tap to select</span>}
              </button>
            );
          })}
        </div>

        <div className="guess-panel">
          <div className="guess-info">
            <span className="guess-label">Selected indices:</span>
            <span className="guess-value">
              {selectedIndices.length > 0 ? selectedIndices.map(i => i + 1).join(' & ') : 'None'}
            </span>
          </div>
          <div className="guess-info">
            <span className="guess-label">Local difference:</span>
            <span className="guess-value">
              {selectedDifference !== null ? selectedDifference : '???'}
            </span>
          </div>
          <button
            className="primary-button"
            onClick={handleSubmitGuess}
            disabled={selectedIndices.length !== 2 || isSubmitting || disableActions}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Guess'}
          </button>
        </div>

        <div className="result-panel">
          <h3 className="result-title">Encrypted Result</h3>
          <p className="result-description">
            The smart contract returns the encrypted absolute difference between your selected sum and 24.
          </p>

          <div className="result-details">
            <div className="result-row">
              <span className="result-label">Encrypted value:</span>
              <span className="result-value">{resultTuple && resultTuple[1] ? resultTuple[0] : 'Not available yet'}</span>
            </div>
            <div className="result-row">
              <span className="result-label">Decrypted value:</span>
              <span className="result-value">
                {decryptedDifference !== null ? decryptedDifference : 'Decrypt to reveal'}
              </span>
            </div>
            <div className="result-row">
              <span className="result-label">Indices used:</span>
              <span className="result-value">
                {resultTuple && resultTuple[1]
                  ? `#${Number(resultTuple[2]) + 1} & #${Number(resultTuple[3]) + 1}`
                  : '—'}
              </span>
            </div>
          </div>

          <button
            className="secondary-button"
            onClick={handleDecryptResult}
            disabled={
              !resultTuple ||
              !resultTuple[1] ||
              isDecryptingResult ||
              disableActions ||
              !instance ||
              isZamaLoading
            }
          >
            {isDecryptingResult ? 'Decrypting...' : 'Decrypt Result'}
          </button>
        </div>

        {statusMessage && <div className="status-banner">{statusMessage}</div>}
      </section>

      <section className="how-it-works">
        <h3>How it works</h3>
        <ol>
          <li>Start a round to mint four encrypted numbers between 1 and 20.</li>
          <li>Decrypt them locally with Zama’s relayer-enabled SDK.</li>
          <li>Select any two numbers to challenge the on-chain target of 24.</li>
          <li>Decrypt the returned difference to see how close you are.</li>
        </ol>
      </section>
    </div>
  );
}
