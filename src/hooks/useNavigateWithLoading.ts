import { navigate } from "../utils/NavigationService";
import { useLoading } from "../context/LoadingContext";

export const useNavigateWithLoading = () => {
  const { show, hide } = useLoading();

  const navigateWithLoading = async (screen: string, params?: any) => {
    show(); // ✅ แสดง loading ทันที
    try {
      await new Promise((res) => setTimeout(res, 100)); // simulate load (หรือลบออก)
      navigate(screen, params); // ✅ ไปหน้าที่ต้องการ
    } finally {
      setTimeout(() => hide(), 100); // ซ่อนหลัง navigate แล้ว (เพิ่ม delay เล็กน้อย)
    }
  };

  return navigateWithLoading;
};
