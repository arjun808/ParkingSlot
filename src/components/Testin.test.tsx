import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import SpaceManager from './Testin';
import lengthReducer from '../redux/lengthSlice';
import '@testing-library/jest-dom/extend-expect';

// Mock Redux store setup
const store = configureStore({
  reducer: {
    length: lengthReducer,
  },
});

jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

describe('SpaceManager', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear previous calls to mocked functions
  });

  test('renders SpaceManager component', () => {
    render(
      <Provider store={store}>
        <SpaceManager />
      </Provider>
    );

    expect(screen.getByText('Parking Space Manager')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter new length')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter Registration Number')).toBeInTheDocument();
  });

  test('handles length input and button click', () => {
    render(
      <Provider store={store}>
        <SpaceManager />
      </Provider>
    );

    const lengthInput = screen.getByPlaceholderText('Enter new length');
    const setLengthButton = screen.getByText('Set Length');

    fireEvent.change(lengthInput, { target: { value: '10' } });
    fireEvent.click(setLengthButton);

    expect(require('react-hot-toast').success).toHaveBeenCalledWith('Parking slots set to 10');
  });

//   test('handles registration number input and update button click', () => {
//     // Mock Redux state to include length and items
//     store.getState = () => ({
//       length: { 
//         length: 5, // Provide an initial length value
//         items: [
//           { id: 1, registrationNumber: '', isAvailable: true },
//           { id: 2, registrationNumber: '', isAvailable: false }
//         ],
//       },
//     });

//     render(
//       <Provider store={store}>
//         <SpaceManager />
//       </Provider>
//     );

//     const selectInput = screen.getByRole('combobox');
//     const registrationInput = screen.getByPlaceholderText('Enter Registration Number');
//     const updateButton = screen.getByText('Park the Car');

//     fireEvent.change(selectInput, { target: { value: '1' } });
//     fireEvent.change(registrationInput, { target: { value: 'AB12CD1234' } });
//     fireEvent.click(updateButton);

//     expect(require('react-hot-toast').success).toHaveBeenCalledWith('Car is parked at slot ID 1 with registration number AB12CD1234');
//   });
});
