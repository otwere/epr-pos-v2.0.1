import axios from 'axios';
import { useState } from 'react';

const MpesaPayment = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handlePayment = async () => {
        setLoading(true);
        setMessage('');

        try {
            const response = await axios.post('/api/stk-push', {
                phoneNumber,
                amount: parseFloat(amount),
            });

            setMessage('Payment initiated successfully!'); // Handle success message
        } catch (error) {
            setMessage('Error initiating payment'); // Handle error message
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>M-Pesa Payment</h2>
            <input
                type="text"
                placeholder="Phone Number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
            />
            <button onClick={handlePayment} disabled={loading}>
                {loading ? 'Processing...' : 'Pay with M-Pesa'}
            </button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default MpesaPayment;
