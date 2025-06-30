"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { X } from "lucide-react"

const DialogContext = createContext()

const Dialog = ({ children, open, onOpenChange }) => {
  const [isOpen, setIsOpen] = useState(open || false)

  useEffect(() => {
    if (open !== undefined) {
      setIsOpen(open)
    }
  }, [open])

  const handleOpenChange = (newOpen) => {
    setIsOpen(newOpen)
    if (onOpenChange) {
      onOpenChange(newOpen)
    }
  }

  return <DialogContext.Provider value={{ isOpen, setIsOpen: handleOpenChange }}>{children}</DialogContext.Provider>
}

const DialogTrigger = ({ children, asChild, ...props }) => {
  const { setIsOpen } = useContext(DialogContext)

  const handleClick = () => {
    setIsOpen(true)
  }

  if (asChild) {
    return (
      <div onClick={handleClick} {...props}>
        {children}
      </div>
    )
  }

  return (
    <button onClick={handleClick} {...props}>
      {children}
    </button>
  )
}

const DialogContent = ({ children, className = "", ...props }) => {
  const { isOpen, setIsOpen } = useContext(DialogContext)

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "unset"
    }
  }, [isOpen, setIsOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={() => setIsOpen(false)} />
      <div className={`relative bg-white rounded-lg shadow-lg border max-w-lg w-full mx-4 ${className}`} {...props}>
        <button
          onClick={() => setIsOpen(false)}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <X className="h-4 w-4" />
        </button>
        {children}
      </div>
    </div>
  )
}

const DialogHeader = ({ children, className = "", ...props }) => (
  <div className={`flex flex-col space-y-1.5 text-center sm:text-left p-6 pb-0 ${className}`} {...props}>
    {children}
  </div>
)

const DialogTitle = ({ children, className = "", ...props }) => (
  <h2 className={`text-lg font-semibold leading-none tracking-tight ${className}`} {...props}>
    {children}
  </h2>
)

const DialogDescription = ({ children, className = "", ...props }) => (
  <p className={`text-sm text-gray-500 ${className}`} {...props}>
    {children}
  </p>
)

const DialogFooter = ({ children, className = "", ...props }) => (
  <div className={`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 p-6 pt-0 ${className}`} {...props}>
    {children}
  </div>
)

export { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter }
