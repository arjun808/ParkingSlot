
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../redux/store';
import { updateRegistrationNumber, setLength } from '../redux/lengthSlice';
import { AppDispatch } from '../redux/store';
import './style.css';
import toast from 'react-hot-toast';
import IconButton from '@mui/material/Button';
import AlarmIcon from '@mui/icons-material/Alarm';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

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
    filterText:string
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
            filterText:"",
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
        this.setState({ length: event.target.value });
    };


    handleUpdate = async () => {
        const { selectedId, registrationNumber, registrationError } = this.state;
        if (selectedId === null) {
            toast.error("Please select the parking slot");
        } else if (registrationError) {
            toast.error(registrationError);
        } else {
            this.props.updateRegistrationNumber({ id: selectedId, registrationNumber });
            if (this.state.registrationNumber !== '') {
                this.setState({ registrationNumber: '' }); 
                toast.success(`Car is parked at slot ID ${selectedId} with registration number ${registrationNumber}`);
            }
        }
    };
    
    handleTime=()=>{
        toast(`${new Date()}`)
     
    }
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
    handleInputChange2 = (e:any) => {
        this.setState({ filterText: e.target.value });
      };
    render() {
        const { items } = this.props;
        const { selectedId, registrationNumber, length, registrationError,filterText } = this.state;
        const filteredItems = items.filter(
            (item) => !item.isAvailable && item.id.toString().includes(filterText)
          );
          
        return (
            <div className="space-manager">
                <div className="set-length-section">
                    <h2>Number of Parking Slots</h2>
                    <IconButton onClick={this.handleTime} color="secondary" aria-label="add an alarm">
                    <AlarmIcon />
                  </IconButton>
                    <input
                        type="number"
                        value={length}
                        onChange={this.handleLengthChange}
                        placeholder="Enter new length"
                        className="text-input"
                    />
                    <Button variant="contained" color="success" onClick={this.handleSetLength}>Set Length</Button>
                </div>
                <h1 className="title">Parking Space Manager</h1>
              
                <div className="container">
                    <div className="section available-spaces">
                        <h2>Available Spaces</h2>
                        <div className='available_grid'>
                            {items.filter(item => item.isAvailable).map(item => (
                                <div key={item.id} className="space-item available">
                                    ID: {item.id}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="section unavailable-spaces">
                        <h2>Unavailable Spaces</h2>
                        <input type="text" value={filterText} onChange={this.handleInputChange2} placeholder="Filter by Slot_id" />
                        <ul>
                       
                        {filteredItems.length>0 && filteredItems.map((item) => (
            <Card key={item.id} variant="outlined">
              <React.Fragment>
                <CardContent>
                  <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
                    
                  </Typography>
                  <Typography variant="h5" component="div">
                    {`Registration Number: ${item.registrationNumber}`}
                  </Typography>
                  <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>{`Parking ID: ${item.id}`}</Typography>
                  <Typography variant="body2">
                    {item.parkedAt && <span>Parked At: {new Date(item.parkedAt).toLocaleString()}</span>}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    onClick={() => this.handlePayAndTakeCar(item.id)}
                    variant="contained"
                    color="success"
                    size="small"
                  >
                    Payment
                  </Button>
                </CardActions>
              </React.Fragment>
            </Card>
          ))}
          {
            filteredItems.length===0 &&<div>Sorry Car with {filterText} slotId is not Parked hear  </div>
          }
                         
                            
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

const mapDispatchToProps = (dispatch: any) => ({
    updateRegistrationNumber: (payload: { id: number; registrationNumber: string }) => dispatch(updateRegistrationNumber(payload)),
    setLength: (length: number) => dispatch(setLength(length)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SpaceManager);
