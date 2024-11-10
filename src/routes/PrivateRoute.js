import { css } from "@emotion/react";
import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import GridLoader from "react-spinners/GridLoader";
import useAuth from '../hooks/useAuth';

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

const allowedAdminEmails = ['b22es006@iitj.ac.in', 'b22cs101@iitj.ac.in', 'b22cs014@iitj.ac.in'];

const PrivateRoute = ({ children, ...rest }) => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <GridLoader color="#1d4ed8" css={override} size={25} />
            </div>
        );
    }

    // Check if accessing `/admin` and if user email is in allowedAdminEmails
    const isAdminRoute = rest.path === '/admin';
    const hasAccess = isAdminRoute ? allowedAdminEmails.includes(user?.email) : !!user;

    return (
        <Route
            {...rest}
            render={({ location }) =>
                hasAccess ? (
                    children
                ) : (
                    <Redirect
                        to={{
                            pathname: "/admin",
                            state: { from: location }
                        }}
                    />
                )
            }
        />
    );
};

export default PrivateRoute;
