package com.withub.service;

import com.withub.dao.BaseDao;
import com.withub.model.Widget;
import com.withub.model.WidgetCategory;
import com.withub.model.system.config.AbstractBaseConfigInfo;
import com.withub.model.system.config.SystemConfigInfo;
import com.withub.web.common.util.Md5Util;
import com.withub.web.common.util.ReflectionUtil;
import com.withub.web.common.util.StringUtil;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class WidgetService {

    public WidgetCategory getRootEntity(Map jdbc) throws Exception {

        if (jdbc == null || jdbc.size() == 0) {
            return null;
        }

        BaseDao baseDao = new BaseDao();

        String sql = "select objectId,name,orderNo  from  ea_widgetcategory where parentid is null";

        Connection connection = null;
        Statement statement = null;
        WidgetCategory widgetCategory = null;
        try {
            connection = baseDao.getConnection(jdbc);
            statement = connection.createStatement();
            ResultSet resultSet = statement.executeQuery(sql);
            resultSet.next();

            widgetCategory = new WidgetCategory();
            widgetCategory.setObjectId(resultSet.getString(1));
            widgetCategory.setName(resultSet.getString(2));
            widgetCategory.setOrderNo(resultSet.getInt(3));
        } finally {
            baseDao.closeConnection(connection, statement);
        }
        return widgetCategory;
    }

    public List<WidgetCategory> listByWidgetCatagoryParentId(Map jdbc, String parentId) throws Exception {

        if (jdbc == null || jdbc.size() == 0) {
            return null;
        }

        BaseDao baseDao = new BaseDao();

        String sql = "select objectId,name,orderNo  from  ea_widgetcategory  where parentid = '" + parentId + "' order by orderNo";

        Connection connection = null;
        Statement statement = null;
        List<WidgetCategory> widgetCategoryList = null;
        try {
            connection = baseDao.getConnection(jdbc);
            statement = connection.createStatement();
            ResultSet resultSet = statement.executeQuery(sql);

            widgetCategoryList = new ArrayList<WidgetCategory>();
            while (resultSet.next()) {
                WidgetCategory widgetCategory = new WidgetCategory();
                widgetCategory.setObjectId(resultSet.getString(1));
                widgetCategory.setName(resultSet.getString(2));
                widgetCategory.setOrderNo(resultSet.getInt(3));
                widgetCategoryList.add(widgetCategory);
            }
        } finally {
            baseDao.closeConnection(connection, statement);
        }
        return widgetCategoryList;
    }

    public List<Widget> listByWidgetCatagoryId(Map jdbc, String parentId) throws Exception {

        if (jdbc == null || jdbc.size() == 0) {
            return null;
        }

        BaseDao baseDao = new BaseDao();

        String sql = "select objectId,name,widgetTag,license " +
                "from ea_widget  where widgetCategoryId = '" + parentId + "' and objectStatus =1 order by orderNo";

        Connection connection = null;
        Statement statement = null;
        List<Widget> widgetList = null;
        try {
            connection = baseDao.getConnection(jdbc);
            statement = connection.createStatement();
            ResultSet resultSet = statement.executeQuery(sql);
            widgetList = new ArrayList<Widget>();
            while (resultSet.next()) {
                Widget widget = new Widget();
                widget.setObjectId(resultSet.getString(1));
                widget.setName(resultSet.getString(2));
                widget.setWidgetTag(resultSet.getString(3));
                widget.setLicense(resultSet.getString(4));
                widgetList.add(widget);
            }
        } finally {
            baseDao.closeConnection(connection, statement);
        }
        return widgetList;
    }

    public WidgetCategory getParentWidgetCategoryByObjectId(Map jdbc, String objectId) throws Exception {

        if (jdbc == null || jdbc.size() == 0) {
            return null;
        }

        BaseDao baseDao = new BaseDao();

        String sql = "select a.objectId,a.name,a.orderNo  from  ea_widgetcategory a   " +
                "  left join  ea_widgetcategory  b on a.objectid=b.parentid " +
                "  where b.objectId ='" + objectId + "'";

        WidgetCategory widgetCategory = null;
        Connection connection = null;
        Statement statement = null;
        try {
            connection = baseDao.getConnection(jdbc);
            statement = connection.createStatement();
            ResultSet resultSet = statement.executeQuery(sql);
            resultSet.next();
            widgetCategory = new WidgetCategory();
            widgetCategory.setObjectId(resultSet.getString(1));
            widgetCategory.setName(resultSet.getString(2));
            widgetCategory.setOrderNo(resultSet.getInt(3));
        } finally {
            baseDao.closeConnection(connection, statement);
        }
        return widgetCategory;
    }

    public int updateWidgetAuthorize(Map jdbc, String objectId, int authorize) throws Exception {

        if (jdbc == null || jdbc.size() == 0) {
            return 0;
        }
        int result = 0;
        BaseDao baseDao = new BaseDao();
        Connection connection = null;
        Statement statement = null;
        try {
            connection = baseDao.getConnection(jdbc);
            statement = connection.createStatement();
            String license = "";
            if (authorize == 1) {
                String sql = "select objectId,widgetTag from ea_widget where 1=1 and objectId = '" + objectId + "' ";
                ResultSet resultSet = statement.executeQuery(sql);
                resultSet.next();
                String widgetTag = resultSet.getString(2);
                sql = "select objectId,value from ea_configuration where 1=1 and relatedObjectId = 'SYSTEM' ";
                resultSet = statement.executeQuery(sql);
                resultSet.next();
                Object object = ReflectionUtil.deserializeObjectFromString(resultSet.getString(2));
                AbstractBaseConfigInfo configInfo = (AbstractBaseConfigInfo) object;
                SystemConfigInfo systemConfigInfo = (SystemConfigInfo) configInfo;
                String uniqueCodes[] = systemConfigInfo.getUniqueCode().split(",");
                for (String s : uniqueCodes) {
                    license += "," + Md5Util.getStringMD5(widgetTag + s).toUpperCase();
                }
                license = StringUtil.isEmpty(license) ? license : license.substring(1);
            }
            String sql = "update ea_widget set license = '" + license + "' where objectId ='" + objectId + "' ";
            result = statement.executeUpdate(sql);
        } finally {
            baseDao.closeConnection(connection, statement);
        }
        return result;
    }
}
