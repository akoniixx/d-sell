export const getCompanyName = (companyId: string) => {
  switch (companyId) {
    case "ICPL":
      return "ICP ladda";
    case "ICPI":
      return "ICP International";
    case "ICPF":
      return "ICP Fertilizer";
    case "ICK":
      return "Iconkaset";
  }
};
