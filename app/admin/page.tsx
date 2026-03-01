"use client"

import { useState, useEffect, useCallback } from "react"
import { AdminLogin } from "@/components/admin-login"
import { AdminDashboard } from "@/components/admin-dashboard"

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false)
  const [checking, setChecking] = useState(true)

  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/settings")
      if (res.ok) {
        setAuthenticated(true)
      }
    } catch {
      // not authenticated
    } finally {
      setChecking(false)
    }
  }, [])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" })
    setAuthenticated(false)
  }

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!authenticated) {
    return <AdminLogin onSuccess={() => setAuthenticated(true)} />
  }

  return <AdminDashboard onLogout={handleLogout} />
}
