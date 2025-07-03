package com.example.backend.service;

import com.example.backend.model.Booking;
import com.example.backend.model.EventAds;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class VNPayService {

    private static final Logger log = LoggerFactory.getLogger(VNPayService.class);

    @Value("${vnpay.tmn_code}")
    private String vnp_TmnCode;

    @Value("${vnpay.hash_secret}")
    private String vnp_HashSecret;

    @Value("${vnpay.pay_url}")
    private String vnp_PayUrl;

    @Value("${vnpay.return_url}")
    private String vnp_ReturnUrl;

    public String createPaymentUrl(Booking booking, HttpServletRequest request) throws Exception {
        long amount = booking.getFinalPrice().longValue() * 100;
        String clientIp = getClientIp(request);
        String vnp_TxnRef = getRandomNumber(8); // Generate random TxnRef

        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", "2.1.0");
        vnp_Params.put("vnp_Command", "pay");
        vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
        vnp_Params.put("vnp_Amount", String.valueOf(amount));
        vnp_Params.put("vnp_CurrCode", "VND");
        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.put("vnp_OrderInfo", "BookingID:" + booking.getId());
        vnp_Params.put("vnp_OrderType", "other");
        vnp_Params.put("vnp_Locale", "vn");
        vnp_Params.put("vnp_ReturnUrl", vnp_ReturnUrl + "?orderId=" + booking.getId()+ "&paymentMethod=VNPAY");
        vnp_Params.put("vnp_IpAddr", clientIp);

        // Add CreateDate and ExpireDate
        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
        Calendar calendar = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        String vnp_CreateDate = sdf.format(calendar.getTime());
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);
        calendar.add(Calendar.MINUTE, 15);
        vnp_Params.put("vnp_ExpireDate", sdf.format(calendar.getTime()));

        List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
        Collections.sort(fieldNames);

        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();

        for (int i = 0; i < fieldNames.size(); i++) {
            String key = fieldNames.get(i);
            String value = vnp_Params.get(key);
            if (value != null && !value.isEmpty()) {
                hashData.append(key).append("=").append(URLEncoder.encode(value, StandardCharsets.UTF_8.toString()));
                query.append(URLEncoder.encode(key, StandardCharsets.UTF_8.toString())).append("=")
                        .append(URLEncoder.encode(value, StandardCharsets.UTF_8.toString()));
                if (i < fieldNames.size() - 1) {
                    hashData.append("&");
                    query.append("&");
                }
            }
        }

        String secureHash = hmacSHA512(vnp_HashSecret, hashData.toString());
        query.append("&vnp_SecureHash=").append(secureHash);

        log.info("===== VNPAY DEBUG LOG =====");
        log.info("vnp_HashSecret: {}", vnp_HashSecret);
        log.info("Raw hashData: {}", hashData);
        log.info("Generated secureHash: {}", secureHash);
        log.info("Final URL: {}", vnp_PayUrl + "?" + query);
        log.info("============================");

        return vnp_PayUrl + "?" + query;
    }
    public String createPaymentUrlEvent(Integer eventId,Integer amount,String description, HttpServletRequest request) throws Exception {
        long deposit = amount * 100;
        String clientIp = getClientIp(request);
        String vnp_TxnRef = getRandomNumber(8); // Generate random TxnRef

        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", "2.1.0");
        vnp_Params.put("vnp_Command", "pay");
        vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
        vnp_Params.put("vnp_Amount", String.valueOf(deposit));
        vnp_Params.put("vnp_CurrCode", "VND");
        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.put("vnp_OrderInfo", "eventId:" + eventId);
        vnp_Params.put("vnp_OrderType", "other");
        vnp_Params.put("vnp_Locale", "vn");
        vnp_Params.put("vnp_ReturnUrl", "http://localhost:5173/deposit-result" + "?eventId=" + eventId+ "&paymentMethod=VNPAY");
        vnp_Params.put("vnp_IpAddr", clientIp);

        // Add CreateDate and ExpireDate
        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
        Calendar calendar = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        String vnp_CreateDate = sdf.format(calendar.getTime());
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);
        calendar.add(Calendar.MINUTE, 15);
        vnp_Params.put("vnp_ExpireDate", sdf.format(calendar.getTime()));

        List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
        Collections.sort(fieldNames);

        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();

        for (int i = 0; i < fieldNames.size(); i++) {
            String key = fieldNames.get(i);
            String value = vnp_Params.get(key);
            if (value != null && !value.isEmpty()) {
                hashData.append(key).append("=").append(URLEncoder.encode(value, StandardCharsets.UTF_8.toString()));
                query.append(URLEncoder.encode(key, StandardCharsets.UTF_8.toString())).append("=")
                        .append(URLEncoder.encode(value, StandardCharsets.UTF_8.toString()));
                if (i < fieldNames.size() - 1) {
                    hashData.append("&");
                    query.append("&");
                }
            }
        }

        String secureHash = hmacSHA512(vnp_HashSecret, hashData.toString());
        query.append("&vnp_SecureHash=").append(secureHash);

        log.info("===== VNPAY DEBUG LOG =====");
        log.info("vnp_HashSecret: {}", vnp_HashSecret);
        log.info("Raw hashData: {}", hashData);
        log.info("Generated secureHash: {}", secureHash);
        log.info("Final URL: {}", vnp_PayUrl + "?" + query);
        log.info("============================");

        return vnp_PayUrl + "?" + query;
    }
    private String hmacSHA512(String key, String data) throws Exception {
        Mac hmac512 = Mac.getInstance("HmacSHA512");
        SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA512");
        hmac512.init(secretKey);
        byte[] bytes = hmac512.doFinal(data.getBytes(StandardCharsets.UTF_8));
        StringBuilder sb = new StringBuilder();
        for (byte b : bytes) {
            sb.append(String.format("%02x", b));
        }
        return sb.toString();
    }

    private String getClientIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        return ip.equals("0:0:0:0:0:0:0:1") ? "127.0.0.1" : ip;
    }

    private String getRandomNumber(int length) {
        Random random = new Random();
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < length; i++) {
            sb.append(random.nextInt(10));
        }
        return sb.toString();
    }
    public boolean verifyPayment(HttpServletRequest request) {
        try {
            // Lấy tất cả tham số từ request của VNPAY callback
            Map<String, String> fields = new HashMap<>();
            Map<String, String[]> params = request.getParameterMap();

            for (Map.Entry<String, String[]> entry : params.entrySet()) {
                fields.put(entry.getKey(), entry.getValue()[0]);
            }

            // Lấy và xoá vnp_SecureHash khỏi fields
            String receivedHash = fields.remove("vnp_SecureHash");

            // Tạo chuỗi dữ liệu để hash lại
            List<String> fieldNames = new ArrayList<>(fields.keySet());
            Collections.sort(fieldNames);
            StringBuilder hashData = new StringBuilder();
            for (int i = 0; i < fieldNames.size(); i++) {
                String key = fieldNames.get(i);
                String value = fields.get(key);
                hashData.append(key).append("=").append(value);
                if (i < fieldNames.size() - 1) {
                    hashData.append("&");
                }
            }

            // Tính lại chữ ký
            String generatedHash = hmacSHA512(vnp_HashSecret, hashData.toString());

            // So sánh hash và kiểm tra mã phản hồi thành công (00)
            return receivedHash != null
                    && receivedHash.equalsIgnoreCase(generatedHash)
                    && "00".equals(fields.get("vnp_ResponseCode"));

        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
    public String createAdsPaymentUrl(EventAds ads, HttpServletRequest request) throws Exception {
        long amount = Math.round(ads.getTotalPrice() * 100); // VND x100
        String clientIp = getClientIp(request);
        String vnp_TxnRef = getRandomNumber(ads.getId()); // Random mã đơn hàng

        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", "2.1.0");
        vnp_Params.put("vnp_Command", "pay");
        vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
        vnp_Params.put("vnp_Amount", String.valueOf(amount));
        vnp_Params.put("vnp_CurrCode", "VND");
        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.put("vnp_OrderInfo", "EventAdsID:" + ads.getId());
        vnp_Params.put("vnp_OrderType", "advertising");
        vnp_Params.put("vnp_Locale", "vn");
        vnp_Params.put("vnp_IpAddr", clientIp);
        vnp_Params.put("vnp_ReturnUrl", "http://localhost:5173/organizer/payment-ads-result" + "?adsId=" + ads.getId() + "&paymentMethod=VNPAY");

        // Thời gian tạo và hết hạn
        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
        Calendar calendar = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        String createDate = sdf.format(calendar.getTime());
        calendar.add(Calendar.MINUTE, 15);
        String expireDate = sdf.format(calendar.getTime());

        vnp_Params.put("vnp_CreateDate", createDate);
        vnp_Params.put("vnp_ExpireDate", expireDate);

        // Sắp xếp params + build hash & query
        List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
        Collections.sort(fieldNames);

        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();

        for (int i = 0; i < fieldNames.size(); i++) {
            String key = fieldNames.get(i);
            String value = vnp_Params.get(key);
            if (value != null && !value.isEmpty()) {
                hashData.append(key).append("=").append(URLEncoder.encode(value, StandardCharsets.UTF_8));
                query.append(URLEncoder.encode(key, StandardCharsets.UTF_8)).append("=")
                        .append(URLEncoder.encode(value, StandardCharsets.UTF_8));
                if (i < fieldNames.size() - 1) {
                    hashData.append("&");
                    query.append("&");
                }
            }
        }

        String secureHash = hmacSHA512(vnp_HashSecret, hashData.toString());
        query.append("&vnp_SecureHash=").append(secureHash);

        String paymentUrl = vnp_PayUrl + "?" + query;
        log.info("Generated VNPAY Ads Payment URL: {}", paymentUrl);

        return paymentUrl;
    }

}