import React from 'react';

interface SaveButtonProp {
  action: () => void;
  disableAction?: boolean;
}

export const SaveButton: React.FC<SaveButtonProp> = ({
  action,
  disableAction,
}) => {
  return (
    <button
      type="button"
      className="btn btn-primary mr-2 btn-lg"
      onClick={() => action()}
      disabled={disableAction}
    >
      บันทึก
    </button>
  );
};
