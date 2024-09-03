
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../redux/store';
import { updateRegistrationNumber, setLength } from '../redux/lengthSlice';
import { AppDispatch } from '../redux/store';
import './style.css';
import toast from 'react-hot-toast';

interface Item {
    id: number;
    registrationNumber: string;
    isAvailable: boolean;
    parkedAt?: string; 
}

interface SpaceManagerProps {
    items: Item[];
    updateRegistrationNumber: (payload: { id: number; registrationNumber: string }) => void;
    setLength: (length: number) => void; 

}

interface SpaceManagerState {
    selectedId: number | null;
    registrationNumber: string;
    length: string; 
    registrationError: string; 
}

const REGISTRATION_REGEX = /^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/;

class SpaceManager extends Component<SpaceManagerProps, SpaceManagerState> {
    constructor(props: SpaceManagerProps) {
        super(props);
        this.state = {
            selectedId: null,
            registrationNumber: '',
            length: "", // Initialize length
            registrationError: '', 
        }
    }

    handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        this.setState({ selectedId: parseInt(event.target.value, 10) });
    };

    handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        this.setState({ 
            registrationNumber: value,
            registrationError: REGISTRATION_REGEX.test(value) ? '' : 'Invalid registration number format'
        });
    };

    handleLengthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ length: event.target.value }); // string format
    };

    handleUpdate = () => {
        const { selectedId, registrationNumber, registrationError } = this.state;
        if (selectedId === null) {
            toast.error("Please select the parking slot");
        } else if (registrationError) {
            toast.error(registrationError);
        } else {
            this.props.updateRegistrationNumber({ id: selectedId, registrationNumber });
            this.setState({ registrationNumber: '' }); 
            toast.success(`Car is parked at slot ID ${selectedId} with registration number ${registrationNumber}`);
        }
    };

    handleSetLength = () => {
        const { length } = this.state;
        const numericLength = parseInt(length, 10) || 0;
        if (numericLength === 0) {
            toast.error("Please enter a valid length");
        } else {
            this.props.setLength(numericLength);
            this.setState({ length: '' }); 
            toast.success(`Parking slots set to ${numericLength}`);
        }
    };

    handlePayAndTakeCar = (id: number) => {
        window.location.href = `/payment/${id}`;
    };

    render() {
        const { items } = this.props;
        const { selectedId, registrationNumber, length, registrationError } = this.state;

        return (
            <div className="space-manager">
                <div className="set-length-section">
                    <h2>Number of Parking Slots</h2>
                    <input
                        type="number"
                        value={length}
                        onChange={this.handleLengthChange}
                        placeholder="Enter new length"
                        className="text-input"
                    />
                    <button className="set-length-button" onClick={this.handleSetLength}>Set Length</button>
                </div>
                <h1 className="title">Parking Space Manager</h1>
                <div className="container">
                    <div className="section available-spaces">
                        <h2>Available Spaces</h2>
                        <ul>
                            {items.filter(item => item.isAvailable).map(item => (
                                <li key={item.id} className="space-item available">
                                    ID: {item.id}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="section unavailable-spaces">
                        <h2>Unavailable Spaces</h2>
                        <ul>
                            {items.filter(item => !item.isAvailable).map(item => (
                                <li key={item.id} className="space-item unavailable">
                                    ID: {item.id}, Registration Number: {item.registrationNumber}
                                    {item.parkedAt && <span>, Parked At: {new Date(item.parkedAt).toLocaleString()}</span>}
                                    <button className="pay-button" onClick={() => this.handlePayAndTakeCar(item.id)}>
                                        Pay and Take Your Car
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="update-section">
                    <h2>Park a Car</h2>
                    <div className="form-group">
                        <select onChange={this.handleSelectChange} value={selectedId ?? ''} className="select-input">
                            <option value="">Select Available Space</option>
                            {items.filter(item => item.isAvailable).map(item => (
                                <option key={item.id} value={item.id}>
                                    ID: {item.id}
                                </option>
                            ))}
                        </select>
                        <input
                            type="text"
                            value={registrationNumber}
                            onChange={this.handleInputChange}
                            placeholder="Enter Registration Number"
                            className="text-input"
                        />
                        {registrationError && <p className="error-message">{registrationError}</p>}
                        <button className="update-button" onClick={this.handleUpdate}>Park the Car</button>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    items: state.length.items,
});

const mapDispatchToProps = (dispatch: AppDispatch) => ({
    updateRegistrationNumber: (payload: { id: number; registrationNumber: string }) => dispatch(updateRegistrationNumber(payload)),
    setLength: (length: number) => dispatch(setLength(length)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SpaceManager);
