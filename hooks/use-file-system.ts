"use client"

import { useState } from "react"

interface FileNode {
  name: string
  type: "file" | "directory" | "image"
  content?: string
  imagePath?: string  // 图片路径
  filePath?: string   // 本地文件路径（如字符画）
  children?: { [key: string]: FileNode }
  hidden?: boolean
}

interface FileSystem {
  [key: string]: FileNode
}

const initialFileSystem: FileSystem = {
  home: {
    name: "home",
    type: "directory",
    children: {
      user: {
        name: "user",
        type: "directory",
        children: {
          documents: {
            name: "documents",
            type: "directory",
            children: {
              "readme.txt": {
                name: "readme.txt",
                type: "file",
                content: "这是一个预装好的虚拟机\n我知道外设对大家日常的工作很重要，现在公司也已经努力采购当中了\n大家先将就现有的用吧",
              },
            },
          },
          images: {
            name: "images",
            type: "directory",
            children: {
              "现存外设": {
                name: "现存外设",
                type: "file",
                content: "This is a hidden secret file!\nOnly visible with secretfile command.",
                filePath: "/2025-ubuntu-terminal/info",
              },
              "合照.png": {
                name: "合照.png",
                type: "image",
                imagePath: "/2025-ubuntu-terminal/2.png",
                content: "[Image: 合照.png]",
              },
              "生日.png": {
                name: "生日.png",
                type: "image",
                imagePath: "/2025-ubuntu-terminal/3.png",
                content: "[Image: 生日.png]",
              },
              "生日礼物.png": {
                name: "生日礼物.png",
                type: "image",
                imagePath: "/2025-ubuntu-terminal/生日礼物.png",
                content: "[Image: 生日礼物.png]",
                hidden: true,
              },
               "惊喜生日派对.jpg": {
                name: "惊喜生日派对.jpg",
                type: "image",
                imagePath: "/2025-ubuntu-terminal/惊喜生日派对.jpg",
                content: "[Image: 惊喜生日派对.jpg]",
                hidden: true,
              },
            },
          },
          downloads: {
            name: "downloads",
            type: "directory",
            children: {
               "po**hub.mp4": {
                name: "po**hub.mp4",
                type: "file",
                content: "别想了🙄，这个视频是坏的！",
                hidden: true,
              },
            },
          },
          "hello.txt": {
            name: "hello.txt",
            type: "file",
            content: "Made by Leo Y with ❤️",
          },
          ".bashrc": {
            name: ".bashrc",
            type: "file",
            content: "# Bash configuration file\nexport PATH=/usr/local/bin:$PATH\nencrypted_algorithm=polybius_square",
            hidden: true,
          },
          ".ssh": {
            name: ".ssh",
            type: "directory",
            hidden: true,
            children: {
              "id_rsa": {
                name: "id_rsa",
                type: "file",
                content: "-----BEGIN ENCRYPTED KEY-----\n(21 34 31 31 34 62 44 23 15 33 15 62 35 23 34 44 34 43)",
                hidden: true,
              },
            },
          },
        },
      },
    },
  },
  etc: {
    name: "etc",
    type: "directory",
    children: {
      hosts: {
        name: "hosts",
        type: "file",
        content: "127.0.0.1 localhost\n::1 localhost",
      },
      ".hidden_config": {
        name: ".hidden_config",
        type: "file",
        content: "secret=true\nmode=production",
        hidden: true,
      },
    },
  },
  var: {
    name: "var",
    type: "directory",
    children: {},
  },
}

