'use client' 

import React , {useEffect} from 'react'
import { ChatMessage } from '../lib/types';
import { useSidebar } from '@/components/ui/sidebar';

type Props = {
    prompts: ChatMessage[];
    isLoading: boolean;
    endRef: React.RefObject<HTMLDivElement | null>
}



const ChatWindow = ({prompts, isLoading, endRef}: Props) => {
    const { isMobile } = useSidebar()


    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [prompts, endRef])

    const isControlMessage = (content: string): boolean => {
        const trimmed = content.trim()
        return (
            trimmed === '[DONE]' ||
            trimmed.startsWith('data:') ||
            trimmed === '' ||
            trimmed === '...'
        )
    }

    function formatMessage(text: string): React.ReactNode {
        if (isControlMessage(text)) {
            return null
        }
        
        const formattedText = text
            .replace(/^\s+|\s+$/g, "") // trim leading / trailing whitespace
            .replace(/\r\n/g, "\n") // normalise line endings
            .replace(/(\d+\.)(\S)/g, "$1 $2") // ensure space after list number
            .replace(/(\d+\.)\s*\n+/g, "$1 ") // keep list number on same line
            .replace(/\n{3,}/g, "\n\n") // collapse 3+ newlines → exactly 2

        if (formattedText.includes("\n")) {
            const paragraphs = formattedText.split("\n\n")

            return paragraphs.map((paragraph, index) => {
                // Check if paragraph is a numbered list item
                if (/^\d+\.\s/.test(paragraph)) {
                    // Format numbered list items with bold numbers and text up to colon
                    const listMatch = paragraph.match(/^(\d+\.\s)([^:]+)(:?.*)$/)
                    if (listMatch) {
                        const [, number, beforeColon, afterColon] = listMatch
                        return (
                            <div key={index} className="mb-4">
                                <span className="font-bold">{number}{beforeColon}</span>
                                <span>{afterColon}</span>
                            </div>
                        )
                    } else {
                        // If no colon, just bold the number
                        const match = paragraph.match(/^\d+\./)
                        if (!match) return null
                        const number = match[0]
                        const content = paragraph.replace(/^\d+\.\s/, "")

                        return (
                            <div key={index} className="mb-4">
                                <span className="font-bold">{number} </span>
                                <span>{content}</span>
                            </div>
                        )
                    }
                }
                // Check if paragraph starts with a dash (bullet point)
                else if (paragraph.startsWith("- ")) {
                    return (
                        <div key={index} className="flex mb-4">
                            <span className="mr-2 font-bold">•</span>
                            <span>{paragraph.substring(2)}</span>
                        </div>
                    )
                }
                // Regular paragraph
                else {
                    return (
                        <p key={index} className="mb-4 leading-relaxed">
                            {paragraph}
                        </p>
                    )
                }
            })
        }

        return formattedText
    }


    return (
        <div className="w-full h-full overflow-y-auto bg-zinc-900">
            <div
                className="w-full max-w-3xl px-4 mx-auto"
                style={{
                    paddingTop: isMobile ? "1.5rem" : "1.5rem",
                    paddingBottom: isMobile ? "120px" : "0.5rem",
                }}
            >
                {prompts.length === 0 && !isLoading && (
                    <div className="flex flex-col items-center justify-center h-64 text-zinc-400">
                        <p className="text-lg">Start a conversation</p>
                        <p className="text-sm">Type a message to begin</p>
                    </div>
                )}
                
                {prompts.map((prompt) => (
                    <div 
                        key={prompt.message_id}
                        className={`flex ${prompt.sender === "user" ? "justify-end" : "justify-start"} mb-4`}
                    >
                        <div
                            className={
                                prompt.sender === "user"
                                ? "bg-zinc-800 text-white px-4 py-3 rounded-2xl inline-block max-w-md"
                                : "text-white py-2 px-1 font-sans"
                            }
                        >
                            <div className={`leading-relaxed whitespace-pre-wrap ${prompt.sender !== "user" ? "text-base" : ""}`}>
                                {formatMessage(prompt.content)}
                            </div>
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className='flex items-center justify-center py-4'>
                        <div className='flex space-x-2 animate-pulse'>
                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                            <div className="w-2 h-2 delay-100 bg-blue-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 delay-200 bg-blue-400 rounded-full animate-bounce"></div>
                        </div>
                    </div>
                )}
            <div ref={endRef} className="h-4" />
            
            </div>
        </div>
    )
}

export default ChatWindow
