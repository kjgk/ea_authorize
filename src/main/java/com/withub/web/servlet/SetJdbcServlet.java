package com.withub.web.servlet;

import com.withub.dao.BaseDao;
import com.withub.model.system.config.AuthorizationInfo;
import com.withub.model.system.config.SystemConfigInfo;
import com.withub.service.ConfigurationService;
import com.withub.web.common.util.StringUtil;
import net.sf.json.JSONObject;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.Map;


public class SetJdbcServlet extends HttpServlet {

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        Map map = new HashMap();
        map.put("dataBaseIp", request.getParameter("dataBaseIp"));
        map.put("dataBasePort", request.getParameter("dataBasePort"));
        map.put("dataBaseName", request.getParameter("dataBaseName"));
        map.put("userName", request.getParameter("userName"));
        map.put("password", request.getParameter("password"));

        request.getSession().setAttribute("jdbc", map);

        BaseDao baseDao = new BaseDao();
        JSONObject jsonObject = new JSONObject();
        try {
            baseDao.getConnection(map);
            jsonObject.put("success", true);
            ConfigurationService configurationService = new ConfigurationService();
            AuthorizationInfo authorizationInfo= configurationService.getAuthorizationInfo(map);
            request.getSession().setAttribute("systemAuthorize", StringUtil.isEmpty(authorizationInfo.getSystemAuthorizationCode()) ? "" : "OK");
            jsonObject.put("systemAuthorize", StringUtil.isNotEmpty(String.valueOf(request.getSession().getAttribute("systemAuthorize"))));
            jsonObject.put("authorizationInfo", authorizationInfo);
        } catch (Exception e) {
            jsonObject.put("message1", e.getMessage());
            jsonObject.put("message2", e.toString());
        }

        response.setContentType("application/x-json;charset=UTF-8");
        PrintWriter out = response.getWriter();
        out.print(jsonObject.toString());
        out.flush();
        out.close();
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        doPost(request, response);
    }
}
