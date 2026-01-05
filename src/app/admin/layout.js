import ModalConfig from "@/components/ModalConfig/ModalConfig";
import AdminLayoutWrapper from "@/layoutWrapper/adminLayoutWrapper";
import ProtectedRoute from "@/layoutWrapper/protectedRoute";

export const metadata = {
  title: "Admin - Quản lý bepanphu",
};

export default async function AdminLayout({ children }) {
  return (
    <ProtectedRoute>
      <AdminLayoutWrapper>
        <ModalConfig />
        {children}
      </AdminLayoutWrapper>
    </ProtectedRoute>
  );
}
