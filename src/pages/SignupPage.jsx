import { Link } from "react-router-dom";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      
      {/* Background Glow Effect (Purple tint for variety) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

      <div className="card w-full max-w-md relative z-10">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-tr from-purple-500 to-pink-600 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.4)] mb-4">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Create your account</h1>
          <p className="text-slate-400 text-sm">Join NEXUS and supercharge your studies</p>
        </div>

        {/* Signup Form (Ready for your backend onSubmit handler) */}
        <form className="space-y-5">
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5" htmlFor="name">
              Full Name
            </label>
            <input 
              type="text" 
              id="name"
              className="input" 
              placeholder="John Doe" 
              required 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5" htmlFor="email">
              University Email
            </label>
            <input 
              type="email" 
              id="email"
              className="input" 
              placeholder="student@university.edu" 
              required 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5" htmlFor="password">
              Password
            </label>
            <input 
              type="password" 
              id="password"
              className="input" 
              placeholder="••••••••" 
              required 
              minLength="8"
            />
          </div>

          {/* Your custom .btn class from index.css */}
          <button type="submit" className="btn mt-4">
            Start Learning
          </button>

        </form>

        {/* Footer Link */}
        <div className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-purple-400 font-semibold hover:text-purple-300 transition-colors">
            Log in here
          </Link>
        </div>

      </div>
    </div>
  );
}