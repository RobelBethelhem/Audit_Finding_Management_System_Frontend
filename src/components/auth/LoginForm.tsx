
// import { useState } from 'react';
// import { Eye, EyeOff } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// interface LoginFormProps {
//   onLogin: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
// }

// export const LoginForm = ({ onLogin }: LoginFormProps) => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault(); // This prevents the default form submission behavior
    
//     if (!username || !password) {
//       setError('Username and password are required');
//       return;
//     }
    
//     setIsLoading(true);
//     setError('');
    
//     try {
//       const result = await onLogin(username, password);
      
//       if (!result.success) {
//         setError(result.error || 'Login failed');
//       }
//     } catch (err) {
//       console.error('Login error:', err);
//       setError('An unexpected error occurred. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
//       <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
//         {/* Left side - Branding and info */}
//         <div className="text-center lg:text-left space-y-6">
//           <div className="space-y-4">
//             <div className="flex items-center justify-center lg:justify-start space-x-4">
//               <div className="flex-shrink-0">
//                 <img
//                   src="/logo.png"
//                   alt="Zemen Bank Logo"
//                   className="h-16 w-16 object-contain"
//                 />
//               </div>
//               <h1 className="text-3xl font-bold text-gray-900">
//                 Audit Finding MS
//               </h1>
//             </div>
//             {/* <p className="text-lg text-gray-600 max-w-md mx-auto lg:mx-0">
//               Streamline your audit process with our comprehensive management system
//             </p> */}
//           </div>
//         </div>

//         {/* Right side - Login form */}
//         <Card className="w-full max-w-md mx-auto bg-white/90 backdrop-blur-sm shadow-xl border-0">
//           <CardHeader className="text-center">
//             <CardTitle className="text-2xl font-bold text-gray-900">Welcome Back</CardTitle>
//             <CardDescription className="text-gray-600">
//               Sign in to access your audit dashboard
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div className="space-y-2">
//                 <label htmlFor="username" className="text-sm font-medium text-gray-700">
//                   Username
//                 </label>
//                 <Input
//                   id="username"
//                   type="text"
//                   value={username}
//                   onChange={(e) => setUsername(e.target.value)}
//                   placeholder="Enter your username"
//                   required
//                   className="bg-white"
//                 />
//               </div>
              
//               <div className="space-y-2">
//                 <label htmlFor="password" className="text-sm font-medium text-gray-700">
//                   Password
//                 </label>
//                 <div className="relative">
//                   <Input
//                     id="password"
//                     type={showPassword ? 'text' : 'password'}
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     placeholder="Enter your password"
//                     required
//                     className="bg-white pr-10"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                   >
//                     {showPassword ? (
//                       <EyeOff className="h-4 w-4 text-gray-500" />
//                     ) : (
//                       <Eye className="h-4 w-4 text-gray-500" />
//                     )}
//                   </button>
//                 </div>
//               </div>

//               {error && (
//                 <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
//                   {error}
//                 </div>
//               )}

//               <Button 
//                 type="submit" 
//                 className="w-full bg-blue-600 hover:bg-blue-700 text-white"
//                 disabled={isLoading}
//                 onClick={(e) => {
//                   e.preventDefault(); // Extra prevention
//                   handleSubmit(e);
//                 }}
//               >
//                 {isLoading ? 'Signing in...' : 'Sign In'}
//               </Button>
//             </form>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

// import { useState } from 'react';
// import { Eye, EyeOff, Lock, User, ArrowRight, Shield, CheckCircle, TrendingUp } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// interface LoginFormProps {
//   onLogin?: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
// }

// export const LoginForm = ({ onLogin }: LoginFormProps) => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');

//   const handleSubmit = async () => {
//     console.log('Submit button clicked!'); // Debug log
//     console.log('Username:', username, 'Password:', password); // Debug log
    
//     // Clear any previous errors
//     setError('');
    
//     // Validation
//     if (!username.trim()) {
//       setError('Username is required');
//       return;
//     }
    
//     if (!password.trim()) {
//       setError('Password is required');
//       return;
//     }
    
//     setIsLoading(true);
    
//     try {
//       if (onLogin) {
//         // Call the onLogin prop function if provided
//         const result = await onLogin(username, password);
        
//         if (!result.success) {
//           setError(result.error || 'Invalid username or password');
//         } else {
//           // Success - clear form
//           setUsername('');
//           setPassword('');
//           setError('');
//         }
//       } else {
//         // Fallback for testing
//         console.log('No onLogin function provided - using fallback');
//         await new Promise(resolve => setTimeout(resolve, 2000));
        
//         if (username === 'admin' && password === 'password') {
//           alert('Login successful! (username: admin, password: password)');
//           setUsername('');
//           setPassword('');
//           setError('');
//         } else {
//           setError('Invalid credentials. Try username: admin, password: password');
//         }
//       }
//     } catch (err) {
//       console.error('Login error:', err);
//       setError('An unexpected error occurred. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Handle Enter key press
//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === 'Enter' && !isLoading) {
//       handleSubmit();
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-black relative overflow-hidden">
//       {/* Animated Background Elements */}
//       <div className="absolute inset-0">
//         <div className="absolute top-20 left-10 w-32 h-32 bg-red-500/10 rounded-full blur-xl animate-pulse"></div>
//         <div className="absolute top-40 right-20 w-48 h-48 bg-white/5 rounded-full blur-2xl animate-bounce" style={{ animationDuration: '3s' }}></div>
//         <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-red-400/20 rounded-full blur-lg animate-pulse" style={{ animationDelay: '1s' }}></div>
//         <div className="absolute top-1/3 right-1/3 w-16 h-16 bg-white/10 rotate-45 animate-spin" style={{ animationDuration: '8s' }}></div>
        
