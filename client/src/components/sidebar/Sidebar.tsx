import SidebarButton from "@/components/sidebar/sidebar-views/SidebarButton"
import { useAppContext } from "@/context/AppContext"
import { useSocket } from "@/context/SocketContext"
import { useViews } from "@/context/ViewContext"
import useResponsive from "@/hooks/useResponsive"
import useWindowDimensions from "@/hooks/useWindowDimensions"
import { ACTIVITY_STATE } from "@/types/app"
import { SocketEvent } from "@/types/socket"
import { VIEWS } from "@/types/view"
import { IoCodeSlash } from "react-icons/io5"
import { MdOutlineDraw } from "react-icons/md"
import cn from "classnames"
import { Tooltip } from 'react-tooltip'
import { useState } from 'react'
import { tooltipStyles } from "./tooltipStyles"

function Sidebar() {
    const {
        activeView,
        isSidebarOpen,
        viewComponents,
        viewIcons,
        setIsSidebarOpen,
    } = useViews()
    const { minHeightReached } = useResponsive()
    const { activityState, setActivityState } = useAppContext()
    const { socket } = useSocket()
    const { isMobile } = useWindowDimensions()
    const [showTooltip, setShowTooltip] = useState(true)

    const changeState = () => {
        setShowTooltip(false)
        if (activityState === ACTIVITY_STATE.CODING) {
            setActivityState(ACTIVITY_STATE.DRAWING)
            socket.emit(SocketEvent.REQUEST_DRAWING)
        } else {
            setActivityState(ACTIVITY_STATE.CODING)
        }

        if (isMobile) {
            setIsSidebarOpen(false)
        }
    }

    return (
        <aside className="flex w-full md:h-full md:max-h-full md:min-h-full md:w-auto">
            {/* Navigation Bar */}
            <div
                className={cn(
                    "fixed bottom-0 left-0 z-50 flex h-[60px] w-full gap-2 self-end overflow-x-auto border-t border-darkHover/50 bg-darkLight/95 backdrop-blur-xl p-2 shadow-2xl md:static md:h-full md:w-[70px] md:min-w-[70px] md:flex-col md:border-r md:border-t-0 md:border-darkHover/50 md:p-4 md:pt-6",
                    {
                        hidden: minHeightReached,
                    },
                )}
            >
                <div className="flex gap-2 md:flex-col md:gap-3">
                    <SidebarButton
                        viewName={VIEWS.FILES}
                        icon={viewIcons[VIEWS.FILES]}
                    />
                    <SidebarButton
                        viewName={VIEWS.CHATS}
                        icon={viewIcons[VIEWS.CHATS]}
                    />
                    <SidebarButton
                        viewName={VIEWS.COPILOT}
                        icon={viewIcons[VIEWS.COPILOT]}
                    />
                    <SidebarButton
                        viewName={VIEWS.RUN}
                        icon={viewIcons[VIEWS.RUN]}
                    />
                    <SidebarButton
                        viewName={VIEWS.PREVIEW}
                        icon={viewIcons[VIEWS.PREVIEW]}
                    />
                    <SidebarButton
                        viewName={VIEWS.CLIENTS}
                        icon={viewIcons[VIEWS.CLIENTS]}
                    />
                    <SidebarButton
                        viewName={VIEWS.SETTINGS}
                        icon={viewIcons[VIEWS.SETTINGS]}
                    />
                </div>

                {/* Divider */}
                <div className="hidden h-px w-full bg-darkHover/50 md:my-2 md:block" />

                {/* Button to change activity state coding or drawing */}
                <div className="flex h-fit items-center justify-center md:mt-auto">
                    <button
                        className="group flex items-center justify-center rounded-xl p-2.5 transition-all duration-200 ease-in-out hover:bg-primary/20 hover:shadow-glow"
                        onClick={changeState}
                        onMouseEnter={() => setShowTooltip(true)}
                        data-tooltip-id="activity-state-tooltip"
                        data-tooltip-content={
                            activityState === ACTIVITY_STATE.CODING
                                ? "Switch to Drawing Mode"
                                : "Switch to Coding Mode"
                        }
                    >
                        {activityState === ACTIVITY_STATE.CODING ? (
                            <MdOutlineDraw 
                                size={24} 
                                className="text-primary transition-transform group-hover:scale-110" 
                            />
                        ) : (
                            <IoCodeSlash 
                                size={24} 
                                className="text-primary transition-transform group-hover:scale-110" 
                            />
                        )}
                    </button>
                    {showTooltip && (
                        <Tooltip
                            id="activity-state-tooltip"
                            place="right"
                            offset={15}
                            className="!z-50"
                            style={tooltipStyles}
                            noArrow={false}
                            positionStrategy="fixed"
                            float={true}
                        />
                    )}
                </div>
            </div>

            {/* Sidebar Panel */}
            <div
                className={cn(
                    "absolute left-0 top-0 z-20 w-full flex-col bg-darkLight border-r border-darkHover/50 backdrop-blur-xl md:static md:min-w-[320px] md:max-w-[320px] transition-all duration-300",
                    isSidebarOpen ? "block animate-slide-in" : "hidden md:block"
                )}
                style={isMobile && !isSidebarOpen ? { display: "none" } : {}}
            >
                {/* Render the active view component */}
                <div className="h-full overflow-hidden">
                    {viewComponents[activeView]}
                </div>
            </div>
        </aside>
    )
}

export default Sidebar
