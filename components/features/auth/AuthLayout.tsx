import { Link, useNavigate } from "react-router-dom";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col ">
      {/* Header */}
      <header className="border-b backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to='/' onClick={()=>window.scrollTo(0,0)}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center space-x-2">
                  <img alt="WazifaMe Logo" loading="lazy" className="inline-block rounded w-[148px] h-[48px] object-contain object-left" src="https://www.wazifame.com//_next/static/media/logo.a0469633.svg?w=256&q=100 1x, https://www.wazifame.com//_next/static/media/logo.a0469633.svg?w=384&q=100 2x" />
                  <div className="h-10 w-0.5 bg-gray-300"></div>
                  <h1 className="font-14 text-gray-400 font-normal leading-6">Careers</h1>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 pt-2 pb-6">
        <div className="w-full max-w-lg">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6">
        <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
          <a href="#" className="hover:text-foreground transition-colors">About us</a>
          <a href="#" className="hover:text-foreground transition-colors">Contact us</a>
          <a href="#" className="hover:text-foreground transition-colors">Blogs</a>
          <a href="#" className="hover:text-foreground transition-colors">Terms & Conditions</a>
          <a href="#" className="hover:text-foreground transition-colors">Privacy policy</a>
        </div>
      </footer>
    </div>
  );
};

export default AuthLayout;