//         <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        
//         <div className="absolute top-0 left-0 w-full h-full">
//           <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-red-600/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }}></div>
//           <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-l from-white/10 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '2s' }}></div>
//         </div>
//       </div>

//       <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
//         <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
//           {/* Left side - Branding */}
//           <div className="text-center lg:text-left space-y-8">
//             <div className="space-y-6">
//               <div className="flex items-center justify-center lg:justify-start space-x-6">
//                 <div className="relative group">
//                   <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-800 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300 animate-pulse"></div>
//                   <div className="relative flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-600 to-red-800 rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300">
//                     <div className="text-white text-2xl font-bold">ZB</div>
//                   </div>
//                 </div>
//                 <div>
//                   <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white via-red-100 to-white bg-clip-text text-transparent">
//                     Audit Finding MS
//                   </h1>
//                   <p className="text-red-300 text-lg font-medium">Management System</p>
//                 </div>
//               </div>

//               <div>
//                 <p className="text-xl text-gray-300 max-w-lg mx-auto lg:mx-0 leading-relaxed">
//                   Streamline your audit process with our comprehensive management system designed for professional excellence
//                 </p>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto lg:mx-0">
//                 <div className="flex items-center space-x-3 text-white/90 group hover:text-white transition-colors duration-300">
//                   <div className="p-2 bg-red-600/20 rounded-lg group-hover:bg-red-600/30 transition-colors duration-300">
//                     <Shield className="h-5 w-5" />
//                   </div>
//                   <span className="text-sm font-medium">Secure Access</span>
//                 </div>
//                 <div className="flex items-center space-x-3 text-white/90 group hover:text-white transition-colors duration-300">
//                   <div className="p-2 bg-red-600/20 rounded-lg group-hover:bg-red-600/30 transition-colors duration-300">
//                     <TrendingUp className="h-5 w-5" />
//                   </div>
//                   <span className="text-sm font-medium">Real-time Analytics</span>
//                 </div>
//                 <div className="flex items-center space-x-3 text-white/90 group hover:text-white transition-colors duration-300">
//                   <div className="p-2 bg-red-600/20 rounded-lg group-hover:bg-red-600/30 transition-colors duration-300">
//                     <CheckCircle className="h-5 w-5" />
//                   </div>
//                   <span className="text-sm font-medium">Compliance Ready</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Right side - Login form */}
//           <div className="flex justify-center lg:justify-end">
//             <Card className="w-full max-w-md bg-white/95 backdrop-blur-xl shadow-2xl border-0 rounded-3xl overflow-hidden relative group hover:shadow-red-500/20 transition-all duration-500">
//               <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-transparent to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
//               <CardHeader className="text-center pb-8 pt-8 relative">
//                 <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-red-500 to-red-600"></div>
                
//                 <div className="space-y-4">
//                   <div>
//                     <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-600 to-red-700 rounded-2xl mb-4 shadow-lg hover:shadow-red-500/30 transition-all duration-300 hover:scale-105 relative overflow-hidden">
//                       <div className="relative w-12 h-12">
//                         <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-white rounded-full"></div>
                        
//                         <div className="absolute top-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
//                           <div className={`w-1 h-1 bg-gray-800 rounded-full transition-all duration-300 ${password ? 'opacity-0' : 'opacity-100'}`}></div>
//                           <div className={`w-1 h-1 bg-gray-800 rounded-full transition-all duration-300 ${password ? 'opacity-0' : 'opacity-100'}`}></div>
//                         </div>
                        
//                         <div className={`absolute top-1.5 left-1/2 transform -translate-x-1/2 transition-all duration-500 ${password ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}>
//                           <div className="flex space-x-0.5">
//                             <div className="w-1.5 h-1 bg-orange-200 rounded-sm"></div>
//                             <div className="w-1.5 h-1 bg-orange-200 rounded-sm"></div>
//                           </div>
//                         </div>
                        
//                         <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-6 h-4 bg-white rounded-t-lg"></div>
                        
//                         <div className={`absolute top-7 left-1/2 transform -translate-x-1/2 transition-all duration-500 ${password ? '-translate-y-1' : 'translate-y-0'}`}>
//                           <div className="flex justify-between w-8">
//                             <div className="w-1 h-3 bg-orange-200 rounded-full transform -rotate-12"></div>
//                             <div className="w-1 h-3 bg-orange-200 rounded-full transform rotate-12"></div>
//                           </div>
//                         </div>
                        
//                         <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
//                           <div className="flex space-x-1">
//                             <div className="w-1 h-2 bg-blue-400 rounded-full"></div>
//                             <div className="w-1 h-2 bg-blue-400 rounded-full"></div>
//                           </div>
//                         </div>
                        
//                         <div className={`absolute top-3.5 left-1/2 transform -translate-x-1/2 w-2 h-0.5 border-b border-gray-600 rounded-full transition-all duration-300 ${password ? 'opacity-0' : 'opacity-100'}`}></div>
//                         <div className={`absolute top-3.5 left-1/2 transform -translate-x-1/2 w-2 h-0.5 border-t border-gray-600 rounded-full transition-all duration-300 ${password ? 'opacity-100' : 'opacity-0'}`}></div>
//                       </div>
//                     </div>
//                   </div>
                  
//                   <CardTitle className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
//                     Welcome Back
//                   </CardTitle>
//                   <CardDescription className="text-gray-600 text-base">
//                     Sign in to access your audit dashboard
//                   </CardDescription>
//                 </div>
//               </CardHeader>

