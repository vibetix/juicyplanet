import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "@/hooks/reduxHooks";
import { logout } from "@/store/authSlice";
import supabase from "@/lib/supabaseClient";
import { Menu, ShoppingCart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useCart } from "@/context/CartContext";

export default function Header() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { getTotalCount } = useCart();
  const cartCount = getTotalCount();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const closeTimer = useRef<NodeJS.Timeout | null>(null);

  const auth = useAppSelector((state) => state.auth || { user: null, isAuthenticated: false });
  const user = auth.user;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    dispatch(logout());
    navigate("/login");
  };

  const handleMouseEnter = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => {
      setDropdownOpen(false);
    }, 150);
  };

  return (
    <header className="w-full bg-white shadow-sm fixed top-0 left-0 z-50">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap justify-between items-center gap-y-2">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-juicy-yellow to-juicy-yellow-light rounded-full flex items-center justify-center shadow-lg">
            <span className="text-2xl" aria-hidden="true">🧃</span>
            <span className="sr-only">JuicyPlanet Logo</span>
          </div>
          <Link to="/" className="text-xl sm:text-2xl font-bold text-juicy-green">
            JuicyPlanet
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6">
          <Link to="/shop" className="hover:text-juicy-green font-medium transition">Shop</Link>
          <Link to="/about" className="hover:text-juicy-green font-medium transition">About</Link>
          <Link to="/contact" className="hover:text-juicy-green font-medium transition">Contact</Link>
        </nav>

        {/* Right Icons */}
        <div className="flex items-center gap-4">
          <Link to="/cart" className="relative flex items-center text-sm sm:text-base">
            <ShoppingCart className="w-5 h-5 hover:text-juicy-green transition" />
            {cartCount > 0 && (
              <span className="ml-1 text-sm font-medium">{cartCount}</span>
            )}
          </Link>

          {/* User Dropdown */}
          <div
            className="relative hidden sm:block"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="flex items-center gap-2 cursor-pointer px-2 py-1 rounded hover:bg-gray-100 transition">
              <User className="w-5 h-5" />
              <span className="font-quicksand text-sm">
                {user?.username || "Account"}
              </span>
            </div>

            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-1 w-40 max-w-[90vw] bg-white border rounded-md shadow-md z-50">
                {user ? (
                  <>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm hover:bg-juicy-green hover:text-white transition"
                    >
                      Profile
                    </Link>
                    <Link
                      to="/order"
                      className="block px-4 py-2 text-sm hover:bg-juicy-green hover:text-white transition"
                    >
                      Order
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-juicy-green hover:text-white transition"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block px-4 py-2 text-sm hover:bg-juicy-green hover:text-white transition"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="block px-4 py-2 text-sm hover:bg-juicy-green hover:text-white transition"
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger>
              <Menu className="lg:hidden w-6 h-6 hover:text-juicy-green" />
            </SheetTrigger>
            <SheetContent side="right" className="w-64 max-h-screen overflow-y-auto">
              <nav className="flex flex-col gap-4 mt-8">
                {/* ✅ User info (icon + name) */}
                {user && (
                  <div className="flex items-center gap-2 px-4 py-2 mb-2 bg-gray-100 rounded-md shadow-sm">
                    <User className="w-5 h-5 text-juicy-green" />
                    <span className="text-sm font-medium text-gray-700">{user.username}</span>
                  </div>
                )}
                <Link to="/" onClick={() => setSheetOpen(false)} className="font-semibold hover:text-juicy-green">
                  Home
                </Link>
                <Link to="/shop" onClick={() => setSheetOpen(false)} className="font-semibold hover:text-juicy-green">
                  Shop
                </Link>
                <Link to="/about" onClick={() => setSheetOpen(false)} className="font-semibold hover:text-juicy-green">
                  About
                </Link>
                <Link to="/contact" onClick={() => setSheetOpen(false)} className="font-semibold hover:text-juicy-green">
                  Contact
                </Link>
                <hr />
                {user ? (
                  <>
                    <Link to="/profile" onClick={() => setSheetOpen(false)} className="font-semibold hover:text-juicy-green">
                      Profile
                    </Link>
                    <Link
                      to="/order" onClick={() => setSheetOpen(false)} className="font-semibold hover:text-juicy-green">                    >
                      Order
                    </Link>
                    <Button
                      variant="ghost"
                      className="text-left px-0 hover:text-juicy-green"
                      onClick={() => {
                        handleLogout();
                        setSheetOpen(false);
                      }}
                    >
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setSheetOpen(false)} className="font-semibold hover:text-juicy-green">
                      Login
                    </Link>
                    <Link to="/register" onClick={() => setSheetOpen(false)} className="font-semibold hover:text-juicy-green">
                      Register
                    </Link>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
