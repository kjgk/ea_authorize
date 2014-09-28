package com.withub.web.servlet;

import com.withub.model.system.config.AuthorizationInfo;
import com.withub.service.ConfigurationService;
import com.withub.web.common.util.StringUtil;
import net.sf.json.JSONObject;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Map;

public class ConfigurationServlet extends HttpServlet {

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        ConfigurationService configurationService = new ConfigurationService();
        Map jdbc = (Map) request.getSession().getAttribute("jdbc");
        JSONObject jsonObject = new JSONObject();

        String[] strings = request.getRequestURI().split("\\/");
        if (strings[strings.length - 1].equals("authorize")) {
            try {
                int result = configurationService.updateSystemConfigInfo(jdbc, 1);
                request.getSession().setAttribute("systemAuthorize","OK");
                AuthorizationInfo authorizationInfo= configurationService.getAuthorizationInfo(jdbc);
                jsonObject.put("authorizationInfo", authorizationInfo);
                jsonObject.put("success", result > 0);
            } catch (Exception e) {
                e.printStackTrace();
            }
        } else {
            try {
                int result = configurationService.updateSystemConfigInfo(jdbc, 0);
                request.getSession().setAttribute("systemAuthorize","");
                AuthorizationInfo authorizationInfo= configurationService.getAuthorizationInfo(jdbc);
                jsonObject.put("authorizationInfo", authorizationInfo);
                jsonObject.put("success", result > 0);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        response.setContentType("application/x-json;charset=UTF-8");
        PrintWriter out = response.getWriter();
        out.print(jsonObject.toString());
        out.flush();
        out.close();
    }
}
