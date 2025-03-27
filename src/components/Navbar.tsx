
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Menu, X, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavbarProps {
  userRole?: 'student' | 'teacher' | null;
}

const Navbar = ({ userRole }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const navigate = useNavigate();
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const handleLogout = () => {
    // In a real app, we would clear the auth state
    navigate('/login');
  };
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass dark:glass-dark border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto flex justify-between items-center py-4 px-4 sm:px-6">
        <Link to="/" className="flex items-center space-x-2">
          <span className="font-bold text-xl sm:text-2xl bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">Presence+</span>
        </Link>
        
        <div className="hidden md:flex items-center space-x-6">
          {userRole && (
            <>
              <Link to="/dashboard" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
                Dashboard
              </Link>
              {userRole === 'teacher' && (
                <Link to="/qr-generator" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
                  QR Generator
                </Link>
              )}
              <Link to="/attendance" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
                Attendance
              </Link>
            </>
          )}
          
          {userRole ? (
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" onClick={() => navigate('/profile')}>
                <User className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <Button onClick={() => navigate('/login')} variant="default">
              Sign In
            </Button>
          )}
        </div>
        
        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={toggleMenu}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden glass dark:glass-dark animate-fade-in">
          <div className="px-4 pt-2 pb-6 space-y-4">
            {userRole && (
              <>
                <Link 
                  to="/dashboard" 
                  className="block py-2 text-base font-medium text-foreground/80 hover:text-foreground"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                {userRole === 'teacher' && (
                  <Link 
                    to="/qr-generator" 
                    className="block py-2 text-base font-medium text-foreground/80 hover:text-foreground"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    QR Generator
                  </Link>
                )}
                <Link 
                  to="/attendance" 
                  className="block py-2 text-base font-medium text-foreground/80 hover:text-foreground"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Attendance
                </Link>
              </>
            )}
            
            {userRole ? (
              <div className="flex flex-col space-y-2">
                <Button 
                  variant="outline" 
                  className="justify-start" 
                  onClick={() => {
                    navigate('/profile');
                    setIsMenuOpen(false);
                  }}
                >
                  <User className="h-5 w-5 mr-2" />
                  Profile
                </Button>
                <Button 
                  variant="outline" 
                  className="justify-start" 
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button 
                onClick={() => {
                  navigate('/login');
                  setIsMenuOpen(false);
                }} 
                className="w-full"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
