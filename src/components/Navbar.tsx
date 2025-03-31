
import React from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, Home, QrCode, FileText, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from '@/lib/utils';

interface NavbarProps {
  userRole?: 'student' | 'teacher' | null;
}

const Navbar = ({ userRole }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const handleLogout = () => {
    // In a real app, we would clear the auth state
    navigate('/login');
  };

  const getIsActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto flex justify-between items-center py-3 px-4 sm:px-6">
        <Link to="/" className="flex items-center space-x-2">
          <span className="font-bold text-xl sm:text-2xl bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">Presence+</span>
        </Link>
        
        <div className="hidden md:flex items-center space-x-6">
          {userRole && (
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link 
                    to={userRole === 'teacher' ? "/teacher-dashboard" : "/student-dashboard"} 
                    className={cn(
                      navigationMenuTriggerStyle(),
                      getIsActive(userRole === 'teacher' ? "/teacher-dashboard" : "/student-dashboard") ? "bg-accent text-accent-foreground" : ""
                    )}
                  >
                    <Home className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </NavigationMenuItem>
                
                {userRole === 'teacher' && (
                  <>
                    <NavigationMenuItem>
                      <Link 
                        to="/qr-generator" 
                        className={cn(
                          navigationMenuTriggerStyle(),
                          getIsActive("/qr-generator") ? "bg-accent text-accent-foreground" : ""
                        )}
                      >
                        <QrCode className="mr-2 h-4 w-4" />
                        QR Generator
                      </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <NavigationMenuTrigger className="flex items-center">
                        <FileText className="mr-2 h-4 w-4" />
                        Reports
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid w-[200px] gap-3 p-4">
                          <li>
                            <NavigationMenuLink asChild>
                              <a href="#" className="block p-2 hover:bg-accent rounded-md">
                                Daily Reports
                              </a>
                            </NavigationMenuLink>
                          </li>
                          <li>
                            <NavigationMenuLink asChild>
                              <a href="#" className="block p-2 hover:bg-accent rounded-md">
                                Weekly Reports
                              </a>
                            </NavigationMenuLink>
                          </li>
                          <li>
                            <NavigationMenuLink asChild>
                              <a href="#" className="block p-2 hover:bg-accent rounded-md">
                                Monthly Reports
                              </a>
                            </NavigationMenuLink>
                          </li>
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  </>
                )}
                
                {userRole === 'student' && (
                  <NavigationMenuItem>
                    <Link 
                      to="/attendance" 
                      className={navigationMenuTriggerStyle()}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Attendance
                    </Link>
                  </NavigationMenuItem>
                )}
              </NavigationMenuList>
            </NavigationMenu>
          )}
          
          {userRole ? (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" onClick={() => navigate('/profile')} className="text-foreground hover:text-primary">
                <User className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleLogout} className="text-foreground hover:text-primary">
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
        <div className="md:hidden animate-fade-in bg-background/95 dark:bg-gray-900/95 backdrop-blur-sm">
          <div className="px-4 pt-2 pb-6 space-y-3">
            {userRole && (
              <>
                <Link 
                  to={userRole === 'teacher' ? "/teacher-dashboard" : "/student-dashboard"} 
                  className="flex items-center py-2 text-base font-medium text-foreground hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Home className="mr-2 h-5 w-5" />
                  Dashboard
                </Link>
                {userRole === 'teacher' && (
                  <>
                    <Link 
                      to="/qr-generator" 
                      className="flex items-center py-2 text-base font-medium text-foreground hover:text-primary"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <QrCode className="mr-2 h-5 w-5" />
                      QR Generator
                    </Link>
                    <div className="py-2">
                      <div className="flex items-center text-base font-medium text-foreground">
                        <FileText className="mr-2 h-5 w-5" />
                        Reports
                      </div>
                      <div className="ml-7 mt-2 space-y-2">
                        <a href="#" className="block py-1 text-sm text-muted-foreground hover:text-foreground">
                          Daily Reports
                        </a>
                        <a href="#" className="block py-1 text-sm text-muted-foreground hover:text-foreground">
                          Weekly Reports
                        </a>
                        <a href="#" className="block py-1 text-sm text-muted-foreground hover:text-foreground">
                          Monthly Reports
                        </a>
                      </div>
                    </div>
                  </>
                )}
                {userRole === 'student' && (
                  <Link 
                    to="/attendance" 
                    className="flex items-center py-2 text-base font-medium text-foreground hover:text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FileText className="mr-2 h-5 w-5" />
                    Attendance
                  </Link>
                )}
              </>
            )}
            
            {userRole ? (
              <div className="flex flex-col space-y-2 pt-2">
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
