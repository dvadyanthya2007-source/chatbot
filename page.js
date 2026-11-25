"use client"


import { useState } from "react"


export default function page() {


  const [message, setMessage] = useState("")
  const [chat, setChat] = useState([])
  const [loading, setLoading] = useState(false)


  async function sendMessage() {


    if (!message.trim()) return


    const userMessage = message


    setChat(prev => [
      ...prev,
      { sender: "You", text: userMessage }
    ])


    setMessage("")
    setLoading(true)


    try {


      const response = await fetch("/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: userMessage
        })
      })


      const data = await response.json()


      if (!response.ok) {
        throw new Error(data.error || "API request failed")
      }


      setChat(prev => [
        ...prev,
        { sender: "Bot", text: data.reply }
      ])


    } catch (error) {


      console.log(error)


      setChat(prev => [
        ...prev,
        { sender: "Bot", text: error.message || "Something went wrong!" }
      ])


    }


    setLoading(false)
  }


  return (
    <div style={{ padding: "30px" }}>


      <h1>My First AI Chatbot</h1>


      {chat.map((item, index) => (
        <div key={index}>
          <b>{item.sender}:</b>
          <p>{item.text}</p>
        </div>
      ))}


      {loading && <p>Bot is typing...</p>}


      <input
        type="text"
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") sendMessage()
        }}
      />


      <button onClick={sendMessage}>
        Send
      </button>


    </div>
  )
}
