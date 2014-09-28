package com.withub.service;


import com.withub.dao.BaseDao;
import com.withub.model.system.config.AbstractBaseConfigInfo;
import com.withub.model.system.config.AuthorizationInfo;
import com.withub.model.system.config.SystemConfigInfo;
import com.withub.web.common.util.DateUtil;
import com.withub.web.common.util.Md5Util;
import com.withub.web.common.util.ReflectionUtil;
import com.withub.web.common.util.StringUtil;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.Date;
import java.util.Map;

public class ConfigurationService {

    public int updateSystemConfigInfo(Map jdbc, int authorize) throws Exception {

        if (jdbc == null || jdbc.size() == 0) {
            return 0;
        }

        BaseDao baseDao = new BaseDao();
        String sql = "select objectId,value from ea_configuration where 1=1 and relatedobjectid = 'SYSTEM' ";
        Connection connection = baseDao.getConnection(jdbc);
        Statement statement = connection.createStatement();
        ResultSet resultSet = statement.executeQuery(sql);
        resultSet.next();

        Object object = ReflectionUtil.deserializeObjectFromString(resultSet.getString(2));
        AbstractBaseConfigInfo configInfo = (AbstractBaseConfigInfo) object;
        SystemConfigInfo systemConfigInfo = (SystemConfigInfo) configInfo;
        if (authorize == 1) {
            String uniqueCodes[] = systemConfigInfo.getUniqueCode().split(",");
            String authorizationCodes = "";
            for (String s : uniqueCodes) {
                authorizationCodes += "," + Md5Util.getStringMD5("" + s).toUpperCase();
            }
            authorizationCodes = StringUtil.isEmpty(authorizationCodes) ? authorizationCodes : authorizationCodes.substring(1);
            systemConfigInfo.setAuthorizationCode(authorizationCodes);
            systemConfigInfo.setAuthorizationTime(DateUtil.getDateFormatString(new Date(), DateUtil.STANDARD_DATETIME_FORMAT));
        } else {
            systemConfigInfo.setAuthorizationCode(null);
            systemConfigInfo.setAuthorizationTime(null);
        }
        String value = ReflectionUtil.serializeObjectToString(systemConfigInfo);
        sql = "update ea_configuration set value = '" + value + "' where objectId = '" + resultSet.getString(1) + "'";
        return statement.executeUpdate(sql);
    }

    public AuthorizationInfo getAuthorizationInfo(Map jdbc) throws Exception {

        if (jdbc == null || jdbc.size() == 0) {
            return null;
        }

        BaseDao baseDao = new BaseDao();
        String sql = "select objectId,value from ea_configuration where 1=1 and relatedobjectid = 'SYSTEM' ";
        Connection connection = baseDao.getConnection(jdbc);
        Statement statement = connection.createStatement();
        ResultSet resultSet = statement.executeQuery(sql);
        resultSet.next();

        Object object = ReflectionUtil.deserializeObjectFromString(resultSet.getString(2));
        AbstractBaseConfigInfo configInfo = (AbstractBaseConfigInfo) object;
        SystemConfigInfo systemConfigInfo = (SystemConfigInfo) configInfo;
        AuthorizationInfo authorizationInfo = new AuthorizationInfo();
        authorizationInfo.setSystemUniqueCode(systemConfigInfo.getUniqueCode());
        if (StringUtil.authorize(systemConfigInfo.getUniqueCode(), systemConfigInfo.getAuthorizationCode(), "")) {
            authorizationInfo.setSystemAuthorizationCode(systemConfigInfo.getAuthorizationCode());
            authorizationInfo.setSystemAuthorizationTime(systemConfigInfo.getAuthorizationTime());
        }
        return authorizationInfo;
    }

}
