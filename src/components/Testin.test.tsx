import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import lengthReducer, { updateRegistrationNumber,setLength } from '../redux/lengthSlice';
import SpaceManager from './Testin'; 
import '@testing-library/jest-dom';
import store from '../redux/store';
import toast from 'react-hot-toast';



jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

const mockStore = configureStore({
  reducer: {
    length: lengthReducer,
  },
  preloadedState: {
    length: {
      length: 5,
      items: [
        { id: 1, registrationNumber: '', isAvailable: true },
        { id: 2, registrationNumber: 'MH20AB1234', isAvailable: false, parkedAt: new Date().toISOString() },
      ],
    },
  },
});

describe('SpaceManager Component', () => {
test("check length updation",()=>{
  const mockDispatch=jest.fn()
  jest.spyOn(mockStore, 'dispatch').mockImplementation(mockDispatch);
  render(
    <Provider store={mockStore}>

      <SpaceManager/>
    </Provider>
)
  fireEvent.change(screen.getByPlaceholderText(/Enter new length/i), {
    target: { value: '5' }
  });
  fireEvent.click(screen.getByText(/Set Length/i));
  expect(mockDispatch).toHaveBeenCalledWith(setLength(5));
       
  const state = mockStore.getState();
  expect(state.length.length).toBe(5); 

})


  it('updates registration number and shows success message', async () => {
 
    const mockDispatch = jest.fn();
    jest.spyOn(mockStore, 'dispatch').mockImplementation(mockDispatch);

    
    render(
      <Provider store={mockStore}>
        <SpaceManager />
      </Provider>
    );

    fireEvent.change(screen.getByPlaceholderText(/Enter Registration Number/i), {
      target: { value: 'MH20AB1234' }
    });
    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: '1' }  
    });
    fireEvent.click(screen.getByText(/Park the Car/i));
    

    
    await waitFor(() => {
      expect(mockDispatch).toBeCalledWith(updateRegistrationNumber({
        id: 1,
        registrationNumber: 'MH20AB1234',
      }));
    });

   
    expect(toast.success).toHaveBeenCalledWith('Car is parked at slot ID 1 with registration number MH20AB1234');
  });
});
