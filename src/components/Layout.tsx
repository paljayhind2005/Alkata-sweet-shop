import { useMember } from '@/integrations';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ShoppingCart, User, LogOut } from 'lucide-react';
import { MiniCart } from '@/wix-verticals/react-pages/react-router/routes/root';

export default function Layout() {
  const { member, isAuthenticated, isLoading, actions } = useMember();
  const navigate = useNavigate();

  const handleProfileClick = () => {
    if (isAuthenticated) {
      navigate('/profile');
    } else {
      actions.login();
    }
  };

  const isAdmin = member?.profile?.title === 'admin' || member?.loginEmail === 'admin@example.com';

  return (
    <div className="min-h-screen bg-primary text-primary-foreground">
      <header className="border-b border-primary-foreground/10">
        <div className="max-w-[120rem] mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <Link to="/" className="font-heading text-3xl md:text-4xl italic">
              Al Kata Sweet
            </Link>
            
            <nav className="flex items-center gap-8">
              <Link 
                to="/" 
                className="font-paragraph text-base hover:opacity-70 transition-opacity"
              >
                Home
              </Link>
              <Link 
                to="/store" 
                className="font-paragraph text-base hover:opacity-70 transition-opacity"
              >
                Shop
              </Link>
              <a 
                href="/#about" 
                className="font-paragraph text-base hover:opacity-70 transition-opacity"
              >
                About
              </a>
              <a 
                href="/#contact" 
                className="font-paragraph text-base hover:opacity-70 transition-opacity"
              >
                Contact
              </a>
              
              {isAuthenticated && isAdmin && (
                <Link 
                  to="/admin" 
                  className="font-paragraph text-base hover:opacity-70 transition-opacity"
                >
                  Admin
                </Link>
              )}
              
              <div className="flex items-center gap-4 ml-4 border-l border-primary-foreground/20 pl-4">
                {isLoading ? (
                  <LoadingSpinner />
                ) : (
                  <>
                    <button
                      onClick={handleProfileClick}
                      className="flex items-center gap-2 hover:opacity-70 transition-opacity"
                      aria-label={isAuthenticated ? 'Profile' : 'Sign In'}
                    >
                      <User className="w-5 h-5" />
                      <span className="font-paragraph text-sm hidden md:inline">
                        {isAuthenticated ? member?.profile?.nickname || 'Profile' : 'Sign In'}
                      </span>
                    </button>
                    
                    {isAuthenticated && (
                      <button
                        onClick={actions.logout}
                        className="flex items-center gap-2 hover:opacity-70 transition-opacity"
                        aria-label="Sign Out"
                      >
                        <LogOut className="w-5 h-5" />
                      </button>
                    )}
                    
                    <MiniCart
                      cartIcon={ShoppingCart}
                      cartIconClassName="hover:opacity-70 transition-opacity"
                    />
                  </>
                )}
              </div>
            </nav>
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="border-t border-primary-foreground/10 mt-24">
        <div className="max-w-[120rem] mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <h3 className="font-heading text-2xl italic mb-4">Al Kata Sweet</h3>
              <p className="font-paragraph text-base opacity-80">
                Authentic Indian sweets crafted with traditional recipes and finest ingredients since 2024.
              </p>
            </div>
            
            <div>
              <h4 className="font-heading text-xl italic mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="font-paragraph text-base hover:opacity-70 transition-opacity">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/store" className="font-paragraph text-base hover:opacity-70 transition-opacity">
                    Shop
                  </Link>
                </li>
                <li>
                  <a href="/#about" className="font-paragraph text-base hover:opacity-70 transition-opacity">
                    About
                  </a>
                </li>
                <li>
                  <a href="/#contact" className="font-paragraph text-base hover:opacity-70 transition-opacity">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            
            <div id="contact">
              <h4 className="font-heading text-xl italic mb-4">Contact Us</h4>
              <ul className="space-y-2 font-paragraph text-base opacity-80">
                <li>123 Sweet Street</li>
                <li>Confection City, CC 12345</li>
                <li>Phone: (555) 123-4567</li>
                <li>Email: hello@sweetelegance.com</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-primary-foreground/10 text-center">
            <p className="font-paragraph text-sm opacity-60">
              © {new Date().getFullYear()} Al Kata Sweet. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
