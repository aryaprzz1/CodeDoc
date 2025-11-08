import FormComponent from "@/components/forms/FormComponent"
import { useEffect, useState } from "react"
import { HiCodeBracket, HiDocumentText } from "react-icons/hi2"

function HomePage() {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    return (
        <div className="relative min-h-screen overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary/20 blur-3xl animate-pulse-slow" />
                <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-secondary/20 blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
                <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
            </div>

            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1f3a_1px,transparent_1px),linear-gradient(to_bottom,#1a1f3a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />

            <div className="relative z-10 flex min-h-screen flex-col items-center justify-center gap-12 px-4 py-12 sm:gap-16">
                {/* Header Section */}
                <div className={`text-center transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
                    <h1 className="mb-4 text-4xl font-bold text-light sm:text-5xl md:text-6xl lg:text-7xl">
                        Welcome to{" "}
                        <span className="text-gradient bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                            CodeDoc
                        </span>
                    </h1>
                    <p className="mx-auto max-w-2xl text-lg text-gray-300 sm:text-xl">
                        Collaborate in real-time with your team. Code together, build together, ship together.
                    </p>
                </div>

                {/* Main Content */}
                <div className={`flex w-full max-w-7xl flex-col items-center justify-evenly gap-12 transition-all duration-700 delay-200 sm:flex-row sm:gap-8 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    {/* Logo/Illustration Section - Text-based */}
                    <div className="flex w-full justify-center sm:w-1/2">
                        <div className="relative">
                            <div className="absolute inset-0 rounded-3xl bg-gradient-primary opacity-20 blur-3xl animate-pulse-slow" />
                            <div className="relative animate-up-down">
                                <div className="flex flex-col items-center justify-center gap-6 p-12">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-gradient-primary opacity-30 blur-2xl rounded-full" />
                                        <div className="relative flex items-center justify-center w-32 h-32 sm:w-40 sm:h-40 rounded-2xl bg-gradient-primary/20 backdrop-blur-sm border-2 border-primary/30">
                                            <div className="flex items-center gap-3 text-6xl sm:text-7xl">
                                                <HiCodeBracket className="text-primary" />
                                                <HiDocumentText className="text-secondary" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <h2 className="text-3xl font-bold text-gradient mb-2">CodeDoc</h2>
                                        <p className="text-sm text-gray-400">Real-time Code Collaboration</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form Section */}
                    <div className="flex w-full items-center justify-center sm:w-1/2">
                        <div className="w-full max-w-md">
                            <FormComponent />
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <div className={`mt-8 grid w-full max-w-5xl grid-cols-1 gap-6 text-center sm:grid-cols-3 transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <div className="card card-hover p-6">
                        <div className="mb-3 text-3xl">⚡</div>
                        <h3 className="mb-2 text-lg font-semibold text-light">Real-time Sync</h3>
                        <p className="text-sm text-gray-400">See changes instantly as your team codes</p>
                    </div>
                    <div className="card card-hover p-6">
                        <div className="mb-3 text-3xl">💬</div>
                        <h3 className="mb-2 text-lg font-semibold text-light">Team Chat</h3>
                        <p className="text-sm text-gray-400">Communicate seamlessly while coding</p>
                    </div>
                    <div className="card card-hover p-6">
                        <div className="mb-3 text-3xl">🚀</div>
                        <h3 className="mb-2 text-lg font-semibold text-light">Fast & Secure</h3>
                        <p className="text-sm text-gray-400">Lightning-fast performance with encryption</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomePage
