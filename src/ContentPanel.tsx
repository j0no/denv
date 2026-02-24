import { TextAttributes } from "@opentui/core"
import { ContentLine } from "./ContentLine"

interface ContentPanelProps {
    title: string
    content: string[]
}

export function ContentPanel({ title, content }: ContentPanelProps) {
    return (
        <box width="100%" flexGrow={1} flexDirection="column">
            <text attributes={TextAttributes.BOLD} fg="cyan">
                {title}
            </text>
            <box>
                <scrollbox
                    width="100%"
                    height="100%"
                    style={{ marginTop: 1 }}
                    flexGrow={1}
                    scrollbarOptions={{
                        showArrows: true,
                    }}
                >
                    {content.length === 0 ? (
                        <text fg="gray">No content</text>
                    ) : (
                        content.map((line: string, idx: number) => (
                            <ContentLine key={idx} content={line} idx={idx} />
                        ))
                    )}
                </scrollbox>
            </box>
        </box>
    )
}
