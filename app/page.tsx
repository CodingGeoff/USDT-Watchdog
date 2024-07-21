"use client"
import React, { useState, useEffect } from 'react';
import { createPublicClient, http, parseAbiItem, formatUnits, numberToHex } from 'viem';
import { mainnet } from 'viem/chains';

const projectId = 'https://eth-mainnet.g.alchemy.com/v2/UvLI3XuOjozs1lGrpzd-B2r7o-RglwX5';
const USDT_ADDRESS = '0xdac17f958d2ee523a2206206994597c13d831ec7';
const TRANSFER_ABI = parseAbiItem('event Transfer(address indexed from, address indexed to, uint256 value)');

interface Transfer {
    blockNumber: number;
    transactionHash: string;
    from: string;
    to: string;
    value: string;
}

const Home: React.FC = () => {
    const [currentBlockHeight, setCurrentBlockHeight] = useState<number | null>(null);
    const [currentBlockHash, setCurrentBlockHash] = useState<string | null>(null);
    const [usdtTransfers, setUsdtTransfers] = useState<Transfer[]>([]);

    useEffect(() => {
        const ethClient = createPublicClient({
            chain: mainnet,
            transport: http(projectId),
        });

        const getBlockData = async () => {
            const latestBlock = await ethClient.getBlock({ blockTag: 'latest' });
            setCurrentBlockHeight(Number(latestBlock.number));
            setCurrentBlockHash(latestBlock.hash);
        };

        const watchEvents = () => {
            ethClient.watchBlockNumber({
                onBlockNumber: async (blockNumber) => {
                    if (blockNumber === undefined) {
                        setCurrentBlockHeight(null);
                        return;
                    }

                    const safeBlockNumber = blockNumber !== undefined ? Number(blockNumber) :Number(0);
                    setCurrentBlockHeight(Number(safeBlockNumber));
                    const fromblock = Number(safeBlockNumber) - 100;
                    const toblock = safeBlockNumber;
                    const fromBlock = BigInt(fromblock);
                    const toBlock = BigInt(toblock);
                    const logs = await ethClient.getLogs({
                        address: USDT_ADDRESS,
                        event: TRANSFER_ABI,
                        fromBlock,
                        toBlock,
                    });

                    const newTransfers = logs.map(log => {
                        const { from, to, value } = log.args || {};
                        return {
                            blockNumber: Number(log.blockNumber),
                            transactionHash: log.transactionHash,
                            from: from as string,
                            to: to as string,
                            value: value ? Number(formatUnits(value, 6)).toFixed(5) : '0.00000'
                        };
                    });
                    setUsdtTransfers(newTransfers);
                },
            });
        };

        getBlockData();
        watchEvents();
    }, []);

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', backgroundColor: '#f4f4f9' }}>
            <h1 style={{ color: '#333', borderBottom: '2px solid #ddd', paddingBottom: '10px' }}>Latest Block Info</h1>
            <p style={{ fontSize: '18px', color: '#555' }}>Block Height: <span style={{ fontWeight: 'bold' }}>{currentBlockHeight}</span></p>
            <p style={{ fontSize: '18px', color: '#555' }}>Block Hash: <span style={{ fontWeight: 'bold' }}>{currentBlockHash}</span></p>
            <h2 style={{ color: '#333', borderBottom: '2px solid #ddd', paddingBottom: '10px', marginTop: '20px' }}>Latest USDT Transfer Records</h2>
            {usdtTransfers.map((transfer, index) => (
                <div key={index} style={{ border: '1px solid #ddd', borderRadius: '5px', padding: '10px', marginBottom: '10px', backgroundColor: '#fff' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '5px' }}>
                        <span style={{ fontWeight: 'bold', color: '#666' }}>Transaction Hash:</span>
                        <span style={{ color: '#333' }}>{transfer.transactionHash}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '5px' }}>
                        <span style={{ fontWeight: 'bold', color: '#666' }}>From:</span>
                        <span style={{ color: '#333' }}>{transfer.from}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '5px' }}>
                        <span style={{ fontWeight: 'bold', color: '#666' }}>To:</span>
                        <span style={{ color: '#333' }}>{transfer.to}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '5px' }}>
                        <span style={{ fontWeight: 'bold', color: '#666' }}>Amount:</span>
                        <span style={{ color: '#333' }}>{transfer.value} USDT</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Home;
