import { useNavigate } from "react-router-dom"
import { HiArrowPath, HiHome } from "react-icons/hi2"

function ConnectionStatusPage() {
    return (
        <div className="relative flex h-screen min-h-screen flex-col items-center justify-center gap-8 overflow-hidden px-4">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-danger/20 blur-3xl animate-pulse-slow" />
                <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-warning/20 blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
            </div>

            <div className="relative z-10 text-center">
                <ConnectionError />
            </div>
        </div>
    )
}

const ConnectionError = () => {
    const navigate = useNavigate()
    const reloadPage = () => {
        window.location.reload()
    }

    const gotoHomePage = () => {
        navigate("/")
    }

    return (
        <div className="card card-hover p-8 max-w-md">
            <div className="mb-6">
                <div className="relative mx-auto mb-4 w-24 h-24">
                    <div className="absolute inset-0 rounded-full bg-danger/20 blur-2xl" />
                    <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-danger/10 text-5xl">
                        ⚠️
                    </div>
                </div>
                <h1 className="mb-2 text-2xl font-bold text-light">
                    Connection Error
                </h1>
                <p className="text-gray-400">
                    Oops! Something went wrong. Please try again or return to the homepage.
                </p>
            </div>
            
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                <button
                    className="btn-primary group flex items-center justify-center gap-2"
                    onClick={reloadPage}
                >
                    <HiArrowPath className="h-5 w-5 transition-transform group-hover:rotate-180" />
                    <span>Try Again</span>
                </button>
                <button
                    className="btn-secondary group flex items-center justify-center gap-2"
                    onClick={gotoHomePage}
                >
                    <HiHome className="h-5 w-5" />
                    <span>Go to Home</span>
                </button>
            </div>
        </div>
    )
}

export default ConnectionStatusPage
