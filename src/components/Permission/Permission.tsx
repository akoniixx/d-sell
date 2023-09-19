import React, { useMemo } from "react";
import { useRecoilState } from "recoil";
import { roleAtom } from "../../store/RoleAtom";

interface Props {
  permission: string[];
}

const Permission = ({ permission }: Props) => {
  const [roleState, setRoleState] = useRecoilState(roleAtom);
  const {} = useMemo(() => {
    return {};
  }, [roleState]);

  return <></>;
};

export default Permission;
