import { useFileSystem } from "@/context/FileContext"
import useResponsive from "@/hooks/useResponsive"
import cn from "classnames"
import Editor from "./Editor"
import FileTab from "./FileTab"

function EditorComponent() {
    const { openFiles } = useFileSystem()
    const { minHeightReached } = useResponsive()

    if (openFiles.length <= 0) {
        return (
            <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-8">
                <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-primary/20 blur-2xl" />
                    <div className="relative text-6xl">📝</div>
                </div>
                <div className="text-center">
                    <h1 className="mb-2 text-2xl font-bold text-light">
                        No files open
                    </h1>
                    <p className="text-gray-400">
                        Open a file from the sidebar to start editing
                    </p>
                </div>
            </div>
        )
    }

    return (
        <main
            className={cn("flex w-full flex-col overflow-x-auto md:h-screen", {
                "h-[calc(100vh-50px)]": !minHeightReached,
                "h-full": minHeightReached,
            })}
        >
            <FileTab />
            <Editor />
        </main>
    )
}

export default EditorComponent
