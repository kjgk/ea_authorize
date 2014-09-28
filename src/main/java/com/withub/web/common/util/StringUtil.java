package com.withub.web.common.util;

import org.apache.commons.lang.StringUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.StringTokenizer;
import java.util.UUID;

/**
 * 字符串处理工具类.
 */
public final class StringUtil {

    //================================ 判断方法 ===========================================================

    /**
     * 判断两个字符串是否相等
     *
     * @param source 源字符串
     * @param target 目标字符串
     * @return boolean
     */
    public static boolean compareValue(final String source, final String target) {

        String sourceText = source;
        String targetText = target;
        if (sourceText == null) {
            sourceText = "";
        }

        if (targetText == null) {
            targetText = "";
        }

        boolean result = sourceText.trim().equalsIgnoreCase(targetText.trim());
        return result;
    }

    /**
     * 判断字符串是否为空
     *
     * @param text 字符串
     * @return boolean
     */
    public static boolean isEmpty(final String text) {

        return StringUtils.isBlank(text);
    }

    /**
     * 判断字符串是否为非空
     *
     * @param text 字符串
     * @return boolean
     */
    public static boolean isNotEmpty(final String text) {

        boolean result = isEmpty(text);
        return !result;
    }

    /**
     * 判断字符串是否是整数
     *
     * @param text 字符串
     * @return boolean
     */
    public static boolean isInteger(final String text) {

        try {
            Integer.parseInt(text);
        } catch (Exception e) {
            return false;
        }
        return true;
    }

    /**
     * 判断字符串是否是数字
     *
     * @param text 字符串
     * @return boolean
     */
    public static boolean isNumber(final String text) {

        try {
            Double.parseDouble(text);
        } catch (Exception e) {
            return false;
        }
        return true;
    }

    //================================= 字符串操作 ========================================================

    /**
     * 获取 UUID 字符串
     *
     * @return String
     */
    public static String getUuid() {

        String uuid = UUID.randomUUID().toString().toUpperCase();
        return uuid;
    }

