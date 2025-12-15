import { SignInButton, useAuth, UserButton } from "@clerk/clerk-react";
import { Link, useLocation } from "react-router"
import { ArrowRightIcon, BookOpenIcon, SparklesIcon } from "lucide-react"

const Navbar = () => {
    const location = useLocation();
    const { isSignedIn } = useAuth();

    const isActive = (path) =>{
        return location.pathname === path;
    }

    return (
        <nav className="bg-base-100/80 backdrop-blur-md border-b border-primary/20 sticky top-0 z-50 shadow-lg">
            <div className="max-w-7xl mx-auto p-4 flex items-center justify-between">
                <Link to={"/"}
                    className="flex items-center gap-3 hover:scale-105 transition-transform duration-200"
                >
                    <div className="size-10 rounded-xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center shadow-lg">
                        <SparklesIcon className="size-6 text-white" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-black text-xl bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent font-mono tracking-wider">Coding Platform</span>
                        <span className="text-sm text-base-content/60 font-medium -mt-1">Code Together</span>
                    </div>
                </Link>

                {!isSignedIn ? (<SignInButton mode="modal">
                    <button className="group px-6 py-3 bg-gradient-to-r from-primary to-secondary rounded-xl text-white font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 flex items-center gap-2">
                        <span>Get Started</span>
                        <ArrowRightIcon className="size-4 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                </SignInButton>) :

                (<div className="flex items-center gap-1">
                    <Link 
                    to={"/problems"}
                    className={`px-4 py-2.5 rounded-lg transition-all duration-200 ${isActive("/problems") ? "bg-primary text-primary-content" : "hover:bg-base-200 text-base-content/70 hover:text-base-content"}`}
                    >
                        <div className="flex items-center gap-x-2.5">
                            <BookOpenIcon className="size-4" />
                            <span className="font-medium hidden sm:inline">problems</span>
                        </div>
                    </Link>

                    <Link 
                    to={"/dashboard"}
                    className={`px-4 py-2.5 rounded-lg transition-all duration-200 ${isActive("/dashboard") ? "bg-primary text-primary-content" : "hover:bg-base-200 text-base-content/70 hover:text-base-content"}`}
                    >
                        <div className="flex items-center gap-x-2.5">
                            <BookOpenIcon className="size-4" />
                            <span className="font-medium hidden sm:inline">Dashboard</span>
                        </div>
                    </Link>

                    <div className="ml-4 mt-2">
                        <UserButton />
                    </div>
                </div>)}
            </div>
        </nav>
    )
}

export default Navbar;