import React from 'react'

const LandingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="dark min-h-screen bg-background text-foreground transition-colors duration-500">
      {children}
    </div>
  )
}

export default LandingLayout