//               <CardContent className="px-8 pb-8">
//                 <div className="space-y-6">
//                   {/* Username field */}
//                   <div className="space-y-2">
//                     <label htmlFor="username" className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
//                       <User className="h-4 w-4 text-red-600" />
//                       <span>Username</span>
//                     </label>
//                     <div className="relative group">
//                       <Input
//                         id="username"
//                         type="text"
//                         value={username}
//                         onChange={(e) => setUsername(e.target.value)}
//                         onKeyPress={handleKeyPress}
//                         placeholder="Enter your username"
//                         className="bg-white/80 border-2 border-gray-200 focus:border-red-500 focus:ring-4 focus:ring-red-500/20 rounded-xl px-4 py-3 text-base transition-all duration-300 hover:border-red-300 pl-12"
//                       />
//                       <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-red-500 transition-colors duration-300" />
//                     </div>
//                   </div>

//                   {/* Password field */}
//                   <div className="space-y-2">
//                     <label htmlFor="password" className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
//                       <Lock className="h-4 w-4 text-red-600" />
//                       <span>Password</span>
//                     </label>
//                     <div className="relative group">
//                       <Input
//                         id="password"
//                         type={showPassword ? 'text' : 'password'}
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         onKeyPress={handleKeyPress}
//                         placeholder="Enter your password"
//                         className="bg-white/80 border-2 border-gray-200 focus:border-red-500 focus:ring-4 focus:ring-red-500/20 rounded-xl px-4 py-3 text-base transition-all duration-300 hover:border-red-300 pl-12 pr-12"
//                       />
//                       <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-red-500 transition-colors duration-300" />
//                       <button
//                         type="button"
//                         onClick={() => setShowPassword(!showPassword)}
//                         className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-lg transition-all duration-200"
//                       >
//                         {showPassword ? (
//                           <EyeOff className="h-5 w-5 text-gray-500 hover:text-red-500 transition-colors duration-200" />
//                         ) : (
//                           <Eye className="h-5 w-5 text-gray-500 hover:text-red-500 transition-colors duration-200" />
//                         )}
//                       </button>
//                     </div>
//                   </div>

//                   {/* Error message */}
//                   {error && (
//                     <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
//                       <div className="flex items-center space-x-2">
//                         <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
//                         <span>{error}</span>
//                       </div>
//                     </div>
//                   )}

//                   {/* Submit button */}
//                   <button
//                     onClick={handleSubmit}
//                     disabled={isLoading}
//                     className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none group flex items-center justify-center space-x-2"
//                   >
//                     {isLoading ? (
//                       <>
//                         <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
//                         <span>Signing in...</span>
//                       </>
//                     ) : (
//                       <>
//                         <span>Sign In</span>
//                         <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
//                       </>
//                     )}
//                   </button>
//                 </div>

//                 <div className="mt-6 text-center">
//                   <p className="text-xs text-gray-500 flex items-center justify-center space-x-1">
//                     <Shield className="h-3 w-3" />
//                     <span>Your connection is secured with end-to-end encryption</span>
//                   </p>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </div>

//       {/* Animated particles */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         {[...Array(20)].map((_, i) => (
//           <div
//             key={i}
//             className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
//             style={{
//               left: `${Math.random() * 100}%`,
//               top: `${Math.random() * 100}%`,
//               animationDelay: `${Math.random() * 3}s`,
//               animationDuration: `${3 + Math.random() * 2}s`,
//             }}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// // Demo wrapper to test the component
// export default function App() {
//   const handleLogin = async (username: string, password: string) => {
//     console.log('App handleLogin called with:', username, password);
    
//     // Simulate API call
//     await new Promise(resolve => setTimeout(resolve, 2000));
    
//     // For demo purposes
//     if (username === 'admin' && password === 'password') {
//       alert('Login successful! Welcome to Audit Finding MS');
//       return { success: true };
//     } else {
//       return { 
//         success: false, 
//         error: 'Invalid credentials. Try username: admin, password: password' 
//       };
//     }
//   };

//   return <LoginForm onLogin={handleLogin} />;
// }

// import { useState, useRef } from 'react';
// import { Eye, EyeOff, Lock, User, ArrowRight, Shield, CheckCircle, TrendingUp, AlertTriangle, Monitor, Clock, Smartphone, LogOut } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from '@/components/ui/dialog';
// import { Alert, AlertDescription } from '@/components/ui/alert';

// interface SessionInfo {
//   lastActivity: string;
//   ipAddress: string;
//   deviceInfo: string;
//   loginTime: string;
// }

// interface LoginFormProps {
//   onLogin?: (username: string, password: string, force?: boolean) => Promise<{ 
//     success: boolean; 
//     error?: string;
//     code?: string;
//     sessionInfo?: SessionInfo;
//     requiresForce?: boolean;
//   }>;
// }

// export const LoginForm = ({ onLogin }: LoginFormProps) => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');
  
//   // Session conflict state
//   const [sessionConflict, setSessionConflict] = useState<SessionInfo | null>(null);
//   const [showSessionDialog, setShowSessionDialog] = useState(false);
//   const isSubmitting = useRef(false)

//   const handleSubmit = async (force: boolean = false) => {

//     if(isSubmitting.current) {
//       console.log('Submit already in progress, ignoring additional click');
//       return;
//     }
//     console.log('Submit button clicked!', { force });

    
//     // Clear any previous errors
//     setError('');
    
//     // Validation
//     if (!username.trim()) {
//       setError('Username is required');
//       return;
//     }
    
//     if (!password.trim()) {
//       setError('Password is required');
//       return;
//     }


//     isSubmitting.current = true; // Prevent multiple submissions
//     setIsLoading(true)
    
//     setIsLoading(true);
    
//     try {
//       if (onLogin) {
//         // Call the onLogin prop function
//         const result = await onLogin(username, password, force);
        
