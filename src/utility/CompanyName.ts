import image from "../resource/image";

export const getCompanyName = (company: string) => {
  switch (company) {
    case "ICPL":
      return "ICP ladda";
    case "ICPI":
      return "ICP International";
    case "ICPF":
      return "ICP Fertilizer";
    case "ICK":
      return "Iconkaset";
    case "MGT":
      return "มงกุฏทอง";
  }
};
export const getCompanyImage = (company: string) => {
  switch (company) {
    case "ICPL":
      return image.icp_ladda;
    case "ICPI":
      return image.icp_international;
    case "ICPF":
      return image.icp_fertilizer;
  }
};
export const checkCompany = (company?: string) => {
  if (company === `ICPL` || company === `ICPI` || company === `ICPF`) {
    return true;
  } else {
    return false;
  }
};
