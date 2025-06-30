"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Trash2, Heart, MapPin, Calendar, AlertCircle, RefreshCw } from "lucide-react"
import { AlertDialog, AlertDialogDescription } from "../components/ui/alert-dialog"
import {wishlistService} from "../services/wishlistServices"

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [removingIds, setRemovingIds] = useState(new Set())
  const [refreshing, setRefreshing] = useState(false)

  // Load wishlist on component mount
  useEffect(() => {
    loadWishlist()
  }, [])

  const loadWishlist = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await wishlistService.getWishlist()
      setWishlist(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    try {
      setRefreshing(true)
      setError(null)
      const data = await wishlistService.getWishlist()
      setWishlist(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setRefreshing(false)
    }
  }

  const handleRemoveFromWishlist = async (eventId) => {
    try {
      setRemovingIds((prev) => new Set(prev).add(eventId))
      await wishlistService.removeFromWishlist(eventId)
      setWishlist((prev) => prev.filter((event) => event.id !== eventId))
    } catch (err) {
      setError(err.message)
    } finally {
      setRemovingIds((prev) => {
        const newSet = new Set(prev)
        newSet.delete(eventId)
        return newSet
      })
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Đang tải danh sách yêu thích...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Danh Sách Yêu Thích</h1>
        <p className="text-muted-foreground">Các sự kiện bạn đã lưu để xem sau</p>
      </div>

      {error && (
        <AlertDialog className="mb-6" variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDialogDescription>{error}</AlertDialogDescription>
        </AlertDialog>
      )}

      {wishlist.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Danh sách yêu thích trống</h2>
          <p className="text-muted-foreground mb-4">Hãy bắt đầu thêm các sự kiện vào danh sách yêu thích</p>
          <Button onClick={handleRefresh} variant="outline" disabled={refreshing}>
            {refreshing ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Đang tải...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Làm mới
              </>
            )}
          </Button>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-6">
            <Badge variant="secondary" className="text-sm">
              {wishlist.length} {wishlist.length === 1 ? "sự kiện" : "sự kiện"} đã lưu
            </Badge>
            <Button onClick={handleRefresh} variant="outline" size="sm" disabled={refreshing}>
              {refreshing ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Đang tải...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Làm mới
                </>
              )}
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {wishlist.map((event) => (
              <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={event.imageUrl || "/placeholder.svg?height=200&width=400"}
                    alt={event.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "/placeholder.svg?height=200&width=400"
                    }}
                  />
                </div>

                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg line-clamp-2">{event.title}</CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-600 hover:bg-red-50 shrink-0"
                      onClick={() => handleRemoveFromWishlist(event.id)}
                      disabled={removingIds.has(event.id)}
                      title="Xóa khỏi danh sách yêu thích"
                    >
                      {removingIds.has(event.id) ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <CardDescription className="line-clamp-2">{event.description}</CardDescription>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{event.location}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Button className="flex-1" size="sm">
                      Xem Chi Tiết
                    </Button>
                    <Button variant="outline" size="sm">
                      Chia Sẻ
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
