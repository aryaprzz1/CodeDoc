import { useAppContext } from "@/context/AppContext"
import { useSocket } from "@/context/SocketContext"
import { SocketEvent } from "@/types/socket"
import { USER_STATUS } from "@/types/user"
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react"
import { toast } from "react-hot-toast"
import { useLocation, useNavigate } from "react-router-dom"
import { v4 as uuidv4 } from "uuid"
import { HiSparkles, HiUser, HiKey, HiArrowRight, HiCodeBracket, HiDocumentText } from "react-icons/hi2"

const FormComponent = () => {
    const location = useLocation()
    const { currentUser, setCurrentUser, status, setStatus } = useAppContext()
    const { socket } = useSocket()
    const [isGenerating, setIsGenerating] = useState(false)

    const usernameRef = useRef<HTMLInputElement | null>(null)
    const navigate = useNavigate()

    const createNewRoomId = () => {
        setIsGenerating(true)
        setTimeout(() => {
            setCurrentUser({ ...currentUser, roomId: uuidv4() })
            toast.success("✨ Created a new Room Id", {
                icon: "🎉",
                style: {
                    background: "#1a1f3a",
                    color: "#f8fafc",
                    border: "1px solid #6366f1",
                },
            })
            setIsGenerating(false)
            usernameRef.current?.focus()
        }, 300)
    }

    const handleInputChanges = (e: ChangeEvent<HTMLInputElement>) => {
        const name = e.target.name
        const value = e.target.value
        setCurrentUser({ ...currentUser, [name]: value })
    }

    const validateForm = () => {
        if (currentUser.username.trim().length === 0) {
            toast.error("Enter your username")
            return false
        } else if (currentUser.roomId.trim().length === 0) {
            toast.error("Enter a room id")
            return false
        } else if (currentUser.roomId.trim().length < 5) {
            toast.error("Room Id must be at least 5 characters long")
            return false
        } else if (currentUser.username.trim().length < 3) {
            toast.error("Username must be at least 3 characters long")
            return false
        }
        return true
    }

    const joinRoom = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (status === USER_STATUS.ATTEMPTING_JOIN) return
        if (!validateForm()) return
        toast.loading("Joining room...", {
            style: {
                background: "#1a1f3a",
                color: "#f8fafc",
            },
        })
        setStatus(USER_STATUS.ATTEMPTING_JOIN)
        socket.emit(SocketEvent.JOIN_REQUEST, currentUser)
    }

    useEffect(() => {
        if (currentUser.roomId.length > 0) return
        if (location.state?.roomId) {
            setCurrentUser({ ...currentUser, roomId: location.state.roomId })
            if (currentUser.username.length === 0) {
                toast.success("Enter your username")
            }
        }
    }, [currentUser, location.state?.roomId, setCurrentUser])

    useEffect(() => {
        if (status === USER_STATUS.DISCONNECTED && !socket.connected) {
            socket.connect()
            return
        }

        const isRedirect = sessionStorage.getItem("redirect") || false

        if (status === USER_STATUS.JOINED && !isRedirect) {
            const username = currentUser.username
            sessionStorage.setItem("redirect", "true")
            navigate(`/editor/${currentUser.roomId}`, {
                state: {
                    username,
                },
            })
        } else if (status === USER_STATUS.JOINED && isRedirect) {
            sessionStorage.removeItem("redirect")
            setStatus(USER_STATUS.DISCONNECTED)
            socket.disconnect()
            socket.connect()
        }
    }, [currentUser, location.state?.redirect, navigate, setStatus, socket, status])

    return (
        <div className="w-full max-w-md">
            <div className="card card-hover p-8 backdrop-blur-xl">
                {/* Logo - Text-based */}
                <div className="mb-8 text-center">
                    <div className="mx-auto mb-4 flex items-center justify-center">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-primary opacity-20 blur-xl rounded-full" />
                            <div className="relative flex items-center justify-center w-20 h-20 rounded-xl bg-gradient-primary/10 backdrop-blur-sm border border-primary/30">
                                <div className="flex items-center gap-2 text-4xl">
                                    <HiCodeBracket className="text-primary" />
                                    <HiDocumentText className="text-secondary" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-light">Get Started</h2>
                    <p className="mt-2 text-sm text-gray-400">Join or create a collaboration room</p>
                </div>

                <form onSubmit={joinRoom} className="flex w-full flex-col gap-5">
                    {/* Room ID Input */}
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                            <HiKey className="h-5 w-5" />
                        </div>
                        <input
                            type="text"
                            name="roomId"
                            placeholder="Room ID"
                            className="input-modern pl-12 pr-4"
                            onChange={handleInputChanges}
                            value={currentUser.roomId}
                        />
                    </div>

                    {/* Username Input */}
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                            <HiUser className="h-5 w-5" />
                        </div>
                        <input
                            type="text"
                            name="username"
                            placeholder="Your Username"
                            className="input-modern pl-12 pr-4"
                            onChange={handleInputChanges}
                            value={currentUser.username}
                            ref={usernameRef}
                        />
                    </div>

                    {/* Join Button */}
                    <button
                        type="submit"
                        disabled={status === USER_STATUS.ATTEMPTING_JOIN}
                        className="btn-primary group mt-2 flex items-center justify-center gap-2 disabled:cursor-not-allowed"
                    >
                        <span>Join Room</span>
                        <HiArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </button>
                </form>

                {/* Divider */}
                <div className="my-6 flex items-center gap-4">
                    <div className="h-px flex-1 bg-darkHover" />
                    <span className="text-xs text-gray-500">OR</span>
                    <div className="h-px flex-1 bg-darkHover" />
                </div>

                {/* Generate Room ID Button */}
                <button
                    onClick={createNewRoomId}
                    disabled={isGenerating}
                    className="btn-secondary group flex w-full items-center justify-center gap-2"
                >
                    <HiSparkles className={`h-5 w-5 transition-transform ${isGenerating ? 'animate-spin' : 'group-hover:rotate-12'}`} />
                    <span>{isGenerating ? "Generating..." : "Generate New Room ID"}</span>
                </button>

                {/* Info Text */}
                <p className="mt-6 text-center text-xs text-gray-500">
                    Share your Room ID with teammates to collaborate in real-time
                </p>
            </div>
        </div>
    )
}

export default FormComponent
