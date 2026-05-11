/*the chatbot that will talk witht the user so the shell for ai mentor/chat*/
import React, {useState} from "react";
export default function ChatbotWidget({onSend}) {
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState("");
  if(!open) return <button onClick={()=>setOpen(true)} className="fixed bottom-6 right-6 p-3 rounded-full bg-purple-600">💬</button>;
  return (
    <div className="fixed bottom-6 right-6 w-80 h-96 bg-white/10 backdrop-blur p-3 rounded-xl">
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-auto"> {/* messages area */}</div>
        <div className="mt-2 flex gap-2">
          <input className="flex-1" value={msg} onChange={
            e=>setMsg(e.target.value)} />
          <button onClick={()=>{onSend(msg); setMsg("");}}>Send</button>
        </div>
      </div>
      <button onClick={()=>setOpen(false)} className="absolute top-2 right-2">✕</button>
    </div>
  );
}
