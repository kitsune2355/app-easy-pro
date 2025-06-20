export const statusItems = {
    pending:{
        text: "PENDING",
        color: "#FFA500",
        icon: "hourglass-outline",
    },
    success:{
        text: "COMPLETED",
        color: "#32CD32",
        icon: "checkmark-circle-outline",
    },
    inprogress:{
        text: "IN_PROGRESS",
        color: "#1E90FF",
        icon: "construct",
    },
}

export const statusAll = [
  {
    key: "ALL",
    color: "blue.500",
    icon: "reader-outline",
  },
  {
    key: "PENDING",
    color: "amber.500",
    icon: "hourglass-outline",
  },
  {
    key: "COMPLETED",
    color: "green.500",
    icon: "checkmark-circle-outline",
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
    icon: "construct",
    screen: "RepairSubmitScreen",
  },
];

export const gradientcolorTheme = {
      0: ["#006289", "#26a69a"],
      1: ["#b13579", "#7e57c2"],
      2: ["#3598b1", "#6f35b1"],
    };