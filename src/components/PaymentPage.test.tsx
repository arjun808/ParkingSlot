import { render, screen,fireEvent,waitFor } from "@testing-library/react";
import PaymentPage from "./PaymentPage";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from '@reduxjs/toolkit';
import lengthReducer, { updateRegistrationNumber,setLength } from '../redux/lengthSlice';

import toast from "react-hot-toast";

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
         
        ],
      },
    },
  });
  describe("test for payment component",()=>{
    test("renders the payment component", () => {
        render(
            <Provider store={mockStore}>
                <BrowserRouter>
                    <PaymentPage />
                </BrowserRouter>
            </Provider>
        );

        const checkUi = screen.getByText(/Pay Your Bill/i);
        expect(checkUi).toBeInTheDocument();
    });
    test("displays loading state when item is undefined", () => {
        render(
            <Provider store={mockStore}>
                <BrowserRouter>
                    <PaymentPage params={{ id: '1' }} updateRegistrationNumber={() => {}} />
                </BrowserRouter>
            </Provider>
        );

        const loadingText = screen.getByText(/Loading.../i);
        expect(loadingText).toBeInTheDocument();
    });

    // test("calls handleClick and updates state on successful payment", async () => {
        
       

    //     const updateRegistrationNumber = jest.fn();
    //     const { container } = render(
    //         <Provider store={mockStore}>
    //             <BrowserRouter>
    //                 <PaymentPage params={{ id: '1' }} updateRegistrationNumber={updateRegistrationNumber} />
    //             </BrowserRouter>
    //         </Provider>
    //     );

    //     const item = {
    //         id: 1,
    //         registrationNumber: 'AB12BC1234',
    //         isAvailable: false,
    //         parkedAt: new Date().toISOString(),
    //     };

    //     localStorage.setItem('items', JSON.stringify([item]));

    //     // Trigger componentDidMount
    //     await waitFor(() => {
    //         const button = screen.getByText(/Pay/i);
    //         fireEvent.click(button);

          

    //         expect(updateRegistrationNumber).toHaveBeenCalledWith({ id: 1, registrationNumber: "" });

    //         expect(toast.success).toHaveBeenCalledWith("Payment Successful");
    //     });
    // });


});















