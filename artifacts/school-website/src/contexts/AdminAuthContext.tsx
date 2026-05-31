import { createContext, useContext } from "react";
import { useGetAdminMe, getGetAdminMeQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

interface AdminAuthContextType {
  admin: any;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType>({
  admin: null,
  isLoading: false,
  isAuthenticated: false,
  logout: () => {},
});

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const qc = useQueryClient();
  const { data: admin, isLoading } = useGetAdminMe({
    query: {
      queryKey: getGetAdminMeQueryKey(),
      retry: false,
      enabled: !!localStorage.getItem("esh_admin_token"),
    },
  });

  function logout() {
    localStorage.removeItem("esh_admin_token");
    qc.clear();
    window.location.href = `${import.meta.env.BASE_URL}admin/login`;
  }

  return (
    <AdminAuthContext.Provider value={{
      admin,
      isLoading,
      isAuthenticated: !!admin,
      logout,
    }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}
