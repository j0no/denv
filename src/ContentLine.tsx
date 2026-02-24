interface ContentLineProps {
    content: string
    idx: number
}

export function ContentLine({ content, idx }: ContentLineProps) {
    return (
        <text key={idx} fg="white">
            {content}
        </text>
    )
}
