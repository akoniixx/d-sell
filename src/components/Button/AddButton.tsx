import React from "react";

interface AddButtonProps {
  label: string;
  onClick?: Function;
}
export const AddButton: React.FC<AddButtonProps> = ({ label, onClick }) => (
  <button
    onClick={() => (onClick ? onClick() : "")}
    className="btn btn-primary"
    style={{ backgroundColor: "#0059D1" }}
  >
    {label}
  </button>
);

export default AddButton;
