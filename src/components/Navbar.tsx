
import React from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, Home, QrCode, FileText, Users, ChevronDown, Info, Phone, Camera } from 'lucide-react';
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
    localStorage.removeItem('currentStudent');
    localStorage.removeItem('currentTeacher');
    navigate('/login');
  };

  const getIsActive = (path: string) => {
    return location.pathname === path;
  };

  // Get current user info from localStorage
  const getCurrentUserName = () => {
    const currentStudent = localStorage.getItem('currentStudent');
    const currentTeacher = localStorage.getItem('currentTeacher');
    
    if (currentStudent) {
      try {
        const student = JSON.parse(currentStudent);
        return student.fullName;
      } catch (e) {
        return null;
      }
    }
    
    if (currentTeacher) {
      try {
        const teacher = JSON.parse(currentTeacher);
        return teacher.fullName;
      } catch (e) {
        return null;
      }
    }
    
    return null;
  };
  
  const userName = getCurrentUserName();
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto flex justify-between items-center py-3 px-4 sm:px-6">
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl sm:text-2xl bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">Presence+</span>
          </Link>
          
          {userName && (
            <div className="hidden md:flex items-center border-l border-gray-300 dark:border-gray-700 pl-4 ml-2">
              <span className="text-sm text-muted-foreground">Welcome, </span>
              <span className="text-sm font-medium ml-1">{userName}</span>
            </div>
          )}
        </div>
        
        <div className="hidden md:flex items-center space-x-1">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link 
                  to="/" 
                  className={cn(
                    navigationMenuTriggerStyle(),
                    getIsActive("/") ? "bg-accent text-accent-foreground" : ""
                  )}
                >
                  <Home className="mr-2 h-4 w-4" />
                  Home
                </Link>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <Link 
                  to="/about" 
                  className={cn(
                    navigationMenuTriggerStyle(),
                    getIsActive("/about") ? "bg-accent text-accent-foreground" : ""
                  )}
                >
                  <Info className="mr-2 h-4 w-4" />
                  About
                </Link>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <Link 
                  to="/contact" 
                  className={cn(
                    navigationMenuTriggerStyle(),
                    getIsActive("/contact") ? "bg-accent text-accent-foreground" : ""
                  )}
                >
                  <Phone className="mr-2 h-4 w-4" />
                  Contact
                </Link>
              </NavigationMenuItem>
              
              {userRole === 'student' && (
                <NavigationMenuItem>
                  <Link 
                    to="/mark-attendance" 
                    className={cn(
                      navigationMenuTriggerStyle(),
                      getIsActive("/mark-attendance") ? "bg-accent text-accent-foreground" : ""
                    )}
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    Mark Attendance
                  </Link>
                </NavigationMenuItem>
              )}
              
              {userRole && (
                <>
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
                          <ul className="grid w-[220px] gap-3 p-4">
                            <li className="row-span-3">
                              <NavigationMenuLink asChild>
                                <a
                                  className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-blue-500 to-indigo-700 p-6 no-underline outline-none focus:shadow-md"
                                  href="#"
                                >
                                  <div className="mb-2 mt-4 text-lg font-medium text-white">
                                    Attendance Reports
                                  </div>
                                  <p className="text-sm leading-tight text-white/90">
                                    View and download attendance reports for all your classes
                                  </p>
                                </a>
                              </NavigationMenuLink>
                            </li>
                            <li>
                              <NavigationMenuLink asChild>
                                <a href="#" className="block p-3 hover:bg-accent rounded-md">
                                  <div className="text-sm font-medium">Daily Reports</div>
                                  <p className="text-sm text-muted-foreground leading-tight mt-1">
                                    View attendance for today
                                  </p>
                                </a>
                              </NavigationMenuLink>
                            </li>
                            <li>
                              <NavigationMenuLink asChild>
                                <a href="#" className="block p-3 hover:bg-accent rounded-md">
                                  <div className="text-sm font-medium">Weekly Reports</div>
                                  <p className="text-sm text-muted-foreground leading-tight mt-1">
                                    Weekly attendance summaries
                                  </p>
                                </a>
                              </NavigationMenuLink>
                            </li>
                            <li>
                              <NavigationMenuLink asChild>
                                <a href="#" className="block p-3 hover:bg-accent rounded-md">
                                  <div className="text-sm font-medium">Monthly Reports</div>
                                  <p className="text-sm text-muted-foreground leading-tight mt-1">
                                    Monthly attendance analytics
                                  </p>
                                </a>
                              </NavigationMenuLink>
                            </li>
                          </ul>
                        </NavigationMenuContent>
                      </NavigationMenuItem>
                      
                      <NavigationMenuItem>
                        <NavigationMenuTrigger className="flex items-center">
                          <Users className="mr-2 h-4 w-4" />
                          Students
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <ul className="grid w-[200px] gap-3 p-4">
                            <li>
                              <NavigationMenuLink asChild>
                                <a href="#" className="block p-3 hover:bg-accent rounded-md">
                                  <div className="text-sm font-medium">Student List</div>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    View all enrolled students
                                  </p>
                                </a>
                              </NavigationMenuLink>
                            </li>
                            <li>
                              <NavigationMenuLink asChild>
                                <a href="#" className="block p-3 hover:bg-accent rounded-md">
                                  <div className="text-sm font-medium">Attendance Issues</div>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Students with attendance problems
                                  </p>
                                </a>
                              </NavigationMenuLink>
                            </li>
                            <li>
                              <NavigationMenuLink asChild>
                                <a href="#" className="block p-3 hover:bg-accent rounded-md">
                                  <div className="text-sm font-medium">Manual Attendance</div>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Mark attendance manually
                                  </p>
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
                        to="/attendance/current" 
                        className={navigationMenuTriggerStyle()}
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        Attendance
                      </Link>
                    </NavigationMenuItem>
                  )}
                </>
              )}
            </NavigationMenuList>
          </NavigationMenu>
          
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
            <div className="flex items-center space-x-2">
              <Button onClick={() => navigate('/login')} variant="outline">
                Sign In
              </Button>
              <Button onClick={() => navigate('/signup')} variant="default">
                Sign Up
              </Button>
            </div>
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
            {userName && (
              <div className="flex items-center py-2 border-b border-gray-200 dark:border-gray-800 mb-2">
                <User className="h-5 w-5 text-primary mr-2" />
                <span className="text-sm font-medium">{userName}</span>
              </div>
            )}
            
            <Link 
              to="/" 
              className="flex items-center py-2 text-base font-medium text-foreground hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              <Home className="mr-2 h-5 w-5" />
              Home
            </Link>
            
            <Link 
              to="/about" 
              className="flex items-center py-2 text-base font-medium text-foreground hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              <Info className="mr-2 h-5 w-5" />
              About
            </Link>
            
            <Link 
              to="/contact" 
              className="flex items-center py-2 text-base font-medium text-foreground hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              <Phone className="mr-2 h-5 w-5" />
              Contact
            </Link>
            
            {userRole === 'student' && (
              <Link 
                to="/mark-attendance" 
                className="flex items-center py-2 text-base font-medium text-foreground hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                <Camera className="mr-2 h-5 w-5" />
                Mark Attendance
              </Link>
            )}
            
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
                    
                    <div className="py-2">
                      <div className="flex items-center text-base font-medium text-foreground">
                        <Users className="mr-2 h-5 w-5" />
                        Students
                      </div>
                      <div className="ml-7 mt-2 space-y-2">
                        <a href="#" className="block py-1 text-sm text-muted-foreground hover:text-foreground">
                          Student List
                        </a>
                        <a href="#" className="block py-1 text-sm text-muted-foreground hover:text-foreground">
                          Attendance Issues
                        </a>
                        <a href="#" className="block py-1 text-sm text-muted-foreground hover:text-foreground">
                          Manual Attendance
                        </a>
                      </div>
                    </div>
                  </>
                )}
                
                {userRole === 'student' && (
                  <Link 
                    to="/attendance/current" 
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
              <div className="flex flex-col space-y-2 pt-2">
                <Button 
                  onClick={() => {
                    navigate('/login');
                    setIsMenuOpen(false);
                  }} 
                  className="w-full"
                  variant="outline"
                >
                  Sign In
                </Button>
                <Button 
                  onClick={() => {
                    navigate('/signup');
                    setIsMenuOpen(false);
                  }} 
                  className="w-full"
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
