package com.withub.web.common.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.security.MessageDigest;

/**
 * MD5工具类.
 */
public final class Md5Util {

    /**
     * Hex 常量表
     */
    private static final char hexDigits[] = {
            '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
            'a', 'b', 'c', 'd', 'e', 'f'
    };

    /**
     * 计算字符串的MD5值
     *
     * @param text 要计算MD5的字符串
     * @return MD5字符串
     */
    public static final String getStringMD5(final String text) {

        String md5String = "";
        try {
            byte arrByte[] = text.getBytes();
            MessageDigest messageDigest = MessageDigest.getInstance("MD5");
            messageDigest.update(arrByte);
            byte arrMD5Byte[] = messageDigest.digest();
            char arrChar[] = new char[arrMD5Byte.length * 2];
            int i = 0;
            for (byte b : arrMD5Byte) {
                arrChar[i++] = hexDigits[b >>> 4 & 0xf];
                arrChar[i++] = hexDigits[b & 0xf];
            }
            md5String = new String(arrChar);
        } catch (Exception e) {
            e.printStackTrace();
        }

        return md5String;
    }

    /**
     * 计算文件的MD5值
     *
     * @param file 要计算MD5的文件
     * @return MD5字符串
     */
    public static String getFileMd5(final File file) {

        String fileMd5 = "";
        InputStream fis = null;
        StringBuilder sb;

        try {
            fis = new FileInputStream(file);
            byte[] buffer = new byte[1024];
            MessageDigest md5 = MessageDigest.getInstance("MD5");
            int numRead;
            while ((numRead = fis.read(buffer)) > 0) {
                md5.update(buffer, 0, numRead);
            }
            byte[] bytes = md5.digest();
            sb = new StringBuilder(bytes.length * 2);
            for (int i = 0; i < bytes.length; i++) {
                sb.append(hexDigits[(bytes[i] & 0xf0) >>> 4]);
                sb.append(hexDigits[bytes[i] & 0x0f]);
            }
            fileMd5 = sb.toString();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (fis != null) {
                try {
                    fis.close();
                } catch (IOException e) {
                }
            }
        }
        return fileMd5;
    }

}