    /**
     * 复制字符串
     *
     * @param text
     * @param count
     * @return
     */
    public static String duplicateString(final String text, final int count) {

        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < count; i++) {
            sb.append(text);
        }
        return sb.toString();
    }

    /**
     * 对字符串进行加法
     *
     * @param text          字符串列表
     * @param defaultLength 默认长度
     * @return String
     * @throws Exception 异常
     */
    public static String increaseAlphabet(final String text, final int defaultLength) throws Exception {

        String alphabetList = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        String alphabet = "";
        String character;

        if (isEmpty(text)) {
            character = substring(alphabetList, 0, 1);
            for (int i = 0; i < defaultLength; i++) {
                alphabet += character;
            }
            return alphabet;
        }

        String code = text.trim().toUpperCase();
        String lastAlphabetCharacter = alphabetList.substring(alphabetList.length() - 1);
        String lastCodeCharacter = code.substring(code.length() - 1);
        if (lastCodeCharacter.equals(lastAlphabetCharacter)) {
            int i;
            for (i = code.length() - 1; i > -1; i--) {
                character = substring(code, i, 1);
                if (!character.equals(lastAlphabetCharacter)) {
                    break;
                }
            }

            if (i == -1) {
                throw new Exception("达到最大值.");
            }
        }

        String nextCharacter;
        String firstAlphabetCharacter = alphabetList.substring(0, 1);

        if (lastCodeCharacter.equals(lastAlphabetCharacter)) {
            List<String> characterList = new ArrayList<String>();
            characterList.add(firstAlphabetCharacter);
            int j = code.length() - 2;
            String previousCodeCharacter = substring(code, j, 1);

            while (previousCodeCharacter.equals(lastAlphabetCharacter)) {
                characterList.add(firstAlphabetCharacter);
                previousCodeCharacter = substring(code, --j, 1);
            }

            int i = alphabetList.indexOf(previousCodeCharacter);
            nextCharacter = substring(alphabetList, i + 1, 1);

            String tempCode = "";
            for (i = characterList.size() - 1; i > -1; i--) {
                tempCode += characterList.get(i);
            }

            alphabet = substring(code, 0, code.length() - tempCode.length() - 1) + nextCharacter + tempCode;

        } else {
            int i = alphabetList.indexOf(lastCodeCharacter);
            nextCharacter = substring(alphabetList, i + 1, 1);
            alphabet = substring(code, 0, code.length() - 1) + nextCharacter;
        }

        return alphabet;
    }

    /**
     * 从字符串中指定的位置开始提取指定长度的字符串
     *
     * @param text       字符串
     * @param beginIndex 起始索引
     * @param length     要提取的长度
     * @return String
     */
    public static String substring(final String text, final int beginIndex, final int length) {

        String retValue;

        if (isEmpty(text)) {
            return "";
        }

        if (length <= 0) {
            return "";
        }

        int startIndex = beginIndex;
        if (startIndex < 0) {
            startIndex = 0;
        }

        if (startIndex + length > text.length()) {
            retValue = text.substring(startIndex);
        } else {
            retValue = text.substring(startIndex, startIndex + length);
        }

        return retValue;
    }

    /**
     * 从字符串中提取子字符串
     *
     * @param text       字符串
     * @param beginIndex 起始索引
     * @return String
     */
    public static String substring(final String text, final int beginIndex) {

        String retValue;

        if (isEmpty(text)) {
            return "";
        }

        int startIndex = beginIndex;
        if (startIndex < 0) {
            startIndex = 0;
        }

        retValue = text.substring(startIndex);

        return retValue;
    }

    /**
     * 使用正则表达式替换
     *
     * @param text        字符串
     * @param regex       正则表达式
     * @param replacement 要替换的字符串
     * @return String
     */
    public static String replaceAll(final String text, final String regex, final String replacement) {

        String value = text.replaceAll(regex, replacement);
        return value;
    }

    /**
     * 去除字符串首尾的字符串
     *
     * @param text        字符串
     * @param stripString 要去除的字符串
     * @return String
     */
    public static String trim(final String text, final String stripString) {

        String result = StringUtils.strip(text, stripString);
        return result;
    }


    /**
     * 去除字符串尾部的字符串
     *
     * @param text        字符串
     * @param stripString 要去除的字符串
     * @return String
     */
    public static String trimEnd(final String text, final String stripString) {

        String result = StringUtils.stripEnd(text, stripString);
        return result;
    }

    /**
     * 反转字符串
     *
     * @param text 字符串
     * @return String
     */
    public static String reverseString(final String text) {

        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < text.length(); i++) {
            sb.append(text.charAt(text.length() - 1 - i));
        }
        return sb.toString();
    }

    //=================================== 字符串拆分 ======================================================

    /**
     * 将字符串按指定的分隔符拆分
     *
     * @param text      字符串
     * @param seperator 分隔符
     * @param include   包含标识
     * @return String[]
     */
    public static String[] split(final String text, final String seperator, final boolean include) {

        StringTokenizer tokens = new StringTokenizer(text, seperator, include);
        String[] result = new String[tokens.countTokens()];
        int i = 0;
        while (tokens.hasMoreTokens()) {
            result[i++] = tokens.nextToken();
        }
        return result;
    }

    /**
     * 将字符串按固定长度拆分
     *
     * @param text   字符串
     * @param length 长度
     * @return String[]
     */
    public static String[] splitStringByLength(final String text, final int length) {

        int count;
        if (text.length() % length == 0) {
            count = (int) Math.ceil(text.length() / length);
        } else {
            count = (int) Math.ceil(text.length() / length) + 1;
        }

        String[] stringArray = new String[count];
        for (int i = 0; i < count; i++) {
            if (i == count - 1) {
                stringArray[i] = text.substring(i * length);
            } else {
                stringArray[i] = text.substring(i * length, length);
            }
        }

        return stringArray;
    }

    //============================== 字符串编码方法  ======================================================

    /**
     * 将字节数组按 UTF-8  编码化成字符串
     *
     * @param bytes 字节数组
     * @return String
     */
    public static String getStringFromByteArray(final byte[] bytes) {

        String val = getStringFromByteArray(bytes, "utf-8");

        return val;
    }

    /**
     * 将字节数组按指定 编码化成字符串
     *
     * @param bytes    字节数组
     * @param encoding 编码
     * @return String
     */
    public static String getStringFromByteArray(final byte[] bytes, final String encoding) {

        String val = "";
        if (bytes != null && bytes.length > 0) {
            try {
                val = new String(bytes, 0, bytes.length, encoding);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return val;
    }

    /**
     * 判断IP是否在某个区间里面
     * 判断依据: 前3个数字相等,第4位数字判断介于起始IP的第4位和截至IP的第4位数字
     *
     * @param ip      要判断的IP
     * @param beginIp 起始IP
     * @param endIp   截至IP
     * @return boolean
     */
    public static boolean isIpInRegion(final String ip, final String beginIp, final String endIp) {

        String ipPre3 = ip.substring(0, ip.lastIndexOf("."));
        String beginIpPre3 = beginIp.substring(0, beginIp.lastIndexOf("."));
        if (!ipPre3.equals(beginIpPre3)) {
            return false;
        }

        int ip4 = Integer.parseInt(ip.substring(ip.lastIndexOf(".") + 1));
        int beginIp4 = Integer.parseInt(beginIp.substring(beginIp.lastIndexOf(".") + 1));
        int endIp4 = Integer.parseInt(endIp.substring(endIp.lastIndexOf(".") + 1));

        return ip4 >= beginIp4 && ip4 <= endIp4;
    }

    /**
     * 授权验证
     *
     * @return
     */
    public static boolean authorize(String uniqueCodes, String authorizationCodes, String clientKey) {

        if (StringUtil.isEmpty(authorizationCodes)) {
            return false;
        }
        String uniqueCode[] = uniqueCodes.split(",");
        List<String> systemCodeList = new ArrayList<String>();
        for (String s : uniqueCode) {
            systemCodeList.add(Md5Util.getStringMD5(clientKey + s).toUpperCase());
        }
        String authorizationCode[] = authorizationCodes.split(",");
        for (String s : authorizationCode) {
            if (systemCodeList.contains(s)) {
                return true;
            }
        }
        return false;
    }
}
