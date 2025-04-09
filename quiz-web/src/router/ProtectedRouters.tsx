import { FC } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Creator } from "../models/Creator";

const ProtectedRoute: FC<{user: Creator | null}> = ({user}) => {
  return user ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoute;