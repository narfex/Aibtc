import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const getExchangeData = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const responses = await Promise.all([
            axios.get('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT'),
            axios.get('https://fapi.binance.com/fapi/v1/ticker/price?symbol=BTCUSDT'),
            axios.get('https://api.bybit.com/v2/public/tickers?symbol=BTCUSD'),
            axios.get('https://api.coinbase.com/v2/prices/BTC-USD/spot'),
            axios.get('https://api.kraken.com/0/public/Ticker?pair=XBTUSD'),
        ]);

        const data = [
            {
                name: 'Binance',
                spot: responses[0].data.price,
                futures: responses[1].data.price,
            },
            {
                name: 'ByBit',
                spot: responses[2].data.result[0].last_price, // Use with caution
                futures: responses[2].data.result[0].last_price, // ByBit uses perpetual contracts
            },
            {
                name: 'Coinbase',
                spot: responses[3].data.data.amount,
                futures: 'N/A', // Futures not available on Coinbase
            },
            {
                name: 'Kraken',
                spot: responses[4].data.result.XXBTZUSD.c[0],
                futures: 'N/A', // Need API key for Kraken Futures
            },
        ];

        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching exchange data:', error);
        res.status(500).json({ error: 'Failed to fetch exchange data' });
    }
};

export default getExchangeData;
