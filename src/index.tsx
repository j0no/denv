import { createCliRenderer, TextAttributes, type KeyEvent } from "@opentui/core";
import { createRoot, useKeyboard } from "@opentui/react";
import { readFileSync, readdirSync } from "fs";
import { useState } from "react";

interface EnvFile {
  name: string;
  path: string;
  content: string;
}

function parseEnvContent(content: string): string[] {
  return content.split("\n").filter((line) => line.trim() !== "");
}

function getEnvFiles(): EnvFile[] {
  const files = readdirSync(".").filter((f) => f.startsWith(".env"));
  return files
    .filter((f) => !f.includes("node_modules"))
    .map((name) => {
      const path = `${process.cwd()}/${name}`;
      const content = readFileSync(path, "utf-8");
      return { name, path, content };
    });
}

function SidebarItem({
  name,
  isSelected,
  onClick,
}: {
  name: string;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <box
      onMouseDown={() => onClick()}
      style={{
        paddingX: 1,
        paddingY: 0,
        backgroundColor: isSelected ? "blue" : undefined,
      }}
    >
      <text
        attributes={isSelected ? TextAttributes.BOLD : undefined}
        fg={isSelected ? "white" : "white"}
      >
        {isSelected ? "▶ " : "  "}
        {name}
      </text>
    </box>
  );
}

function App() {
  const [envFiles] = useState<EnvFile[]>(getEnvFiles());
  const [selectedIndex, setSelectedIndex] = useState(envFiles.length > 0 ? 0 : 0);
  const hasSystemEnv = true;
  const totalItems = envFiles.length + (hasSystemEnv ? 1 : 0);

  useKeyboard((key: KeyEvent) => {
    if (key.name === "arrowup") {
      setSelectedIndex((prev: number) => (prev > 0 ? prev - 1 : totalItems - 1));
    } else if (key.name === "arrowdown") {
      setSelectedIndex((prev: number) => (prev < totalItems - 1 ? prev + 1 : 0));
    } else if (key.name === "tab") {
      setSelectedIndex((prev: number) => (prev < totalItems - 1 ? prev + 1 : 0));
    }
  });

  const isSystemEnv = selectedIndex === envFiles.length;
  const selectedFile = !isSystemEnv ? envFiles[selectedIndex] : null;

  const content: string[] = isSystemEnv
    ? Object.entries(process.env)
        .map(([k, v]) => `${k}=${v || ""}`)
    : selectedFile
      ? parseEnvContent(selectedFile.content)
      : [];

  return (
    <box flexDirection="column" flexGrow={1}>
      <box flexDirection="row" flexGrow={1}>
        <box
          width={20}
          border
          borderStyle="rounded"
          style={{ flexDirection: "column" }}
        >
          <text attributes={TextAttributes.BOLD} fg="yellow">
            Files
          </text>
          {envFiles.map((file: EnvFile, idx: number) => (
            <SidebarItem
              key={file.path}
              name={file.name}
              isSelected={idx === selectedIndex}
              onClick={() => setSelectedIndex(idx)}
            />
          ))}
          {hasSystemEnv && (
            <SidebarItem
              name="System Env"
              isSelected={isSystemEnv}
              onClick={() => setSelectedIndex(envFiles.length)}
            />
          )}
        </box>
        <box flexGrow={1} flexDirection="column">
          <text attributes={TextAttributes.BOLD} fg="cyan">
            {isSystemEnv ? "System Environment Variables" : selectedFile?.path}
          </text>
          <scrollbox style={{ flexDirection: "column" }} flexGrow={1}>
            {content.length === 0 ? (
              <text fg="gray">No content</text>
            ) : (
              content.map((line: string, idx: number) => (
                <text key={idx} fg="white">
                  {line}
                </text>
              ))
            )}
          </scrollbox>
        </box>
      </box>
    </box>
  );
}

const renderer = await createCliRenderer({ exitOnCtrlC: true });
createRoot(renderer).render(<App />);
