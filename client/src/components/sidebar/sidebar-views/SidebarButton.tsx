import { useChatRoom } from "@/context/ChatContext"
import { useViews } from "@/context/ViewContext"
import { VIEWS } from "@/types/view"
import { useState } from "react"
import { Tooltip } from "react-tooltip"
import { tooltipStyles } from "../tooltipStyles"
import cn from "classnames"

interface ViewButtonProps {
    viewName: VIEWS
    icon: JSX.Element
}

const ViewButton = ({ viewName, icon }: ViewButtonProps) => {
    const { activeView, setActiveView, isSidebarOpen, setIsSidebarOpen } =
        useViews()
    const { isNewMessage } = useChatRoom()
    const [showTooltip, setShowTooltip] = useState(true)

    const isActive = activeView === viewName

    const handleViewClick = (viewName: VIEWS) => {
        if (viewName === activeView) {
            setIsSidebarOpen(!isSidebarOpen)
        } else {
            setIsSidebarOpen(true)
            setActiveView(viewName)
        }
    }

    return (
        <div className="relative flex flex-col items-center">
            <button
                onClick={() => handleViewClick(viewName)}
                onMouseEnter={() => setShowTooltip(true)}
                className={cn(
                    "relative flex items-center justify-center rounded-xl transition-all duration-200 ease-in-out p-2.5 group",
                    isActive
                        ? "bg-primary/30 text-primary shadow-glow"
                        : "text-gray-400 hover:bg-primary/20 hover:text-primary hover:shadow-glow"
                )}
                {...(showTooltip && {
                    "data-tooltip-id": `tooltip-${viewName}`,
                    "data-tooltip-content": viewName,
                })}
            >
                <div className="flex items-center justify-center transition-transform group-hover:scale-110">
                    {icon}
                </div>
                {/* Active indicator */}
                {isActive && (
                    <div className="absolute -left-1 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-primary md:left-0 md:top-auto md:h-1 md:w-6 md:translate-x-0 md:translate-y-0 md:rounded-b-full md:rounded-r-none" />
                )}
                {/* Show dot for new message in chat View Button */}
                {viewName === VIEWS.CHATS && isNewMessage && (
                    <div className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-accent ring-2 ring-darkLight"></div>
                )}
            </button>
            {/* render the tooltip */}
            {showTooltip && (
                <Tooltip
                    id={`tooltip-${viewName}`}
                    place="right"
                    offset={25}
                    className="!z-50"
                    style={tooltipStyles}
                    noArrow={false}
                    positionStrategy="fixed"
                    float={true}
                />
            )}
        </div>
    )
}

export default ViewButton
