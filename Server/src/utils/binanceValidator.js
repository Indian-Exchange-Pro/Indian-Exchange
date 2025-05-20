// import dotenv from 'dotenv';
// dotenv.config();

// import Binance from 'binance-api-node';
// import { HttpsProxyAgent } from 'https-proxy-agent';

// // Optional: Use proxy only if needed
// const proxyAgent = new HttpsProxyAgent('http://164.52.206.180:80');

// // Utility function to validate a Binance transaction
// export const validateBinanceTransaction = async (transactionId, expectedAmount) => {
//     console.log(transactionId,expectedAmount)
//   try {
//     const client = Binance.default({
//       apiKey: "0BR8XvTsiKSGqI8mFgylusxSHdsT3cpKjbNhetJICGPbmBKPYJPpteR9tPx8xheI",
//       apiSecret: 'zFej7VNIlvpXCm5ZfeT2Cq1PsncLxSjkzgxI3wEe1CoDvO3PExClC3NuQOmOjJYz',
//       httpAgent: proxyAgent
//     });

//     const deposits = await client.depositHistory({ limit: 1000 });

//     // Helper to normalize TxID comparison
//     const extractTransactionNumber = (txId) => {
//       const match = txId.match(/\d+$/);
//       return match ? match[0] : null;
//     };

//     const match = await deposits.find((d) => {
//       const depositTxId = extractTransactionNumber(d.txId);
//       return (
//         depositTxId === transactionId &&
//         parseFloat(d.amount) === parseFloat(expectedAmount) &&
//         d.status === 1 // 1 = Confirmed
//       );
//     });
//     console.log(match)
//     if (!match) {
//       return { isValid: false, reason: 'Transaction not found or not confirmed.' };
//     }

//     return {
//       isValid: true,
//       deposit: {
//         transactionId: extractTransactionNumber(match.txId),
//         amount: match.amount,
//         status: match.status,
//         time: new Date(match.insertTime).toISOString(),
//         destination: match.address,
//         coin: match.coin
//       }
//     };
//   } catch (error) {
//     console.error('Binance validation error:', error);
//     return { isValid: false, reason: error.message };
//   }
// };

import Binance from 'binance-api-node';
import { HttpsProxyAgent } from 'https-proxy-agent';
import axios from 'axios';

// Optional proxy (remove if not needed)
const proxyAgent = new HttpsProxyAgent('http://164.52.206.180:80');

// Hardcoded API keys (if needed here)
const API_KEY = '0BR8XvTsiKSGqI8mFgylusxSHdsT3cpKjbNhetJICGPbmBKPYJPpteR9tPx8xheI';
const API_SECRET = 'zFej7VNIlvpXCm5ZfeT2Cq1PsncLxSjkzgxI3wEe1CoDvO3PExClC3NuQOmOjJYz';

// Utility function to get time offset
const getBinanceTimeOffset = async () => {
  try {
    const response = await axios.get('https://api.binance.com/api/v3/time', {
      httpAgent: proxyAgent,
    });
    const serverTime = response.data.serverTime;
    const localTime = Date.now();
    return serverTime - localTime;
  } catch (err) {
    console.error('Failed to fetch Binance server time:', err);
    return 0;
  }
};

export const validateBinanceTransaction = async (transactionId, expectedAmount) => {
  try {
    const timeOffset = await getBinanceTimeOffset();
    const timestamp = Date.now() + timeOffset;
    console.log('⏱️ Time offset:', timeOffset, 'Adjusted timestamp:', timestamp);

    const client = Binance.default({
      apiKey: API_KEY,
      apiSecret: API_SECRET,
      httpAgent: proxyAgent,
      getTime: async () => Date.now() + timeOffset, // override internal time
    });

    // Fetch deposits
    const deposits = await client.depositHistory({ limit: 1000 });
    console.log('✅ Deposit history fetched');

    // Helper to extract numeric part from TxID
    const extractTransactionNumber = (txId) => {
      const match = txId.match(/\d+$/);
      return match ? match[0] : null;
    };

    const match = deposits.find((d) => {
      const depositTxId = extractTransactionNumber(d.txId);
      return (
        depositTxId === transactionId &&
        parseFloat(d.amount) === parseFloat(expectedAmount) &&
        d.status === 1
      );
    });

    if (!match) {
      return { isValid: false, reason: 'Transaction not found or not confirmed.' };
    }

    return {
      isValid: true,
      deposit: {
        transactionId: extractTransactionNumber(match.txId),
        amount: match.amount,
        status: match.status,
        time: new Date(match.insertTime).toISOString(),
        destination: match.address,
        coin: match.coin,
      },
    };
  } catch (error) {
    console.error('❌ Binance validation error:', error);
    return { isValid: false, reason: error.message };
  }
};

