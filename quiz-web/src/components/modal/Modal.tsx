import { FC } from "react";
import "./Modal.scss";

export const Modal: FC<{ 
  isOpen: boolean, 
  children: any
}> = ({ isOpen, children }) => {
  return (
    <>
      {isOpen && (
        <div className="modal-container">
         {children}
        </div>
      )}
    </>
  );
}
