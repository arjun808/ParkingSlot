
import React, { Component } from 'react';
import withRouter from './WithRouter';
import './Payment.css';
import { updateRegistrationNumber } from '../redux/lengthSlice';
import { connect } from 'react-redux';
import { AppDispatch } from '../redux/store';
import toast from 'react-hot-toast';
import axios from 'axios';

interface PaymentPageProps {
    params: {
        id: string;
    };
    updateRegistrationNumber: (payload: { id: number; registrationNumber: string }) => void;
}

interface Item {
    id: number;
    registrationNumber: string;
    isAvailable: boolean;
    parkedAt?: string;
}

interface PaymentPageState {
    item: Item | undefined;
    totalAmount: number | null;
}

class PaymentPage extends Component<PaymentPageProps, PaymentPageState> {
    constructor(props: PaymentPageProps) {
        super(props);
        this.state = {
            item: undefined,
            totalAmount: null,
        };
    }

    componentDidMount(): void {
        const { id } = this.props.params;
        const items = localStorage.getItem('items');

        if (items) {
            const parsedItems: Item[] = JSON.parse(items);
            const item = parsedItems.find((item) => item.id === parseInt(id, 10));

            if (item && item.parkedAt) {
                const parkedAtDate = new Date(item.parkedAt);
                const currentDate = new Date();
                const durationMinutes = (currentDate.getTime() - parkedAtDate.getTime()) / (1000 * 60);
                const totalAmount = durationMinutes * 10;

                this.setState({ item, totalAmount });
            } else {
                this.setState({ item });
            }
        }
    }

    handleClick = async (selectedId: number) => {
        const { item, totalAmount } = this.state;

        if (item) {
            try {
                
            const result  =    await axios.post('https://httpstat.us/200', {
                    carRegistration: item.registrationNumber,
                    charge: totalAmount
                });
                console.log(result)

         
                const items = localStorage.getItem('items');
                if (items) {
                    const parsedItems: Item[] = JSON.parse(items);
                    const updatedItems = parsedItems.map(item => {
                        if (item.id === selectedId) {
                            return { ...item, isAvailable: true, registrationNumber: '', parkedAt: undefined };
                        }
                        return item;
                    });
                    localStorage.setItem('items', JSON.stringify(updatedItems));
                }

         
                this.props.updateRegistrationNumber({ id: selectedId, registrationNumber: '' });

                
                toast.success("Payment Successful");

                
                setTimeout(() => {
                    window.location.href = "/";
                }, 2000);
            } catch (error) {
                console.error("Error during payment:", error);
                toast.error("Payment failed. Please try again.");
            }
        }
    }

    render() {
        const { item, totalAmount } = this.state;

        return (
            <div className="payment-container">
                <h1 className="payment-header">Pay Your Bill</h1>
                {item !== undefined ? (
                    <div className='bill'>
                        <h6>Slot ID: {item.id}</h6>
                        <h5>Registration Number: {item.registrationNumber}</h5>
                        <h4>Total Amount: {totalAmount !== null ? totalAmount.toFixed(2) : 'Calculating...'} RS</h4>
                        <button onClick={() => { this.handleClick(item.id) }}>Pay</button>
                    </div>
                ) : (
                    <p>Loading...</p>
                )}
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch: AppDispatch) => ({
    updateRegistrationNumber: (payload: { id: number; registrationNumber: string }) => dispatch(updateRegistrationNumber(payload)),
});

export default withRouter(connect(null, mapDispatchToProps)(PaymentPage));
