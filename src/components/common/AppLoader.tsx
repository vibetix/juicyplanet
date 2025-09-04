// src/components/common/AppLoader.tsx
import { useEffect, useState } from "react";
import { useAppDispatch } from "@/hooks/reduxHooks";
import { login } from "@/store/authSlice";

const AppLoader = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setReady(true);
      return;
    }

    fetch("https://juicy-backend.onrender.com/user/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.user) {
          dispatch(login(data.user));
        } else {
          localStorage.removeItem("token");
        }
      })
      .catch(() => {
        localStorage.removeItem("token");
      })
      .finally(() => {
        setReady(true);
      });
  }, [dispatch]);

  if (!ready) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="text-lg font-semibold animate-pulse">Loading...</span>
      </div>
    );
  }

  return <>{children}</>;
};

export default AppLoader;
