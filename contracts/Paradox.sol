// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, ebool, euint32} from "@fhevm/solidity/lib/FHE.sol";
import {SepoliaConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

/// @title Paradox
/// @author Paradox
/// @notice Generates encrypted random numbers and compares their sum to the target value 24.
contract Paradox is SepoliaConfig {
    uint8 private constant _NUMBERS_PER_ROUND = 4;
    uint32 private constant _MIN_VALUE = 1;
    uint32 private constant _MAX_VALUE = 20;

    struct Game {
        euint32[4] numbers;
        bool hasNumbers;
        euint32 lastResult;
        bool hasResult;
        uint8 firstIndex;
        uint8 secondIndex;
        uint256 round;
    }

    mapping(address player => Game game) private _games;
    mapping(address player => uint256 nonce) private _nonces;

    event GameStarted(address indexed player, uint256 round);
    event ResultComputed(
        address indexed player,
        uint256 round,
        uint8 firstIndex,
        uint8 secondIndex,
        euint32 encryptedDifference
    );

    /// @notice Starts a new game round for the sender and returns the encrypted numbers.
    /// @return numbers The four encrypted random numbers generated for the round.
    function startGame() external returns (euint32[4] memory numbers) {
        Game storage game = _games[msg.sender];

        for (uint8 i = 0; i < _NUMBERS_PER_ROUND; i++) {
            uint32 plainValue = _drawRandom(msg.sender);
            euint32 encryptedValue = FHE.asEuint32(plainValue);

            game.numbers[i] = encryptedValue;
            FHE.allowThis(encryptedValue);
            FHE.allow(encryptedValue, msg.sender);
            numbers[i] = encryptedValue;
        }

        game.hasNumbers = true;
        game.hasResult = false;
        game.firstIndex = 0;
        game.secondIndex = 0;
        game.round += 1;

        emit GameStarted(msg.sender, game.round);
    }

    /// @notice Returns the encrypted numbers for a given player.
    /// @param player The address of the player.
    /// @return numbers The four encrypted numbers stored for the player.
    function getEncryptedNumbers(address player) external view returns (euint32[4] memory numbers) {
        Game storage game = _games[player];
        if (!game.hasNumbers) {
            return numbers;
        }

        for (uint8 i = 0; i < _NUMBERS_PER_ROUND; i++) {
            numbers[i] = game.numbers[i];
        }
    }

    /// @notice Submits two indices to compare their sum with 24 and returns the encrypted difference.
    /// @param firstIndex The index of the first number (0-3).
    /// @param secondIndex The index of the second number (0-3).
    /// @return encryptedDifference The encrypted absolute difference between the sum and 24.
    function submitGuess(uint8 firstIndex, uint8 secondIndex) external returns (euint32 encryptedDifference) {
        Game storage game = _games[msg.sender];
        require(game.hasNumbers, "Game not started");
        require(firstIndex < _NUMBERS_PER_ROUND && secondIndex < _NUMBERS_PER_ROUND, "Index out of range");
        require(firstIndex != secondIndex, "Indices must differ");

        euint32 firstValue = game.numbers[firstIndex];
        euint32 secondValue = game.numbers[secondIndex];
        euint32 sum = FHE.add(firstValue, secondValue);
        euint32 target = FHE.asEuint32(24);

        ebool isSumGreater = FHE.gt(sum, target);
        euint32 diffIfGreater = FHE.sub(sum, target);
        euint32 diffIfLower = FHE.sub(target, sum);
        encryptedDifference = FHE.select(isSumGreater, diffIfGreater, diffIfLower);

        FHE.allowThis(encryptedDifference);
        FHE.allow(encryptedDifference, msg.sender);

        game.lastResult = encryptedDifference;
        game.hasResult = true;
        game.firstIndex = firstIndex;
        game.secondIndex = secondIndex;

        emit ResultComputed(msg.sender, game.round, firstIndex, secondIndex, encryptedDifference);
    }

    /// @notice Returns the encrypted result of the last comparison for a player.
    /// @param player The address of the player.
    /// @return result The encrypted difference of the last submission.
    /// @return hasResult Flag indicating whether a result is available.
    /// @return firstIndex The first index used in the last submission.
    /// @return secondIndex The second index used in the last submission.
    /// @return round The round number associated with the result.
    function getLastResult(
        address player
    )
        external
        view
        returns (euint32 result, bool hasResult, uint8 firstIndex, uint8 secondIndex, uint256 round)
    {
        Game storage game = _games[player];
        return (game.lastResult, game.hasResult, game.firstIndex, game.secondIndex, game.round);
    }

    /// @notice Returns whether a player has active numbers.
    /// @param player The address of the player.
    /// @return hasNumbers True when the player has generated numbers.
    function hasActiveNumbers(address player) external view returns (bool hasNumbers) {
        hasNumbers = _games[player].hasNumbers;
    }

    function _drawRandom(address player) private returns (uint32) {
        uint256 nonce = _nonces[player];
        _nonces[player] = nonce + 1;
        uint256 randomWord = uint256(keccak256(abi.encodePacked(blockhash(block.number - 1), block.timestamp, player, nonce)));
        uint256 ranged = (randomWord % (_MAX_VALUE - _MIN_VALUE + 1)) + _MIN_VALUE;
        return uint32(ranged);
    }
}
