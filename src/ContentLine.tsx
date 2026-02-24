import { t, bold, yellow, cyan, StyledText } from "@opentui/core"

interface ContentLineProps {
    content: string
    idx: number
}

function parseEnvLine(line: string): { key: string; value: string } | null {
    const eqIndex = line.indexOf("=")
    if (eqIndex === -1) return null
    return {
        key: line.slice(0, eqIndex),
        value: line.slice(eqIndex + 1),
    }
}

export function ContentLine({ content, idx }: ContentLineProps) {
    const parsed = parseEnvLine(content)

    if (!parsed) {
        return <text content={content} />
    }

    const styled: StyledText = t`${bold(yellow(parsed.key))}=${cyan(parsed.value)}`

    return <text content={styled} />
}
