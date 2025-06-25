export const statusItems = {
  pending: {
    text: "PENDING",
    color: "#FFA500",
    icon: "hourglass-outline",
  },
  completed: {
    text: "COMPLETED",
    color: "#32CD32",
    icon: "checkmark-circle-outline",
  },
  inprogress: {
    text: "INPROGRESS",
    color: "#1E90FF",
    icon: "construct",
  },
};

export const getBackgroundColor = (color: string) => {
  // แปลงสี hex เป็น rgba หรือใช้ opacity
  if (color.startsWith("#")) {
    const hex = color.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    return `rgba(${r}, ${g}, ${b}, 0.1)`; // opacity 0.1 สำหรับสีอ่อน
  }
  return color;
};

export const statusAll = [
  {
    key: "PENDING",
    color: "amber.500",
    icon: "hourglass",
  },
  {
    key: "INPROGRESS",
    color: "blue.500",
    icon: "construct",
  },
  {
    key: "COMPLETED",
    color: "green.500",
    icon: "checkmark-circle",
  },
];

export const processItem = [
  {
    title: "REPAIR_REQ",
    icon: "build",
    screen: "RepairScreen",
  },
  {
    title: "REPAIR_REQ_HISTORY",
    icon: "time",
    screen: "RepairHistoryScreen",
  },
  {
    title: "SUBMIT_REPAIR_REQ",
    icon: "checkmark-circle",
    screen: "RepairSubmitScreen",
  },
];

export const gradientcolorTheme = {
  0: ["#006289", "#26a69a"],
  1: ["#b13579", "#7e57c2"],
  2: ["#3598b1", "#6f35b1"],
};
