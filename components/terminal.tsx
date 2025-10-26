"use client"

import { useState, useRef, useEffect, type KeyboardEvent } from "react"

// 用于渲染 filePath 类型的cat输出
function FilePathContent({ path, name }: { path: string, name: string }) {
  const [content, setContent] = useState<string>("Loading...")
  useEffect(() => {
    let cancelled = false
    fetch(path)
      .then(r => r.ok ? r.text() : Promise.reject("Not found"))
      .then(text => { if (!cancelled) setContent(text) })
      .catch(() => { if (!cancelled) setContent("[无法读取文件内容]") })
    return () => { cancelled = true }
  }, [path])
  return (
    <div className="my-2">
      <div className="inline-block border-2 border-[#729fcf] rounded-lg overflow-x-auto bg-[#1a0a14] p-2">
        <pre className="text-[#d3d3d3] whitespace-pre font-mono text-xs leading-tight" style={{margin:0}}>{content}</pre>
        <div className="text-[#729fcf] text-xs mt-2 text-center font-mono">🖼️ {name}</div>
      </div>
    </div>
  )
}
import { useFileSystem } from "@/hooks/use-file-system"

interface OutputLine {
  type: "command" | "output" | "error"
  content: string
  prompt?: string
}

export default function Terminal() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState<OutputLine[]>([
    {
      type: "output",
      content: `LLG;..:::,t         .:::::,:::::::GjtiGiDDDDDDDDDD
LLL...::, tt      .::,,,:,,,,,,:,,:;t;GG;GfDDDGDDD
LLG...,,:  t:   j:,,;;;;;:,;,;,,,:,::LLL,DD:,ELDDD
LLL...,,:  .t..t:,;;;;;;;;;,,,;,,:,;::.,;t,L;fLDDD
GGG...,,:   ttt:;;;iiii;;,;,,,,:;;iti,::DLDDi,iDDD
GGG...,,:   jt,,,;;i;;;i;;,,,,ijjiffji,::DDDDDDDDD
GGG...,,,   jj:i.i.iiii;;;,;ijffftjfti,;,,DDDDDDDD
EEE...,,;   j,.:.i.,i,;;;;itjfjfjjfft;;;,,DDDDDDDD
LfL...,,;    .. t.. .  ;;tjjjfjtttjt;;iti;,DDDDDDj
Lff..:,,:   ....:i,....ittjtjtii;it;;iiii;;iijLDD:
Ljf..:,,.  . ,;iiii,i,,jtttjti;,,;i;ittiii;;iiiii:
Lff..:,,. ..,,;iiiittijititi;;;;,itijttttttiiiiii:
fLj..,,, ..:,i;iitjtijtttjii;;i;itjjfjjjjttiiiiii:
tj;..,,, ..:,;,;ijtitjjtjjttititttjfttjtjtttiiiit.
jj:..,,,..::,ttjjttijtiifttttttjjjjjjtjjtttiiiii;.
tj...,,,..:,;jfjtjttjtttjjtjjjjffffjjjtttttitiii:.
tj...,,,,,:;tttjtttttttjttjfffffjfLfjjjjtjtti;ii..
it...,,,,,:,;,,,tittttttjjjfffffjfffjtjjjtttitii..
it...,,,,:;::::,jfi;,ijffffjffjjjffjfttttitiiiii..
tt...,,,::::,,:,,,,,;GjiijtfffjLfffjjjtttttttiii..
tj..:::::,,,,,,;,,,,;;,;;;fDLjttijGLfffjjjjttii:..
jf.::::::,,,,,,,,,;;,;;,;;;;;;iijtGGDDDDDLLLfii...
D::::,,,,,,,,,,,;,;;;;;;;;;;;;;;itEEGEEEEEEDEDi...
ti,:::,,,,,,;,,;,;;;;;;;;;;;;;;;fKEDEGEEEEEDDGL...
GGLj;,,,,;;;,;,;;,;;i;;;;;,;;;tWKDGEEEDDGDDKED;,:.
GGDDDj;,,;;;;;,,,,;;;;;;;;;;iLEEEGGGEEEEDKEKDDf...
GDDDEEGj;;;;;;;;;;;;i;,;;;;jWDDEGDEEDDGEKEEEGD;::.
DDDEEEE,Lj;;;;i;;;;;;;;;;jWKEELDKGEDDGGDEEEGGG....
DDEEED:fKKLfii;;;;;;;;ijWWKEDDDDEEGDDGGEKDLtDj....
DDDD..;jEWWWKLfjtiitjDKKKKEEEEEEDEGDDGDEEffiGt....
f:....;fjEWKKWKKKKKKWKKKKKEEKEEDDDLGDLGDDGjtLi....
D....:.jLKKKKKKKKKKWWKEKKEEEEEEEDGLfGLGDEt,jj,....
L.....,LDEKKKKKEKKKWKKDKKEDEEEEEDGGDGLDDL,:jt:....
t..:..fGGEEEKKKEKKKKKEEKKEEDEEEDGLGGtLGDfi:t;.....
f.:::jLDGDffjEEGEKEEEEEEKEEDDDGDEDftijGLtG:ti....:
j....LLDDEEEWDDEEDDKEDLGDEGLGGGEEjttijLLtj.;i.....
t.....tjGDGiGfGLEEDKKDfjLDffGGEGfjtiittfj:ti;:...:
t.....;jjGjjiLfLEDDELLLfLGDGGELLjtiiiitttiit:::...
t.....f;t,:f,;DGLGEKDGLfjfjjftfjttiiiiiifj..::::.:
t.........:fi,jffLLLEjLfjjffjfjttiiiiiiiEt,.::::::
i.:.........ttfffjfffGifjjjjfttiiiiiiiiiEG;.::::::
i::...........ittjLjjfftjtjjjtttiiiiiiiiEGti::::::
i::......:ifGDGtjftttjjfLLttjttiittiiiiiKLtj::::::
i::...:.....DLLLfjitttjttfLttttttttiiitiKfitD:::::
i::...:.i,;.jLLLLtjittttLfffjttttiiiittjKji;EG::::
;::..... ....LLLLGttijLfjjjjjftttiiitjtLf,i;EE::::
,::...D....f.GLLGGLtfjjttjLDjjtiiitttjjE,j;,EKD:::
,::...D....G.GLGGDLGjfGLEffttttttttjjjLj;;;jKEKG::
:::...G....f,GLLGGGGtjjjjfttttttttjffLEf,::KEEEEEj
:::...LLt..LfGLLGGGGGtjjjjttittttjffLEtt:.tKEEEEED
:::...,DD..:fGGLGGGDGiittttiiittjfLLDf:;,ttKKEEEEE
::.....DD..DLDGLGGWEDEii;;;iitjffLGDLttjf,KKKEEEEE
:;....,D.:::GDGGGEEGGEjiiiiitffLGGDj,:;::;KKEKEEEE
:j.:t,,,,:,,DGGfGGGDDKDjfDGjjjfLGGt:LEK:ttKEEEEEEE
:.G,,f:,,,,fDGGfEKEDDKEf;;DLjjfLt;tEEDjDiKKEKEEKEE
:.;t:,,,,,,DEGGKDKK#KWEf:,tjfj,tiDKijffGjKKEEEEEKE`
    },
    {
      type: "output",
      content: "欢迎登录到定制版操作系统\nBuild on Oct. 23",
    },
    {
      type: "output",
      content: '输入 "help" 查看可用命令',
    },
    {
      type: "output",
      content: "",
    },
  ])
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [tabSuggestions, setTabSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [tabIndex, setTabIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const outputRef = useRef<HTMLDivElement>(null)
  const { currentPath, executeCommand, getCompletions, getCurrentDirNode } = useFileSystem()

  // 钉子状态：每个按钮需要点击的次数和当前的点击计数
  // 前5次点击没反应，第6-9次点击开始松动，第9次掉落
  const [nailState, setNailState] = useState({
    red: { clicks: 0, maxClicks: 9, moveThreshold: 5, fallen: false },
    yellow: { clicks: 0, maxClicks: 9, moveThreshold: 5, fallen: false },
    green: { clicks: 0, maxClicks: 9, moveThreshold: 5, fallen: false },
  })

  // 窗口拖动状态
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [windowPosition, setWindowPosition] = useState({ x: 0, y: 0 })

  // 检查是否所有钉子都掉落
  const allNailsFallen = nailState.red.fallen && nailState.yellow.fallen && nailState.green.fallen

  // 处理钉子点击
  const handleNailClick = (color: 'red' | 'yellow' | 'green') => {
    setNailState(prev => {
      const current = prev[color]
      if (current.fallen) return prev
      
      const newClicks = current.clicks + 1
      const newFallen = newClicks >= current.maxClicks
      
      return {
        ...prev,
        [color]: {
          ...current,
          clicks: newClicks,
          fallen: newFallen,
        }
      }
    })
  }

  // 处理拖动开始
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!allNailsFallen) return
    setIsDragging(true)
    setDragOffset({
      x: e.clientX - windowPosition.x,
      y: e.clientY - windowPosition.y,
    })
  }

  // 处理拖动
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !allNailsFallen) return
    setWindowPosition({
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y,
    })
  }

  // 处理拖动结束
  const handleMouseUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (isDragging) {
      const handleGlobalMouseMove = (e: MouseEvent) => {
        setWindowPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y,
        })
      }
      const handleGlobalMouseUp = () => {
        setIsDragging(false)
      }
      
      window.addEventListener('mousemove', handleGlobalMouseMove)
      window.addEventListener('mouseup', handleGlobalMouseUp)
      
      return () => {
        window.removeEventListener('mousemove', handleGlobalMouseMove)
        window.removeEventListener('mouseup', handleGlobalMouseUp)
      }
    }
  }, [isDragging, dragOffset])

  // 获取字符串数组的公共前缀
  const getCommonPrefix = (strings: string[]): string => {
    if (strings.length === 0) return ""
    if (strings.length === 1) return strings[0]
    
    let prefix = strings[0]
    for (let i = 1; i < strings.length; i++) {
      while (strings[i].indexOf(prefix) !== 0) {
        prefix = prefix.substring(0, prefix.length - 1)
        if (prefix === "") return ""
      }
    }
    return prefix
  }

  // 渲染输出内容，支持 ls 命令的彩色显示和图片显示
  const renderOutput = (content: string) => {
    // 尝试解析 JSON
    try {
      const parsed = JSON.parse(content)
      // filePath类型，fetch内容并渲染
      if (parsed.type === "filePath" && parsed.path) {
        return <FilePathContent path={parsed.path} name={parsed.name} />
      }
      // 检查是否是图片输出
      if (parsed.type === "image" && parsed.path) {
        return (
          <div className="my-2">
            <div className="inline-block border-2 border-[#729fcf] rounded-lg overflow-hidden bg-[#1a0a14] p-2">
              <img 
                src={parsed.path} 
                alt={parsed.name}
                className="max-w-md max-h-80 object-contain rounded"
                style={{
                  imageRendering: "auto",
                }}
              />
              <div className="text-[#729fcf] text-xs mt-2 text-center font-mono">
                📷 {parsed.name}
              </div>
            </div>
          </div>
        )
      }
      // 检查是否是 ls 命令的输出
      if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].name && parsed[0].type) {
        return (
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {parsed.map((item: { name: string; type: string }, idx: number) => (
              <span
                key={idx}
                className={
                  item.type === "directory"
                    ? "text-[#729fcf] font-semibold"  // 蓝色目录
                    : item.type === "image"
                    ? "text-[#c586c0]"                 // 紫色图片
                    : "text-[#d3d3d3]"                 // 白色文件
                }
              >
                {item.name}
              </span>
            ))}
          </div>
        )
      }
    } catch {
      // 不是 JSON，正常渲染
    }
    return <pre className="text-[#d3d3d3] whitespace-pre-wrap font-mono">{content}</pre>
  }

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [output])

  const handleCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim()
    if (!trimmedCmd) return

    const prompt = `leoy@ubuntu:${currentPath}$`
    setOutput((prev) => [...prev, { type: "command", content: trimmedCmd, prompt }])

    const result = executeCommand(trimmedCmd)

    if (result.error) {
      setOutput((prev) => [...prev, { type: "error", content: result.output }])
    } else if (result.output) {
      // 检查是否是 ls 命令的 JSON 输出
      if (trimmedCmd.startsWith("ls") && result.output.startsWith("[")) {
        try {
          const items = JSON.parse(result.output)
          setOutput((prev) => [...prev, { type: "output", content: JSON.stringify(items) }])
        } catch {
          setOutput((prev) => [...prev, { type: "output", content: result.output }])
        }
      } else {
        setOutput((prev) => [...prev, { type: "output", content: result.output }])
      }
    }

    setCommandHistory((prev) => [...prev, trimmedCmd])
    setHistoryIndex(-1)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCommand(input)
      setInput("")
      setTabSuggestions([])
      setShowSuggestions(false)
      setTabIndex(0)
    } else if (e.key === "Tab") {
      e.preventDefault()
      
      const completions = getCompletions(input)
      
      if (completions.length === 0) {
        return
      }
      
      if (completions.length === 1) {
        // 只有一个匹配，直接补全
        const parts = input.trim().split(/\s+/)
        const lastPart = parts[parts.length - 1] || ""
        
        let completion = completions[0]
        const node = getCurrentDirNode()
        
        // 如果是目录，添加斜杠
        if (node && node.children && node.children[completion]?.type === "directory") {
          completion += "/"
        }
        
        if (parts.length === 1 && !input.includes(" ")) {
          // 补全命令
          setInput(completion + " ")
        } else {
          // 补全文件/目录名
          const beforeLastPart = parts.slice(0, -1).join(" ")
          if (lastPart.includes("/")) {
            const lastSlash = lastPart.lastIndexOf("/")
            const pathPrefix = lastPart.substring(0, lastSlash + 1)
            setInput((beforeLastPart ? beforeLastPart + " " : "") + pathPrefix + completion)
          } else {
            setInput((beforeLastPart ? beforeLastPart + " " : "") + completion)
          }
        }
        
        setTabSuggestions([])
        setShowSuggestions(false)
        setTabIndex(0)
      } else {
        // 多个匹配
        if (tabSuggestions.length === 0 || JSON.stringify(tabSuggestions) !== JSON.stringify(completions)) {
          // 第一次按Tab，显示所有匹配项
          setTabSuggestions(completions)
          setShowSuggestions(true)
          setTabIndex(0)
          
          // 自动补全公共前缀
          const commonPrefix = getCommonPrefix(completions)
          const parts = input.trim().split(/\s+/)
          const lastPart = parts[parts.length - 1] || ""
          
          if (parts.length === 1 && !input.includes(" ")) {
            if (commonPrefix.length > lastPart.length) {
              setInput(commonPrefix)
            }
          } else {
            const beforeLastPart = parts.slice(0, -1).join(" ")
            if (lastPart.includes("/")) {
              const lastSlash = lastPart.lastIndexOf("/")
              const pathPrefix = lastPart.substring(0, lastSlash + 1)
              const filePrefix = lastPart.substring(lastSlash + 1)
              if (commonPrefix.length > filePrefix.length) {
                setInput((beforeLastPart ? beforeLastPart + " " : "") + pathPrefix + commonPrefix)
              }
            } else {
              if (commonPrefix.length > lastPart.length) {
                setInput((beforeLastPart ? beforeLastPart + " " : "") + commonPrefix)
              }
            }
          }
        }
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1)
        setHistoryIndex(newIndex)
        setInput(commandHistory[newIndex])
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      if (historyIndex !== -1) {
        const newIndex = Math.min(commandHistory.length - 1, historyIndex + 1)
        if (newIndex === commandHistory.length - 1 && historyIndex === commandHistory.length - 1) {
          setHistoryIndex(-1)
          setInput("")
        } else {
          setHistoryIndex(newIndex)
          setInput(commandHistory[newIndex])
        }
      }
    } else if (e.key === "c" && e.ctrlKey) {
      e.preventDefault()
      setInput("")
      setTabSuggestions([])
      setShowSuggestions(false)
      setTabIndex(0)
      setOutput((prev) => [...prev, { type: "command", content: input + "^C", prompt: `leoy@ubuntu:${currentPath}$` }])
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault()
      setOutput([])
      setInput("")
      setTabSuggestions([])
      setShowSuggestions(false)
      setTabIndex(0)
    } else {
      // 其他按键清除Tab建议
      setTabSuggestions([])
      setShowSuggestions(false)
      setTabIndex(0)
    }
  }

  return (
    <div className="w-full max-w-5xl h-[600px] relative flex items-center justify-center">
      {/* 背景文字 - 只在所有钉子掉落后显示 */}
      {allNailsFallen && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="flex flex-col items-center justify-center cursor-pointer select-none group"
            style={{ width: 140 }}
            onDoubleClick={() => window.open("https://wangwangwang.website/2025-chat-room", "_blank")}
            title="双击进入聊天室"
          >
            {/* 复古气泡icon */}
            <svg width="72" height="64" viewBox="0 0 72 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="bubbleGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f7e7a7" />
                  <stop offset="100%" stopColor="#b6e3c6" />
                </linearGradient>
              </defs>
              <rect x="8" y="14" width="56" height="32" rx="14" fill="url(#bubbleGrad)" stroke="#c9b18a" strokeWidth="2"/>
              <ellipse cx="36" cy="30" rx="20" ry="10" fill="#fff" opacity="0.18"/>
              <circle cx="24" cy="32" r="3" fill="#fff"/>
              <circle cx="36" cy="32" r="3" fill="#fff"/>
              <circle cx="48" cy="32" r="3" fill="#fff"/>
              {/* 尾巴 */}
              <path d="M36 46 Q38 54 44 54 Q40 50 36 46 Z" fill="#f7e7a7" stroke="#c9b18a" strokeWidth="1"/>
            </svg>
            <span
              className="mt-2 text-lg font-bold"
              style={{
                color: '#f7e7a7',
                textShadow: '2px 2px 0 #b6e3c6, 0 0 2px #c9b18a',
                WebkitTextStroke: '1px #c9b18a',
                fontFamily: 'SimHei, Arial, sans-serif',
                letterSpacing: '2px',
              }}
            >聊天室</span>
          </div>
        </div>
      )}
      
      {/* 可拖动的终端窗口 */}
      <div 
        className="w-full max-w-5xl h-[600px] bg-[#300a24] rounded-lg shadow-2xl overflow-hidden border border-[#5e2750] flex flex-col relative"
        style={{
          transform: `translate(${windowPosition.x}px, ${windowPosition.y}px)`,
          transition: isDragging ? 'none' : 'transform 0.3s ease-out',
          cursor: allNailsFallen ? (isDragging ? 'grabbing' : 'grab') : 'default',
        }}
        onMouseDown={handleMouseDown}
      >
      {/* Terminal Header */}
      <div className="bg-[#2d0922] px-4 py-2 flex items-center gap-2 border-b border-[#5e2750]">
        <div className="flex gap-2">
          {/* 红色按钮 - 带钉子 */}
          <div 
            className="relative w-3 h-3 select-none"
            onClick={(e) => {
              e.stopPropagation()
              handleNailClick('red')
            }}
          >
            <div 
              className={`w-3 h-3 rounded-full bg-[#ff5f56] flex items-center justify-center transition-all duration-500`}
              style={{
                transform: nailState.red.fallen 
                  ? 'translateY(500px) rotate(180deg)' 
                  : nailState.red.clicks >= nailState.red.moveThreshold
                    ? `translateY(${(nailState.red.clicks - nailState.red.moveThreshold) * 3}px) rotate(${(nailState.red.clicks - nailState.red.moveThreshold) * 12}deg)`
                    : 'none',
                opacity: nailState.red.fallen ? 0 : 1,
                transition: 'all 0.3s ease-out'
              }}
            >
              <span className="text-[#8b0000] text-[10px] font-bold leading-none">✱</span>
            </div>
          </div>
          
          {/* 黄色按钮 - 带钉子 */}
          <div 
            className="relative w-3 h-3 select-none"
            onClick={(e) => {
              e.stopPropagation()
              handleNailClick('yellow')
            }}
          >
            <div 
              className={`w-3 h-3 rounded-full bg-[#ffbd2e] flex items-center justify-center transition-all duration-500`}
              style={{
                transform: nailState.yellow.fallen 
                  ? 'translateY(500px) rotate(180deg)' 
                  : nailState.yellow.clicks >= nailState.yellow.moveThreshold
                    ? `translateY(${(nailState.yellow.clicks - nailState.yellow.moveThreshold) * 3}px) rotate(${(nailState.yellow.clicks - nailState.yellow.moveThreshold) * 12}deg)`
                    : 'none',
                opacity: nailState.yellow.fallen ? 0 : 1,
                transition: 'all 0.3s ease-out'
              }}
            >
              <span className="text-[#8b6914] text-[10px] font-bold leading-none">✱</span>
            </div>
          </div>
          
          {/* 绿色按钮 - 带钉子 */}
          <div 
            className="relative w-3 h-3 select-none"
            onClick={(e) => {
              e.stopPropagation()
              handleNailClick('green')
            }}
          >
            <div 
              className={`w-3 h-3 rounded-full bg-[#27c93f] flex items-center justify-center transition-all duration-500`}
              style={{
                transform: nailState.green.fallen 
                  ? 'translateY(500px) rotate(180deg)' 
                  : nailState.green.clicks >= nailState.green.moveThreshold
                    ? `translateY(${(nailState.green.clicks - nailState.green.moveThreshold) * 3}px) rotate(${(nailState.green.clicks - nailState.green.moveThreshold) * 12}deg)`
                    : 'none',
                opacity: nailState.green.fallen ? 0 : 1,
                transition: 'all 0.3s ease-out'
              }}
            >
              <span className="text-[#0d5c1f] text-[10px] font-bold leading-none">✱</span>
            </div>
          </div>
        </div>
        <span className="text-sm text-[#d3d3d3] ml-4 font-mono">leoy@ubuntu: ~</span>
      </div>

      {/* Terminal Output */}
      <div
        ref={outputRef}
        className="flex-1 overflow-y-auto p-4 font-mono text-sm leading-relaxed"
        onClick={() => inputRef.current?.focus()}
      >
        {output.map((line, index) => (
          <div key={index} className="mb-1">
            {line.type === "command" && (
              <div className="flex gap-2">
                <span className="text-[#8ae234]">{line.prompt}</span>
                <span className="text-[#d3d3d3]">{line.content}</span>
              </div>
            )}
            {line.type === "output" && renderOutput(line.content)}
            {line.type === "error" && (
              <pre className="text-[#ff6b6b] whitespace-pre-wrap font-mono">{line.content}</pre>
            )}
          </div>
        ))}

        {/* Current Input Line */}
        <div className="flex gap-2 items-center">
          <span className="text-[#8ae234] whitespace-nowrap">leoy@ubuntu:{currentPath}$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none text-[#d3d3d3] font-mono caret-[#d3d3d3]"
            autoFocus
            spellCheck={false}
          />
        </div>

        {/* Tab Completion Suggestions */}
        {showSuggestions && tabSuggestions.length > 0 && (
          <div className="mt-1 text-[#d3d3d3]">
            {tabSuggestions.join("  ")}
          </div>
        )}
      </div>
    </div>
    </div>
  )
}
