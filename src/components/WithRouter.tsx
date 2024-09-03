
import React from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';


const withRouter = (WrappedComponent: any) => {
    return (props: any) => {
        const location = useLocation();
        const params = useParams();
        const navigate = useNavigate();

        return (
            <WrappedComponent
                {...props}
                location={location}
                params={params}
                navigate={navigate}
            />
        );
    };
};

export default withRouter;