export function useFileSystem() {
  const [fileSystem, setFileSystem] = useState<FileSystem>(initialFileSystem)
  const [currentPath, setCurrentPath] = useState("~")
  const [currentDir, setCurrentDir] = useState<string[]>(["home", "user"])
  const [showHidden, setShowHidden] = useState(false)  // 控制是否显示隐藏文件

  const getNodeAtPath = (path: string[]): FileNode | null => {
    let current: any = fileSystem
    for (const segment of path) {
      if (current && typeof current === "object" && "children" in current && current.children) {
        current = current.children[segment]
      } else if (current && typeof current === "object" && segment in current) {
        current = current[segment]
      } else {
        return null
      }
    }
    return current as FileNode
  }

  const resolvePath = (path: string): string[] | null => {
    if (path === "~") return ["home", "user"]
    if (path === "/") return []

    let targetPath: string[]
    if (path.startsWith("/")) {
      targetPath = path.split("/").filter(Boolean)
    } else if (path.startsWith("~")) {
      targetPath = ["home", "user", ...path.slice(2).split("/").filter(Boolean)]
    } else {
      targetPath = [...currentDir, ...path.split("/").filter(Boolean)]
    }

    // Handle .. and .
    const resolved: string[] = []
    for (const segment of targetPath) {
      if (segment === "..") {
        resolved.pop()
      } else if (segment !== ".") {
        resolved.push(segment)
      }
    }

    return resolved
  }

  const executeCommand = (command: string): { output: string; error: boolean } => {
    const parts = command.trim().split(/\s+/)
    const cmd = parts[0]
    const args = parts.slice(1)

    switch (cmd) {
      case "help":
        return {
          output: `可用命令：
  ls [path]       - 列出目录内容
  cd <path>       - 切换目录
  pwd             - 打印当前目录
  cat <file>      - 显示文件内容
  echo <text>     - 显示文本
  whoami          - 显示当前用户
  date            - 显示当前日期和时间
  help            - 显示帮助信息
  你也可以按 Tab 键进行命令和文件名补全
  `,
          error: false,
        }

      case "secretfile": {
        setShowHidden(!showHidden)
        return {
          output: showHidden 
            ? "隐藏文件已隐藏" 
            : "隐藏文件已显示",
          error: false,
        }
      }

      case "ls": {
        const targetPath = args[0] ? resolvePath(args[0]) : currentDir
        if (!targetPath) {
          return { output: `ls: 无法访问 '${args[0]}': 没有这个文件或目录`, error: true }
        }

        const node = getNodeAtPath(targetPath)
        if (!node) {
          return { output: `ls: 无法访问 '${args[0]}': 没有这个文件或目录`, error: true }
        }

        if (node.type === "file") {
          return { output: node.name, error: false }
        }

        if (node.children) {
          // 过滤隐藏文件（如果 showHidden 为 false）
          const items = Object.entries(node.children)
            .filter(([_, child]) => showHidden || !child.hidden)
            .map(([name, child]) => ({
              name,
              type: child.type,
            }))
          
          if (items.length === 0) return { output: "", error: false }
          
          // 返回带有类型标记的JSON格式，用于在终端中着色显示
          return { 
            output: JSON.stringify(items),
            error: false 
          }
        }

        return { output: "", error: false }
      }

      case "cd": {
        if (!args[0]) {
          setCurrentDir(["home", "user"])
          setCurrentPath("~")
          return { output: "", error: false }
        }

        const targetPath = resolvePath(args[0])
        if (!targetPath) {
          return { output: `cd: ${args[0]}: 没有这个文件或目录`, error: true }
        }

        const node = getNodeAtPath(targetPath)
        if (!node) {
          return { output: `cd: ${args[0]}: 没有这个文件或目录`, error: true }
        }

        if (node.type !== "directory") {
          return { output: `cd: ${args[0]}: 不是一个目录`, error: true }
        }

        setCurrentDir(targetPath)
        if (targetPath.length === 0) {
          setCurrentPath("/")
        } else if (targetPath[0] === "home" && targetPath[1] === "user") {
          const subPath = targetPath.slice(2)
          setCurrentPath(subPath.length > 0 ? `~/${subPath.join("/")}` : "~")
        } else {
          setCurrentPath(`/${targetPath.join("/")}`)
        }
        return { output: "", error: false }
      }

      case "pwd": {
        if (currentDir.length === 0) return { output: "/", error: false }
        return { output: `/${currentDir.join("/")}`, error: false }
      }

      case "cat": {
        if (!args[0]) {
          return { output: "cat: 缺少文件操作数", error: true }
        }

        const targetPath = resolvePath(args[0])
        if (!targetPath) {
          return { output: `cat: ${args[0]}: 没有该文件或目录`, error: true }
        }

        const node = getNodeAtPath(targetPath)
        if (!node) {
          return { output: `cat: ${args[0]}: 没有该文件或目录`, error: true }
        }

        if (node.type === "directory") {
          return { output: `cat: ${args[0]}: 是一个目录`, error: true }
        }

        // 如果是图片文件，返回特殊格式的JSON
        if (node.type === "image" && node.imagePath) {
          return { 
            output: JSON.stringify({ 
              type: "image", 
              path: node.imagePath,
              name: node.name 
            }), 
            error: false 
          }
        }

        // 如果有 filePath 字段，返回特殊格式，供前端 fetch
        if (node.filePath) {
          return {
            output: JSON.stringify({
              type: "filePath",
              path: node.filePath,
              name: node.name
            }),
            error: false
          }
        }

        return { output: node.content || "", error: false }
      }

      case "echo":
        return { output: args.join(" "), error: false }

      case "whoami":
        return { output: "leoy", error: false }

      case "date":
        return { output: new Date().toString(), error: false }

      case "":
        return { output: "", error: false }

      default:
        return { output: `${cmd}: 命令未找到`, error: true }
    }
  }

  const getCompletions = (input: string): string[] => {
    const parts = input.trim().split(/\s+/)
    const cmd = parts[0]
    // 可用的命令列表（不含 secretfile）
    const commands = [
      "help", "ls", "cd", "pwd", "cat", 
      "echo", "whoami", "date"
    ]
    // secretfile 只在完整输入 sec 或 sec+空格时补全
    if (parts.length === 1 && !input.endsWith(" ")) {
      let result = commands.filter(c => c.startsWith(cmd))
      if (cmd === "sec" || cmd === "secretfile") {
        result.push("secretfile")
      }
      return result
    }
    
    // 如果是需要文件/目录参数的命令
    if (["ls", "cd", "cat", ].includes(cmd)) {
      const argInput = parts.slice(1).join(" ")
      const lastArg = argInput || ""
      
      // 解析路径
      let basePath: string[]
      let prefix = ""
      
      if (lastArg.includes("/")) {
        const lastSlash = lastArg.lastIndexOf("/")
        const dirPart = lastArg.substring(0, lastSlash + 1)
        prefix = lastArg.substring(lastSlash + 1)
        
        const resolvedBase = resolvePath(dirPart || ".")
        basePath = resolvedBase || currentDir
      } else {
        basePath = currentDir
        prefix = lastArg
      }
      
      const node = getNodeAtPath(basePath)
      if (node && node.children) {
        // 过滤掉隐藏文件，不参与自动补全
        const items = Object.entries(node.children)
          .filter(([name, child]) => !child.hidden && name.startsWith(prefix))
          .map(([name]) => name)
        
        // 对于 cd 命令，只返回目录
        if (cmd === "cd") {
          return items.filter(name => 
            node.children![name].type === "directory"
          )
        }
        
        return items
      }
    }
    
    return []
  }

  return {
    currentPath,
    executeCommand,
    getCompletions,
    getCurrentDirNode: () => getNodeAtPath(currentDir),
  }
}
