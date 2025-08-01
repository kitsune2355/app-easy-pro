export const statusItems = {
  pending: {
    text: "PENDING",
    color: "#fb923c",
    icon: "hourglass-outline",
  },
  completed: {
    text: "COMPLETED",
    color: "#32CD32",
    icon: "checkmark-circle",
  },
  inprogress: {
    text: "INPROGRESS",
    color: "#1E90FF",
    icon: "construct",
  },
  feedback: {
    text: "FEEDBACK",
    color: "#facc15",
    icon: "star",
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
    color: "orange.400",
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
  {
    key: "FEEDBACK",
    color: "yellow.400",
    icon: "star",
  }
];

export const processItem = [
  {
    title: "REPAIR_REQ",
    icon: "build",
    screen: "RepairScreen",
    role: ["admin","employer"],
  },
  {
    title: "REPAIR_REQ_HISTORY",
    icon: "time",
    screen: "RepairHistoryScreen",
    role: ["admin","employer"],
  },
  {
    title: "SUBMIT_REPAIR_REQ",
    icon: "checkmark-circle",
    screen: "RepairSubmitScreen",
    role: ["admin"],
  },
];

export const gradientcolorTheme = {
  0: ["#006289", "#26a69a"],
  1: ["#b13579", "#7e57c2"],
  2: ["#3598b1", "#6f35b1"],
};

export const getBuildingOptions = (buildings: any[]) => {
  return buildings.map((b) => ({
    label: b.area_name,
    value: String(b.area_id),
  }));
};

export const getFloorOptions = (buildings: any[], buildingId: string) => {
  return (
    buildings
      .find((b) => String(b.area_id) === buildingId)
      ?.floor.map((f) => ({
        label: f.ac_name,
        value: String(f.ac_id),
      })) || []
  );
};

export const getRoomOptions = (
  buildings: any[],
  buildingId: string,
  floorId: string
) => {
  return (
    buildings
      .find((b) => String(b.area_id) === buildingId)
      ?.floor.find((f) => String(f.ac_id) === floorId)
      ?.room.map((r) => ({
        label: r.ar_name,
        value: String(r.ar_id),
      })) || []
  );
};
