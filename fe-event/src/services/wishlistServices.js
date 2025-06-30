import apiClient from "../api/axios"

export const wishlistService = {
  /**
   * Lấy danh sách wishlist của user
   * @returns {Promise<Array>} Danh sách events trong wishlist
   */
  async getWishlist() {
    try {
      const response = await apiClient.get("/users/wishlist")
      if (response.data.code === 200) {
        return response.data.data || []
      }
      throw new Error(response.data.message)
    } catch (error) {
      if (error.response?.status === 404) {
        return []
      }
      throw new Error(error.response?.data?.message || "Failed to fetch wishlist")
    }
  },

  /**
   * Thêm event vào wishlist
   * @param {number} eventId - ID của event cần thêm
   * @returns {Promise<string>} Message từ server
   */
  async addToWishlist(eventId) {
    try {
      const response = await apiClient.post(`/users/wishlist/${eventId}`)
      if (response.data.code === 200) {
        return response.data.message
      }
      throw new Error(response.data.message)
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to add to wishlist")
    }
  },

  /**
   * Xóa event khỏi wishlist
   * @param {number} eventId - ID của event cần xóa
   * @returns {Promise<string>} Message từ server
   */
  async removeFromWishlist(eventId) {
    try {
      const response = await apiClient.delete(`/users/wishlist/${eventId}`)
      if (response.data.code === 200) {
        return response.data.message
      }
      throw new Error(response.data.message)
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to remove from wishlist")
    }
  },

  /**
   * Kiểm tra xem event có trong wishlist không
   * @param {number} eventId - ID của event cần kiểm tra
   * @returns {Promise<boolean>} True nếu event có trong wishlist
   */
  async isInWishlist(eventId) {
    try {
      const wishlist = await this.getWishlist()
      return wishlist.some((event) => event.id === eventId)
    } catch (error) {
      console.error("Error checking wishlist status:", error)
      return false
    }
  },
}

export default wishlistService
