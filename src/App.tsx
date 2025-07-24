// src/App.tsx
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useAppDispatch } from "@/hooks/reduxHooks";
import { setUserFromToken } from "@/store/authSlice";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import AdminProtectedRoute from "./routes/AdminProtectedRoute";
import ProtectedRoute from "@/context/ProtectedRoute";

import AppLoader from "@/components/common/AppLoader";

// Client pages
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Order from "./pages/Order";
import Login from "./pages/Login";
import Register from "./pages/Register";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import CheckEmail from "./pages/CheckEmail";
import VerifyEmail from "./pages/VerifyEmail";
// import Wishlist from "./pages/Wishlist";

// Admin pages
import AdminLogin from "./admin/login";
import Dashboard from "./admin/dashboard";
import Messages from "./admin/support";
import AdminNotFound from "./admin/notFound";
import AdminOrder from "./admin/orders";
import Product from "./admin/products";
import Subscriptions from "./admin/subscriptions";
import Report from "./admin/analytics";
import Settings from "./admin/settings";
import Users from "./admin/customers";
import AddProduct from "./admin/addProduct";
import Profile from "./admin/profile";

const queryClient = new QueryClient();

// ProtectedRoute wrapper


const App = () => {
   const dispatch = useAppDispatch();
   
  useEffect(() => {
    const savedUser = localStorage.getItem("auth_user");
    if (savedUser) {
      dispatch(setUserFromToken(JSON.parse(savedUser)));
    }
  }, [dispatch]);
  return (
    <AppLoader>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <QueryClientProvider client={queryClient}>
              <TooltipProvider>
                <Toaster />
                <Sonner />

                <Routes>
                  {/* Client Routes */}
                  <Route path="/" element={<Index />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/product/:slug" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  {/*<Route path ="/wishlist" element={<Wishlist />} />*/}
                  <Route
                    path="/checkout"
                    element={
                      <ProtectedRoute>
                        <Checkout />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/order" element={<Order />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/check-email" element={<CheckEmail />} />
                  <Route path="/verify-email/:token" element={<VerifyEmail />} />

                  {/* Admin Routes */}
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route
                    path="/admin/dashboard"
                    element={
                      <AdminProtectedRoute>
                        <Dashboard />
                      </AdminProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/support"
                    element={
                      <AdminProtectedRoute>
                        <Messages />
                      </AdminProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/orders"
                    element={
                      <AdminProtectedRoute>
                        <AdminOrder />
                      </AdminProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/products"
                    element={
                      <AdminProtectedRoute>
                        <Product />
                      </AdminProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/profile"
                    element={
                      <AdminProtectedRoute>
                        <Profile />
                      </AdminProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/analytics"
                    element={
                      <AdminProtectedRoute>
                        <Report />
                      </AdminProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/settings"
                    element={
                      <AdminProtectedRoute>
                        <Settings />
                      </AdminProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/customers"
                    element={
                      <AdminProtectedRoute>
                        <Users />
                      </AdminProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/subscriptions"
                    element={
                      <AdminProtectedRoute>
                        <Subscriptions />
                      </AdminProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/add-product"
                    element={
                      <AdminProtectedRoute>
                        <AddProduct />
                      </AdminProtectedRoute>
                    }
                  />

                  {/* 404 Fallbacks */}
                  <Route path="/admin/*" element={<AdminNotFound />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </TooltipProvider>
            </QueryClientProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </AppLoader>
  );
};

export default App;
