import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { removeAuthToken } from "../services/api";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    removeAuthToken();
    navigate("/login", { replace: true });
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
      <div className="animate-spin w-8 h-8 border-4 border-accent border-t-transparent rounded-full mb-4" />
      <p className="text-sm font-medium text-muted">Logging out and clearing session...</p>
    </div>
  );
}