//         // Check for session conflict
//         if (result.requiresForce && !force) {
//           setSessionConflict(result.sessionInfo || null);
//           setShowSessionDialog(true);
//           setError('');
//         } else if (!result.success && !result.requiresForce) {
//           setError(result.error || 'Invalid username or password');
//           setShowSessionDialog(false);
//         } else if (result.success) {
//           // Success - clear form
//           setUsername('');
//           setPassword('');
//           setError('');
//           setShowSessionDialog(false);
//           setSessionConflict(null);
//         }
//       } 
//     } catch (err) {
//       console.error('Login error:', err);
//       setError('An unexpected error occurred. Please try again.');
//     } finally {
//       setIsLoading(false);

//       setTimeout(() => {
//         isSubmitting.current = false; // Allow next submission
//       }, 1000); // Reset after 1 second
//     }
//   };

//   const handleForceLogin = () => {
//     setShowSessionDialog(false);
//     handleSubmit(true);
//   };

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === 'Enter' && !isLoading && !showSessionDialog && !isSubmitting.current) {
//       handleSubmit();
//     }
//   };

//   const formatDateTime = (dateString: string) => {
//     if (!dateString) return 'Unknown';
//     return new Date(dateString).toLocaleString();
//   };

//   const getDeviceIcon = (deviceInfo?: string) => {
//     if (!deviceInfo) return <Monitor className="h-4 w-4" />;
//     const device = deviceInfo.toLowerCase();
//     if (device.includes('mobile') || device.includes('android') || device.includes('iphone')) {
//       return <Smartphone className="h-4 w-4" />;
//     }
//     return <Monitor className="h-4 w-4" />;
//   };

//   return (
//     <>
//       <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-black relative overflow-hidden">
//         {/* Your existing animated background elements */}
//         <div className="absolute inset-0">
//           <div className="absolute top-20 left-10 w-32 h-32 bg-red-500/10 rounded-full blur-xl animate-pulse"></div>
//           <div className="absolute top-40 right-20 w-48 h-48 bg-white/5 rounded-full blur-2xl animate-bounce" style={{ animationDuration: '3s' }}></div>
//           <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-red-400/20 rounded-full blur-lg animate-pulse" style={{ animationDelay: '1s' }}></div>
//           <div className="absolute top-1/3 right-1/3 w-16 h-16 bg-white/10 rotate-45 animate-spin" style={{ animationDuration: '8s' }}></div>
          
//           <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
          
//           <div className="absolute top-0 left-0 w-full h-full">
//             <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-red-600/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }}></div>
//             <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-l from-white/10 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '2s' }}></div>
//           </div>
//         </div>

//         <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
//           <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
//             {/* Left side - Your existing branding */}
//             <div className="text-center lg:text-left space-y-8">
//               <div className="space-y-6">
//                 <div className="flex items-center justify-center lg:justify-start space-x-6">
//                   <div className="relative group">
//                     <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-800 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300 animate-pulse"></div>
//                     <div className="relative flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-600 to-red-800 rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300">
//                       <div className="text-white text-2xl font-bold">ZB</div>
//                     </div>
//                   </div>
//                   <div>
//                     <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white via-red-100 to-white bg-clip-text text-transparent">
//                       Audit Finding MS
//                     </h1>
//                     <p className="text-red-300 text-lg font-medium">Management System</p>
//                   </div>
//                 </div>

//                 <div>
//                   <p className="text-xl text-gray-300 max-w-lg mx-auto lg:mx-0 leading-relaxed">
//                     Streamline your audit process with our comprehensive management system designed for professional excellence
//                   </p>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto lg:mx-0">
//                   <div className="flex items-center space-x-3 text-white/90 group hover:text-white transition-colors duration-300">
//                     <div className="p-2 bg-red-600/20 rounded-lg group-hover:bg-red-600/30 transition-colors duration-300">
//                       <Shield className="h-5 w-5" />
//                     </div>
//                     <span className="text-sm font-medium">Single Session</span>
//                   </div>
//                   <div className="flex items-center space-x-3 text-white/90 group hover:text-white transition-colors duration-300">
//                     <div className="p-2 bg-red-600/20 rounded-lg group-hover:bg-red-600/30 transition-colors duration-300">
//                       <TrendingUp className="h-5 w-5" />
//                     </div>
//                     <span className="text-sm font-medium">Real-time Analytics</span>
//                   </div>
//                   <div className="flex items-center space-x-3 text-white/90 group hover:text-white transition-colors duration-300">
//                     <div className="p-2 bg-red-600/20 rounded-lg group-hover:bg-red-600/30 transition-colors duration-300">
//                       <CheckCircle className="h-5 w-5" />
//                     </div>
//                     <span className="text-sm font-medium">Compliance Ready</span>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Right side - Your existing login form with session alert */}
//             <div className="flex justify-center lg:justify-end">
//               <Card className="w-full max-w-md bg-white/95 backdrop-blur-xl shadow-2xl border-0 rounded-3xl overflow-hidden relative group hover:shadow-red-500/20 transition-all duration-500">
//                 <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-transparent to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
//                 <CardHeader className="text-center pb-8 pt-8 relative">
//                   <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-red-500 to-red-600"></div>
                  
//                   <div className="space-y-4">
//                     {/* Your existing animated avatar */}
//                     <div>
//                       <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-600 to-red-700 rounded-2xl mb-4 shadow-lg hover:shadow-red-500/30 transition-all duration-300 hover:scale-105 relative overflow-hidden">
//                         <div className="relative w-12 h-12">
//                           <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-white rounded-full"></div>
                          
//                           <div className="absolute top-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
//                             <div className={`w-1 h-1 bg-gray-800 rounded-full transition-all duration-300 ${password ? 'opacity-0' : 'opacity-100'}`}></div>
//                             <div className={`w-1 h-1 bg-gray-800 rounded-full transition-all duration-300 ${password ? 'opacity-0' : 'opacity-100'}`}></div>
//                           </div>
                          
//                           <div className={`absolute top-1.5 left-1/2 transform -translate-x-1/2 transition-all duration-500 ${password ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}>
//                             <div className="flex space-x-0.5">
//                               <div className="w-1.5 h-1 bg-orange-200 rounded-sm"></div>
//                               <div className="w-1.5 h-1 bg-orange-200 rounded-sm"></div>
//                             </div>
//                           </div>
                          
//                           <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-6 h-4 bg-white rounded-t-lg"></div>
                          
//                           <div className={`absolute top-7 left-1/2 transform -translate-x-1/2 transition-all duration-500 ${password ? '-translate-y-1' : 'translate-y-0'}`}>
//                             <div className="flex justify-between w-8">
//                               <div className="w-1 h-3 bg-orange-200 rounded-full transform -rotate-12"></div>
//                               <div className="w-1 h-3 bg-orange-200 rounded-full transform rotate-12"></div>
//                             </div>
//                           </div>
                          
//                           <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
//                             <div className="flex space-x-1">
//                               <div className="w-1 h-2 bg-blue-400 rounded-full"></div>
//                               <div className="w-1 h-2 bg-blue-400 rounded-full"></div>
//                             </div>
//                           </div>
                          
//                           <div className={`absolute top-3.5 left-1/2 transform -translate-x-1/2 w-2 h-0.5 border-b border-gray-600 rounded-full transition-all duration-300 ${password ? 'opacity-0' : 'opacity-100'}`}></div>
//                           <div className={`absolute top-3.5 left-1/2 transform -translate-x-1/2 w-2 h-0.5 border-t border-gray-600 rounded-full transition-all duration-300 ${password ? 'opacity-100' : 'opacity-0'}`}></div>
//                         </div>
//                       </div>
//                     </div>
                    
//                     <CardTitle className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
//                       Welcome Back
//                     </CardTitle>
//                     <CardDescription className="text-gray-600 text-base">
//                       Sign in to access your audit dashboard
//                     </CardDescription>
//                   </div>
//                 </CardHeader>

//                 <CardContent className="px-8 pb-8">
//                   <div className="space-y-6">
//                     {/* Username field */}
//                     <div className="space-y-2">
//                       <label htmlFor="username" className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
//                         <User className="h-4 w-4 text-red-600" />
//                         <span>Username</span>
//                       </label>
//                       <div className="relative group">
//                         <Input
//                           id="username"
//                           type="text"
//                           value={username}
//                           onChange={(e) => setUsername(e.target.value)}
//                           onKeyPress={handleKeyPress}
//                           placeholder="Enter your username"
//                           className="bg-white/80 border-2 border-gray-200 focus:border-red-500 focus:ring-4 focus:ring-red-500/20 rounded-xl px-4 py-3 text-base transition-all duration-300 hover:border-red-300 pl-12"
//                           disabled={isLoading}
//                         />
//                         <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-red-500 transition-colors duration-300" />
//                       </div>
//                     </div>

//                     {/* Password field */}
//                     <div className="space-y-2">
//                       <label htmlFor="password" className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
//                         <Lock className="h-4 w-4 text-red-600" />
//                         <span>Password</span>
//                       </label>
//                       <div className="relative group">
//                         <Input
//                           id="password"
//                           type={showPassword ? 'text' : 'password'}
//                           value={password}
//                           onChange={(e) => setPassword(e.target.value)}
//                           onKeyPress={handleKeyPress}
//                           placeholder="Enter your password"
//                           className="bg-white/80 border-2 border-gray-200 focus:border-red-500 focus:ring-4 focus:ring-red-500/20 rounded-xl px-4 py-3 text-base transition-all duration-300 hover:border-red-300 pl-12 pr-12"
//                           disabled={isLoading}
//                         />
//                         <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-red-500 transition-colors duration-300" />
//                         <button
//                           type="button"
//                           onClick={() => setShowPassword(!showPassword)}
//                           className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-lg transition-all duration-200"
//                         >
//                           {showPassword ? (
//                             <EyeOff className="h-5 w-5 text-gray-500 hover:text-red-500 transition-colors duration-200" />
//                           ) : (
//                             <Eye className="h-5 w-5 text-gray-500 hover:text-red-500 transition-colors duration-200" />
//                           )}
//                         </button>
//                       </div>
//                     </div>

//                     {/* Error message */}
//                     {error && (
//                       <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
//                         <div className="flex items-center space-x-2">
//                           <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
//                           <span>{error}</span>
//                         </div>
//                       </div>
//                     )}

//                     {/* Submit button */}
//                     <button
//                       onClick={() => handleSubmit(false)}
//                       disabled={isLoading || isSubmitting.current}
//                       className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none group flex items-center justify-center space-x-2"
//                     >
//                       {isLoading ? (
//                         <>
//                           <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
//                           <span>Signing in...</span>
//                         </>
//                       ) : (
//                         <>
//                           <span>Sign In</span>
//                           <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
//                         </>
//                       )}
//                     </button>
//                   </div>

//                   <div className="mt-6 text-center">
//                     <Alert className="bg-amber-50 border-amber-200">
//                       <Shield className="h-4 w-4 text-amber-600" />
//                       <AlertDescription className="text-xs text-amber-800">
//                         <strong>Single Session Policy:</strong> Only one active login allowed per user
//                       </AlertDescription>
//                     </Alert>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
//           </div>
//         </div>

//         {/* Animated particles */}
//         <div className="absolute inset-0 overflow-hidden pointer-events-none">
//           {[...Array(20)].map((_, i) => (
//             <div
//               key={i}
//               className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
//               style={{
//                 left: `${Math.random() * 100}%`,
//                 top: `${Math.random() * 100}%`,
//                 animationDelay: `${Math.random() * 3}s`,
//                 animationDuration: `${3 + Math.random() * 2}s`,
//               }}
//             />
//           ))}
//         </div>
//       </div>

//       {/* Session Conflict Dialog */}
//       <Dialog open={showSessionDialog} onOpenChange={setShowSessionDialog}>
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader>
//             <DialogTitle className="flex items-center gap-2">
//               <AlertTriangle className="h-5 w-5 text-amber-500" />
//               Active Session Detected
//             </DialogTitle>
//             <DialogDescription>
//               You are already logged in from another device or browser.
//             </DialogDescription>
//           </DialogHeader>
          
//           {sessionConflict && (
//             <div className="space-y-4">
//               <div className="bg-amber-50 rounded-lg p-4 space-y-3">
//                 <h4 className="font-semibold text-sm text-amber-900">Current Session Details:</h4>
                
//                 <div className="space-y-2 text-sm">
//                   <div className="flex items-center gap-2">
//                     {getDeviceIcon(sessionConflict.deviceInfo)}
//                     <span className="font-medium">Device:</span>
//                     <span className="text-gray-600">{sessionConflict.deviceInfo || 'Unknown Device'}</span>
//                   </div>
                  
//                   <div className="flex items-center gap-2">
//                     <Clock className="h-4 w-4" />
//                     <span className="font-medium">Last Active:</span>
//                     <span className="text-gray-600">{formatDateTime(sessionConflict.lastActivity)}</span>
//                   </div>
                  
//                   {sessionConflict.ipAddress && (
//                     <div className="flex items-center gap-2">
//                       <Monitor className="h-4 w-4" />
//                       <span className="font-medium">IP Address:</span>
//                       <span className="text-gray-600">{sessionConflict.ipAddress}</span>
//                     </div>
//                   )}
                  
//                   <div className="flex items-center gap-2">
//                     <Clock className="h-4 w-4" />
//                     <span className="font-medium">Login Time:</span>
//                     <span className="text-gray-600">{formatDateTime(sessionConflict.loginTime)}</span>
//                   </div>
//                 </div>
//               </div>
              
//               <Alert className="bg-red-50 border-red-200">
//                 <AlertTriangle className="h-4 w-4 text-red-600" />
//                 <AlertDescription className="text-sm text-red-800">
//                   <strong>Warning:</strong> Force login will immediately terminate the other session.
//                 </AlertDescription>
//               </Alert>
//             </div>
//           )}
          
//           <DialogFooter className="flex gap-2">
//             <Button
//               variant="outline"
//               onClick={() => setShowSessionDialog(false)}
//               className="flex-1"
//             >
//               Cancel
//             </Button>
//             <Button
//               onClick={handleForceLogin}
//               disabled={isLoading}
//               className="flex-1 bg-red-600 hover:bg-red-700 text-white"
//             >
//               {isLoading ? (
//                 <>
//                   <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
//                   <span>Forcing...</span>
//                 </>
//               ) : (
//                 <>
//                   <LogOut className="h-4 w-4 mr-2" />
//                   <span>Force Login</span>
//                 </>
//               )}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// };









import { useState, useRef } from 'react';
import { Eye, EyeOff, Lock, User, ArrowRight, Shield, CheckCircle, TrendingUp, AlertTriangle, Monitor, Clock, Smartphone, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface SessionInfo {
  lastActivity: string;
  ipAddress: string;
  deviceInfo: string;
  loginTime: string;
}

interface LoginFormProps {
  onLogin?: (username: string, password: string, force?: boolean) => Promise<{ 
    success: boolean; 
    error?: string;
    code?: string;
    sessionInfo?: SessionInfo;
    requiresForce?: boolean;
  }>;
}

export default function LoginForm({ onLogin }: LoginFormProps = {}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [forceLogin, setForceLogin] = useState(false);
  
  // Session conflict state
  const [sessionConflict, setSessionConflict] = useState<SessionInfo | null>(null);
  const [showSessionDialog, setShowSessionDialog] = useState(false);
  const isSubmitting = useRef(false);

  const handleSubmit = async (forceOverride?: boolean) => {
    const force = forceOverride !== undefined ? forceOverride : forceLogin;

    if(isSubmitting.current) {
      console.log('Submit already in progress, ignoring additional click');
      return;
    }
    console.log('Submit button clicked!', { force, forceLogin, forceOverride });
    
    setError('');
    
    if (!username.trim()) {
      setError('Username is required');
      return;
    }
    
    if (!password.trim()) {
      setError('Password is required');
      return;
    }

    isSubmitting.current = true;
    setIsLoading(true);
    
    try {
      if (onLogin) {
        const result = await onLogin(username, password, force);
        
        if (result.requiresForce && !force) {
          setSessionConflict(result.sessionInfo || null);
          setShowSessionDialog(true);
          setError('');
        } else if (!result.success && !result.requiresForce) {
          setError(result.error || 'Invalid username or password');
          setShowSessionDialog(false);
        } else if (result.success) {
          setUsername('');
          setPassword('');
          setError('');
          setForceLogin(false);
          setShowSessionDialog(false);
          setSessionConflict(null);
        }
      } else {
        // Demo mode - just show success
        console.log('Login attempted with:', { username, password, force });
        setUsername('');
        setPassword('');
        setError('');
        setForceLogin(false);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        isSubmitting.current = false;
      }, 1000);
    }
  };

  const handleForceLoginFromDialog = () => {
    setShowSessionDialog(false);
    handleSubmit(true);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading && !showSessionDialog && !isSubmitting.current) {
      handleSubmit();
    }
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleString();
  };

  const getDeviceIcon = (deviceInfo?: string) => {
    if (!deviceInfo) return <Monitor className="h-4 w-4" />;
    const device = deviceInfo.toLowerCase();
    if (device.includes('mobile') || device.includes('android') || device.includes('iphone')) {
      return <Smartphone className="h-4 w-4" />;
    }
    return <Monitor className="h-4 w-4" />;
  };

  const toggleForceLogin = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setForceLogin(prev => !prev);
    console.log('Force login toggled to:', !forceLogin);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-black relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-red-500/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-48 h-48 bg-white/5 rounded-full blur-2xl animate-bounce" style={{ animationDuration: '3s' }}></div>
          <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-red-400/20 rounded-full blur-lg animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/3 right-1/3 w-16 h-16 bg-white/10 rotate-45 animate-spin" style={{ animationDuration: '8s' }}></div>
          
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
          
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-red-600/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }}></div>
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-l from-white/10 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '2s' }}></div>
          </div>
        </div>

        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left side - Branding */}
            <div className="text-center lg:text-left space-y-8">
              <div className="space-y-6">
                <div className="flex items-center justify-center lg:justify-start space-x-6">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-800 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300 animate-pulse"></div>
                    <div className="relative flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-600 to-red-800 rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300">
                      <div className="text-white text-2xl font-bold">ZB</div>
                    </div>
                  </div>
                  <div>
                    <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white via-red-100 to-white bg-clip-text text-transparent">
                      Audit Finding MS
                    </h1>
                    <p className="text-red-300 text-lg font-medium">Management System</p>
                  </div>
                </div>

                <div>
                  <p className="text-xl text-gray-300 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                    Streamline your audit process with our comprehensive management system designed for professional excellence
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto lg:mx-0">
                  <div className="flex items-center space-x-3 text-white/90 group hover:text-white transition-colors duration-300">
                    <div className="p-2 bg-red-600/20 rounded-lg group-hover:bg-red-600/30 transition-colors duration-300">
                      <Shield className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-medium">Single Session</span>
                  </div>
                  <div className="flex items-center space-x-3 text-white/90 group hover:text-white transition-colors duration-300">
                    <div className="p-2 bg-red-600/20 rounded-lg group-hover:bg-red-600/30 transition-colors duration-300">
                      <TrendingUp className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-medium">Real-time Analytics</span>
                  </div>
                  <div className="flex items-center space-x-3 text-white/90 group hover:text-white transition-colors duration-300">
                    <div className="p-2 bg-red-600/20 rounded-lg group-hover:bg-red-600/30 transition-colors duration-300">
                      <CheckCircle className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-medium">Compliance Ready</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Login form */}
            <div className="flex justify-center lg:justify-end">
              <Card className="w-full max-w-md bg-white/95 backdrop-blur-xl shadow-2xl border-0 rounded-3xl overflow-hidden relative group hover:shadow-red-500/20 transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-transparent to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <CardHeader className="text-center pb-8 pt-8 relative">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-red-500 to-red-600"></div>
                  
                  <div className="space-y-4">
                    {/* Animated avatar */}
                    <div>
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-600 to-red-700 rounded-2xl mb-4 shadow-lg hover:shadow-red-500/30 transition-all duration-300 hover:scale-105 relative overflow-hidden">
                        <div className="relative w-12 h-12">
                          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-white rounded-full"></div>
                          
                          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                            <div className={`w-1 h-1 bg-gray-800 rounded-full transition-all duration-300 ${password ? 'opacity-0' : 'opacity-100'}`}></div>
                            <div className={`w-1 h-1 bg-gray-800 rounded-full transition-all duration-300 ${password ? 'opacity-0' : 'opacity-100'}`}></div>
                          </div>
                          
                          <div className={`absolute top-1.5 left-1/2 transform -translate-x-1/2 transition-all duration-500 ${password ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}>
                            <div className="flex space-x-0.5">
                              <div className="w-1.5 h-1 bg-orange-200 rounded-sm"></div>
                              <div className="w-1.5 h-1 bg-orange-200 rounded-sm"></div>
                            </div>
                          </div>
                          
                          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-6 h-4 bg-white rounded-t-lg"></div>
                          
                          <div className={`absolute top-7 left-1/2 transform -translate-x-1/2 transition-all duration-500 ${password ? '-translate-y-1' : 'translate-y-0'}`}>
                            <div className="flex justify-between w-8">
                              <div className="w-1 h-3 bg-orange-200 rounded-full transform -rotate-12"></div>
                              <div className="w-1 h-3 bg-orange-200 rounded-full transform rotate-12"></div>
                            </div>
                          </div>
                          
                          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
                            <div className="flex space-x-1">
                              <div className="w-1 h-2 bg-blue-400 rounded-full"></div>
                              <div className="w-1 h-2 bg-blue-400 rounded-full"></div>
                            </div>
                          </div>
                          
                          <div className={`absolute top-3.5 left-1/2 transform -translate-x-1/2 w-2 h-0.5 border-b border-gray-600 rounded-full transition-all duration-300 ${password ? 'opacity-0' : 'opacity-100'}`}></div>
                          <div className={`absolute top-3.5 left-1/2 transform -translate-x-1/2 w-2 h-0.5 border-t border-gray-600 rounded-full transition-all duration-300 ${password ? 'opacity-100' : 'opacity-0'}`}></div>
                        </div>
                      </div>
                    </div>
                    
                    <CardTitle className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                      Welcome Back
                    </CardTitle>
                    <CardDescription className="text-gray-600 text-base">
                      Sign in to access your audit dashboard
                    </CardDescription>
                  </div>
                </CardHeader>

                <CardContent className="px-8 pb-8">
                  <div className="space-y-6">
                    {/* Username field */}
                    <div className="space-y-2">
                      <label htmlFor="username" className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                        <User className="h-4 w-4 text-red-600" />
                        <span>Username</span>
                      </label>
                      <div className="relative group">
                        <Input
                          id="username"
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Enter your username"
                          className="bg-white/80 border-2 border-gray-200 focus:border-red-500 focus:ring-4 focus:ring-red-500/20 rounded-xl px-4 py-3 text-base transition-all duration-300 hover:border-red-300 pl-12"
                          disabled={isLoading}
                        />
                        <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-red-500 transition-colors duration-300" />
                      </div>
                    </div>

                    {/* Password field */}
                    <div className="space-y-2">
                      <label htmlFor="password" className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                        <Lock className="h-4 w-4 text-red-600" />
                        <span>Password</span>
                      </label>
                      <div className="relative group">
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Enter your password"
                          className="bg-white/80 border-2 border-gray-200 focus:border-red-500 focus:ring-4 focus:ring-red-500/20 rounded-xl px-4 py-3 text-base transition-all duration-300 hover:border-red-300 pl-12 pr-12"
                          disabled={isLoading}
                        />
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-red-500 transition-colors duration-300" />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-lg transition-all duration-200"
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-500 hover:text-red-500 transition-colors duration-200" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-500 hover:text-red-500 transition-colors duration-200" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Force Login Toggle - Fixed implementation */}
                    <div className="relative z-50">
                      <div 
                        onClick={toggleForceLogin}
                        className={`
                          w-full p-3 rounded-xl cursor-pointer select-none
                          transition-all duration-300 transform hover:scale-[1.02]
                          ${forceLogin 
                            ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-lg' 
                            : 'bg-gray-100 hover:bg-gray-200 border-2 border-gray-300'
                          }
                        `}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`
                              p-2 rounded-lg transition-all duration-300
                              ${forceLogin ? 'bg-white/20' : 'bg-gray-200'}
                            `}>
                              <LogOut className={`h-5 w-5 ${forceLogin ? 'text-white' : 'text-gray-600'}`} />
                            </div>
                            <div>
                              <p className={`font-semibold ${forceLogin ? 'text-white' : 'text-gray-700'}`}>
                                Force Login
                              </p>
                              <p className={`text-xs ${forceLogin ? 'text-amber-100' : 'text-gray-500'}`}>
                                Override existing session
                              </p>
                            </div>
                          </div>
                          
                          {/* Toggle switch */}
                          <div className={`
                            relative w-14 h-7 rounded-full transition-all duration-300
                            ${forceLogin ? 'bg-amber-700' : 'bg-gray-300'}
                          `}>
                            <div className={`
                              absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md
                              transition-all duration-300 transform
                              ${forceLogin ? 'translate-x-7' : 'translate-x-0.5'}
                            `} />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Force Login Info Alert */}
                    {forceLogin && (
                      <Alert className="bg-amber-50 border-amber-300">
                        <AlertTriangle className="h-4 w-4 text-amber-600" />
                        <AlertDescription className="text-xs text-amber-800">
                          <strong>Warning:</strong> This will terminate any existing session for this account
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* Error message */}
                    {error && (
                      <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                          <span>{error}</span>
                        </div>
                      </div>
                    )}

                    {/* Submit button */}
                    <button
                      type="button"
                      onClick={() => handleSubmit()}
                      disabled={isLoading || isSubmitting.current}
                      className={`
                        w-full py-3 px-6 rounded-xl font-semibold
                        transition-all duration-300 transform
                        flex items-center justify-center gap-2
                        ${isLoading || isSubmitting.current
                          ? 'bg-gray-400 cursor-not-allowed opacity-50'
                          : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 hover:scale-[1.02] shadow-lg hover:shadow-xl cursor-pointer'
                        }
                        text-white group
                      `}
                    >
                      {isLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Signing in...</span>
                        </>
                      ) : (
                        <>
                          <span>Sign In</span>
                          <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                        </>
                      )}
                    </button>
                  </div>

                  <div className="mt-6 text-center">
                    <Alert className="bg-blue-50 border-blue-200">
                      <Shield className="h-4 w-4 text-blue-600" />
                      <AlertDescription className="text-xs text-blue-800">
                        <strong>Single Session Policy:</strong> Only one active login allowed per user
                      </AlertDescription>
                    </Alert>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Animated particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Session Conflict Dialog */}
      <Dialog open={showSessionDialog} onOpenChange={setShowSessionDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Active Session Detected
            </DialogTitle>
            <DialogDescription>
              You are already logged in from another device or browser.
            </DialogDescription>
          </DialogHeader>
          
          {sessionConflict && (
            <div className="space-y-4">
              <div className="bg-amber-50 rounded-lg p-4 space-y-3">
                <h4 className="font-semibold text-sm text-amber-900">Current Session Details:</h4>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    {getDeviceIcon(sessionConflict.deviceInfo)}
                    <span className="font-medium">Device:</span>
                    <span className="text-gray-600">{sessionConflict.deviceInfo || 'Unknown Device'}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span className="font-medium">Last Active:</span>
                    <span className="text-gray-600">{formatDateTime(sessionConflict.lastActivity)}</span>
                  </div>
                  
                  {sessionConflict.ipAddress && (
                    <div className="flex items-center gap-2">
                      <Monitor className="h-4 w-4" />
                      <span className="font-medium">IP Address:</span>
                      <span className="text-gray-600">{sessionConflict.ipAddress}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span className="font-medium">Login Time:</span>
                    <span className="text-gray-600">{formatDateTime(sessionConflict.loginTime)}</span>
                  </div>
                </div>
              </div>
              
              <Alert className="bg-red-50 border-red-200">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-sm text-red-800">
                  <strong>Warning:</strong> Force login will immediately terminate the other session.
                </AlertDescription>
              </Alert>
            </div>
          )}
          
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowSessionDialog(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleForceLoginFromDialog}
              disabled={isLoading}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  <span>Forcing...</span>
                </>
              ) : (
                <>
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>Force Login</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}