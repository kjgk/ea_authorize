package com.withub.web.common.util;

import java.io.*;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.lang.reflect.Modifier;
import java.lang.reflect.ParameterizedType;
import java.net.URLDecoder;
import java.net.URLEncoder;

/**
 * 反射工具类.
 */
public final class ReflectionUtil {

    /**
     * 直接读取对象属性值, 无视private/protected修饰符, 不经过getter函数.
     *
     * @param object        对象
     * @param fullFieldName 带层次的属性名称
     * @return Object 对象
     * @throws Exception 异常
     */
//    public static Object getFieldObjectValue(final Object object, final String fullFieldName) throws Exception {
//
//        Field[] fieldArray = object.getClass().getDeclaredFields();
//        if (CollectionUtil.isEmpty(fieldArray)) {
//            return null;
//        }
//        Object fieldValue = null;
//        if (fullFieldName.indexOf(".") > 0) {
//            String[] fieldNameArray = fullFieldName.split("[.]");
//            Field tempField;
//            Object tempObject = object;
//            for (int i = 0; i < fieldNameArray.length; i++) {
//                if (tempObject == null) {
//                    break;
//                }
//                if (i == fieldNameArray.length - 1) {
//                    fieldValue = getFieldValue(tempObject, fieldNameArray[i]);
//                } else {
//                    tempObject = getFieldValue(tempObject, fieldNameArray[i]);
//                    tempField = getFieldByName(fieldArray, fieldNameArray[i]);
//                    fieldArray = tempField.getType().getDeclaredFields();
//                }
//            }
//        } else {
//            fieldValue = getFieldValue(object, fullFieldName);
//        }
//
//        return fieldValue;
//    }

    /**
     * 根据名称从数组中获取 Field 对象
     *
     * @param fieldArray Field对象数组
     * @param name       名称
     * @return Field
     */
    private static Field getFieldByName(final Field[] fieldArray, final String name) {

        Field retValue = null;
        for (Field field : fieldArray) {
            if (field.getName().equalsIgnoreCase(name)) {
                retValue = field;
            }
        }
        return retValue;
    }

    /**
     * 直接读取对象属性值, 无视private/protected修饰符, 不经过getter函数.
     *
     * @param object    对象
     * @param fieldName 简单属性名称
     * @return Object 对象
     * @throws Exception 异常
     */
    public static Object getFieldValue(final Object object, final String fieldName) throws Exception {

        if (object == null) {
            return null;
        }

        Field field = getDeclaredField(object, fieldName);

        setFieldAccessible(field);

        Object result = field.get(object);

        return result;
    }

    /**
     * 直接设置对象属性值, 无视private/protected修饰符, 不经过setter函数.
     *
     * @param object    对象
     * @param fieldName 属性名称
     * @param value     值
     * @throws IllegalAccessException 异常
     */
    public static void setFieldValue(Object object, final String fieldName, final Object value) throws IllegalAccessException {

        Field field = getDeclaredField(object, fieldName);
        if (field == null) {
            throw new IllegalArgumentException("Could not find field [" + fieldName + "] on target [" + object + "]");
        }
        setFieldAccessible(field);
        field.set(object, value);
    }

    /**
     * 循环向上转型, 获取对象的 DeclaredField.
     * 如向上转型到Object仍无法找到, 返回 null.
     *
     * @param object    对象
     * @param fieldName 属性名称
     * @return Field 值
     */
    public static Field getDeclaredField(final Object object, final String fieldName) {

        for (Class<?> superClass = object.getClass(); superClass != Object.class;
             superClass = superClass.getSuperclass()) {
            try {
                return superClass.getDeclaredField(fieldName);
            } catch (NoSuchFieldException e) {
                // Field不在当前类定义,继续向上转型
            }
        }
        return null;
    }

    public static boolean isFieldListType(final Class clazz, final String fieldName) throws NoSuchFieldException {

        Field field = clazz.getDeclaredField(fieldName);
        return field.getType().getName().equals("java.util.List");
    }

    public static String getFieldClassName(final Class clazz, final String fieldName) throws Exception {

        Field field = clazz.getDeclaredField(fieldName);
        ParameterizedType type = (ParameterizedType) field.getGenericType();
        String className = type.getActualTypeArguments()[0].toString().substring(6);
        return className;
    }

    /**
     * 获取对象上指定的的对象类型所对应的 Field 名称
     *
     * @param clazz     类型
     * @param className 类名
     * @return String
     */
    public static String getFieldNameByClassName(final Class clazz, final String className) throws Exception {

        String fieldName = "";
        Field[] fieldArray = clazz.newInstance().getClass().getDeclaredFields();
        for (Field field : fieldArray) {
            //System.out.println(field.getType().toString());
            if (field.getType().toString().equals("class " + className)) {
                fieldName = field.getName();
                break;
            }
        }

        return fieldName;
    }


    /**
     * 强行设置Field可访问.
     *
     * @param field Field 对象
     */
    public static void setFieldAccessible(Field field) {

        if (!Modifier.isPublic(field.getModifiers()) || !Modifier.isPublic(field.getDeclaringClass().getModifiers())) {
            field.setAccessible(true);
        }
    }

    /**
     * 执行指定对象的方法
     *
     * @param object     对象
     * @param methodName 方法名
     * @param args       方法参数列表
     * @return Object    方法的执行结果
     * @throws Exception 异常
     */
    public static Object invokeMethod(final Object object, final String methodName, final Object args[]) throws Exception {

        Class<?> parameterType[] = null;

        if (args != null && args.length > 0) {
            parameterType = new Class<?>[args.length];
            for (int j = 0; j < args.length; j++) {
                parameterType[j] = args[j].getClass();
            }
        }

        Method method = object.getClass().getMethod(methodName, parameterType);
        if (!Modifier.isPublic(method.getModifiers()) || !Modifier.isPublic(method.getDeclaringClass().getModifiers())) {
            method.setAccessible(true);
        }

        Object result = method.invoke(object, args);
        return result;
    }

    /**
     * 执行指定的方法
     *
     * @param method 带类定义的方法
     * @param args   方法参数
     * @return Object 方法的执行结果
     * @throws Exception 异常
     */
    public static Object invokeMethod(final String method, final Object args[]) throws Exception {

        int i = method.lastIndexOf(".");
        String className = method.substring(0, i);
        String methodName = method.substring(i + 1);
        Object object = Class.forName(className).newInstance();
        Object result = invokeMethod(object, methodName, args);
        return result;
    }

    /**
     * 将对象序列化成字符串
     *
     * @param object 对象
     * @return String
     * @throws Exception 异常
     */
    public static String serializeObjectToString(Serializable object) throws Exception {

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ObjectOutputStream oos = new ObjectOutputStream(baos);
        oos.writeObject(object);

        // 注意:编码不能用 UTF-8,否则无法反系列化.其他编码未做测试
        String objString = baos.toString("ISO-8859-1");
        String encodedString = URLEncoder.encode(objString, "UTF-8");

        return encodedString;
    }

    /**
     * 将字符串反序列化对象
     *
     * @param objectString 对象序列化的字符串
     * @return Object
     * @throws Exception 异常
     */
    public static Object deserializeObjectFromString(final String objectString) throws Exception {

        String deEncodeString = URLDecoder.decode(objectString, "UTF-8");
        ByteArrayInputStream bais = new ByteArrayInputStream(deEncodeString.getBytes("ISO-8859-1"));
        ObjectInputStream ios = new ObjectInputStream(bais);
        Object obj = ios.readObject();

        return obj;
    }
}
