const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());

const mpesaConfig = {
    consumerKey: 'YOUR_CONSUMER_KEY',
    consumerSecret: 'YOUR_CONSUMER_SECRET',
    shortcode: 'YOUR_SHORTCODE',
    lipaNaMpesaOnlineUrl: 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', // Use the live URL in production
    // Add other config as needed
};

// Function to initiate STK Push
const initiateSTKPush = async (phoneNumber, amount) => {
    const auth = Buffer.from(`${mpesaConfig.consumerKey}:${mpesaConfig.consumerSecret}`).toString('base64');

    try {
        // Step 1: Get Access Token
        const tokenResponse = await axios.get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
            headers: {
                Authorization: `Basic ${auth}`,
            },
        });

        const accessToken = tokenResponse.data.access_token;

        // Step 2: Initiate STK Push
        const stkResponse = await axios.post(mpesaConfig.lipaNaMpesaOnlineUrl, {
            BusinessShortCode: mpesaConfig.shortcode,
            Password: Buffer.from(`${mpesaConfig.shortcode}${mpesaConfig.lipaNaMpesaOnlinePassKey}${new Date().toISOString().substring(0, 19).replace(/[-:]/g, '').replace('T', '')}`).toString('base64'),
            Timestamp: new Date().toISOString().substring(0, 19).replace(/[-:]/g, '').replace('T', ''),
            TransactionType: 'CustomerPayBillOnline',
            Amount: amount,
            PartyA: phoneNumber,
            PartyB: mpesaConfig.shortcode,
            PhoneNumber: phoneNumber,
            CallBackURL: 'https://example.com/callback', // Your callback URL
            AccountReference: 'Your Account Reference',
            TransactionDesc: 'Payment for goods',
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });

        return stkResponse.data;
    } catch (error) {
        console.error('Error initiating STK Push:', error.response.data);
        throw error;
    }
};

app.post('/api/stk-push', async (req, res) => {
    const { phoneNumber, amount } = req.body;
    try {
        const response = await initiateSTKPush(phoneNumber, amount);
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error: 'Failed to initiate STK Push' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
