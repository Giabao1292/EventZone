"use client"

import { useState, useEffect } from "react"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Heart, MapPin, Calendar, AlertCircle, RefreshCw, Search } from "lucide-react"
import { Input } from "../components/ui/input"
import backGround from "../assets/images/background/background.png"
import BackgroundEffect from "../ui/BackGround"

import wishlistService from "../services/wishlistServices"

export default function WishlistPage() {
    const [wishlist, setWishlist] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [removingIds, setRemovingIds] = useState(new Set())
    const [refreshing, setRefreshing] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")

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

    const filteredWishlist = wishlist.filter(
        (event) =>
            event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.description.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex items-center justify-center min-h-[400px]">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                            <p className="text-gray-400">Đang tải danh sách yêu thích...</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen text-white relative overflow-hidden">
            <BackgroundEffect image={backGround} />
            {/* Navigation Bar */}
            <nav className="border-b border-gray-800">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-8">
                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">T</span>
                                </div>
                                <span className="text-white font-semibold text-lg">TicketPlus</span>
                            </div>
                            <div className="hidden md:flex space-x-6">
                                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                                    Sự kiện
                                </a>
                                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                                    Về chúng tôi
                                </a>
                                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                                    Liên hệ
                                </a>
                                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                                    📧 Vé đã mua
                                </a>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Button className="bg-orange-500 hover:bg-orange-600 text-white">Trở thành nhà tổ chức</Button>
                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                                    <span className="text-white text-sm">A</span>
                                </div>
                                <span className="text-white text-sm">Administrator</span>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="relative py-10 px-4">
                <div className="relative py-10 px-4 z-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white drop-shadow-md">
                        Danh Sách Yêu Thích
                    </h1>
                    <p className="text-xl text-white/90 mb-8 drop-shadow-sm">
                        Các sự kiện bạn đã lưu để xem sau
                    </p>

                    <div className="max-w-md mx-auto relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <Input
                            type="text"
                            placeholder="Tìm kiếm sự kiện yêu thích..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-12 pl-12 bg-gray-800/60 border border-gray-700 text-white placeholder-gray-400 focus:border-orange-500"
                        />
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 pb-10">
                {error && (
                    <Alert className="mb-6 bg-red-900/20 border-red-800">
                        <AlertCircle className="h-4 w-4 text-red-400" />
                        <AlertDescription className="text-red-300">{error}</AlertDescription>
                    </Alert>
                )}

                {filteredWishlist.length === 0 ? (
                    <div className="text-center py-16">
                        <Heart className="h-16 w-16 text-gray-500 mx-auto mb-6" />
                        <h2 className="text-2xl font-semibold mb-4 text-white">
                            {searchQuery ? "Không tìm thấy sự kiện" : "Danh sách yêu thích trống"}
                        </h2>
                        <p className="text-gray-300 mb-8 text-base">
                            {searchQuery ? "Thử tìm kiếm với từ khóa khác" : "Hãy bắt đầu thêm các sự kiện vào danh sách yêu thích"}
                        </p>
                        <div className="flex gap-4 justify-center">
                            {searchQuery && (
                                <Button
                                    onClick={() => setSearchQuery("")}
                                    variant="outline"
                                    className="border-gray-500 text-gray-300 hover:bg-gray-800 bg-transparent"
                                >
                                    Xóa tìm kiếm
                                </Button>
                            )}
                            <Button
                                onClick={handleRefresh}
                                variant="outline"
                                disabled={refreshing}
                                className="border-gray-500 text-gray-300 hover:bg-gray-800 bg-transparent"
                            >
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
                    </div>
                ) : (
                    <>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <h2 className="text-xl font-semibold text-white">Sự kiện yêu thích</h2>
                                <Badge className="bg-gray-800 text-gray-200 text-sm px-2 py-0.5">
                                    {filteredWishlist.length} sự kiện
                                </Badge>
                            </div>
                            <Button
                                onClick={handleRefresh}
                                variant="outline"
                                size="sm"
                                disabled={refreshing}
                                className="border-gray-500 text-gray-300 hover:bg-gray-800 bg-transparent"
                            >
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

                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                            {filteredWishlist.map((event, index) => {
                                const isRemoving = removingIds.has(event.id)
                                return (
                                    <div key={event.id} className="group relative text-sm">
                                        <div
                                            className="relative rounded-xl overflow-hidden h-32 group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                                            style={{ background: `linear-gradient(135deg, ${getGradientColors(index)})` }}
                                        >
                                            {event.imageUrl && (
                                                <img
                                                    src={event.imageUrl}
                                                    alt={event.title}
                                                    className="absolute inset-0 w-full h-full object-cover"
                                                />
                                            )}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleRemoveFromWishlist(event.id)
                                                }}
                                                className="absolute top-2 right-2 z-10 p-1 rounded-full bg-black/30 backdrop-blur hover:bg-black/50 transition"
                                                title="Xoá khỏi yêu thích"
                                                disabled={isRemoving}
                                            >
                                                {isRemoving ? (
                                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                                ) : (
                                                    <svg
                                                        className="w-5 h-5 fill-white hover:fill-red-500 transition"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                                        />
                                                    </svg>
                                                )}
                                            </button>
                                        </div>

                                        <div className="mt-2 px-1 space-y-0.5">
                                            <h3 className="font-semibold text-sm text-white truncate">{event.title}</h3>
                                            <div className="flex items-center gap-1 text-gray-300 text-xs">
                                                <Calendar className="h-3 w-3" />
                                                <span>{event.date}</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-gray-300 text-xs">
                                                <MapPin className="h-3 w-3" />
                                                <span className="truncate">{event.location || "Chưa rõ"}</span>
                                            </div>
                                            {event.price && (
                                                <p className="text-orange-400 text-xs font-medium">{event.price}</p>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </>
                )}
            </div>


            {/* Footer */}
            <footer className="bg-gray-900 border-t border-gray-800 py-12">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="text-white font-semibold mb-4">Hotline</h3>
                            <p className="text-orange-500 font-bold text-lg">1900.6408</p>
                            <p className="text-gray-400 mt-2">Email</p>
                            <p className="text-gray-300">📧 support@ticketbox.vn</p>
                        </div>
                        <div>
                            <h3 className="text-white font-semibold mb-4">Dành cho Khách hàng</h3>
                            <p className="text-gray-300 mb-2">Điều khoản sử dụng cho khách hàng</p>
                            <h3 className="text-white font-semibold mb-2 mt-4">Dành cho Ban Tổ chức</h3>
                            <p className="text-gray-300">Điều khoản sử dụng cho ban tổ chức</p>
                        </div>
                        <div>
                            <h3 className="text-white font-semibold mb-4">Về công ty chúng tôi</h3>
                            <p className="text-gray-300 mb-2">Quy chế hoạt động</p>
                            <p className="text-gray-300 mb-2">Chính sách bảo mật thông tin</p>
                            <p className="text-gray-300">Cơ chế giải quyết tranh chấp/khiếu nại</p>
                        </div>
                        <div>
                            <h3 className="text-white font-semibold mb-4">Follow us</h3>
                            <div className="flex space-x-4">
                                <div className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center">
                                    <span className="text-white text-sm">f</span>
                                </div>
                                <div className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center">
                                    <span className="text-white text-sm">📷</span>
                                </div>
                                <div className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center">
                                    <span className="text-white text-sm">🎵</span>
                                </div>
                                <div className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center">
                                    <span className="text-white text-sm">💬</span>
                                </div>
                                <div className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center">
                                    <span className="text-white text-sm">in</span>
                                </div>
                            </div>
                            <p className="text-white font-semibold mt-4">Ngôn ngữ</p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}

// Helper function to generate gradient colors for cards
function getGradientColors(index) {
    const gradients = [
        "#3B82F6, #1E40AF", // Blue
        "#10B981, #047857", // Green
        "#8B5CF6, #5B21B6", // Purple
        "#F59E0B, #D97706", // Orange
        "#EF4444, #DC2626", // Red
        "#06B6D4, #0891B2", // Cyan
        "#84CC16, #65A30D", // Lime
        "#F97316, #EA580C", // Orange Deep
    ]
    return gradients[index % gradients.length]
}
