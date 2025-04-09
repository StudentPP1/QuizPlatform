import { Outlet, Navigate } from "react-router-dom";
import { Creator } from "../models/Creator";
import { FC } from "react";

const ProtectedRoutes: FC<{user : Creator | null}> = ({user}) => {
    // if user is null, redirect to main page
    return user ? <Outlet /> : <Navigate to="/" />;
}
export default ProtectedRoutes;