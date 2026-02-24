import { TextAttributes } from "@opentui/core"

interface SidebarItemProps {
    name: string
    isSelected: boolean
    onClick: () => void
}

export function SidebarItem({ name, isSelected, onClick }: SidebarItemProps) {
    return (
        <box
            onMouseDown={() => onClick()}
            style={{
                paddingX: 1,
                paddingY: 0,
                backgroundColor: isSelected ? "blue" : undefined,
            }}
        >
            <text attributes={isSelected ? TextAttributes.BOLD : undefined} fg={isSelected ? "white" : "white"}>
                {isSelected ? "▶ " : "  "}
                {name}
            </text>
        </box>
    )
}
