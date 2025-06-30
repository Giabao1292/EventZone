"use client"

import { createContext, useContext, useState, useEffect } from "react"

const AlertDialogContext = createContext()

const AlertDialog = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)

  return <AlertDialogContext.Provider value={{ isOpen, setIsOpen }}>{children}</AlertDialogContext.Provider>
}

const AlertDialogTrigger = ({ children, asChild, ...props }) => {
  const { setIsOpen } = useContext(AlertDialogContext)

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

const AlertDialogContent = ({ children, className = "", ...props }) => {
  const { isOpen, setIsOpen } = useContext(AlertDialogContext)

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
      <div className={`relative bg-white rounded-lg shadow-lg border max-w-md w-full mx-4 ${className}`} {...props}>
        {children}
      </div>
    </div>
  )
}

const AlertDialogHeader = ({ children, className = "", ...props }) => (
  <div className={`flex flex-col space-y-2 text-center sm:text-left p-6 pb-0 ${className}`} {...props}>
    {children}
  </div>
)

const AlertDialogTitle = ({ children, className = "", ...props }) => (
  <h2 className={`text-lg font-semibold ${className}`} {...props}>
    {children}
  </h2>
)

const AlertDialogDescription = ({ children, className = "", ...props }) => (
  <p className={`text-sm text-gray-500 ${className}`} {...props}>
    {children}
  </p>
)

const AlertDialogFooter = ({ children, className = "", ...props }) => (
  <div className={`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 p-6 pt-0 ${className}`} {...props}>
    {children}
  </div>
)

const AlertDialogAction = ({ children, className = "", onClick, ...props }) => {
  const { setIsOpen } = useContext(AlertDialogContext)

  const handleClick = (e) => {
    if (onClick) {
      onClick(e)
    }
    setIsOpen(false)
  }

  return (
    <button
      className={`inline-flex h-10 items-center justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white ring-offset-white transition-colors hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${className}`}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  )
}

const AlertDialogCancel = ({ children, className = "", ...props }) => {
  const { setIsOpen } = useContext(AlertDialogContext)

  return (
    <button
      className={`inline-flex h-10 items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium ring-offset-white transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 sm:mt-0 ${className}`}
      onClick={() => setIsOpen(false)}
      {...props}
    >
      {children}
    </button>
  )
}

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
}
