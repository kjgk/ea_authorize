package com.withub.web.servlet;


import com.withub.model.Widget;
import com.withub.model.system.config.AuthorizationInfo;
import com.withub.service.ConfigurationService;
import com.withub.service.WidgetService;
import com.withub.web.common.util.StringUtil;
import net.sf.json.JSONObject;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class WidgetServlet extends HttpServlet {

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        WidgetService widgetService = new WidgetService();
        Map jdbc = (Map) request.getSession().getAttribute("jdbc");
        JSONObject jsonObject = new JSONObject();

        String[] strings = request.getRequestURI().split("\\/");
        if (strings[strings.length - 1].equals("authorize")) {
            String objectId = request.getParameter("objectId");
            try {
                int result = widgetService.updateWidgetAuthorize(jdbc, objectId, 1);
                jsonObject.put("success", result > 0);
            } catch (Exception e) {
                e.printStackTrace();
            }
        } else if (strings[strings.length - 1].equals("deauthorize")) {
            String objectId = request.getParameter("objectId");
            try {
                int result = widgetService.updateWidgetAuthorize(jdbc, objectId, 0);
                jsonObject.put("success", result > 0);
            } catch (Exception e) {
                e.printStackTrace();
            }
        } else {
            String id = request.getParameter("id");
            List<Widget> widgetList = null;
            try {
                widgetList = widgetService.listByWidgetCatagoryId(jdbc, id);
            } catch (Exception e) {
                e.printStackTrace();
            }

            if (widgetList == null || widgetList.size() == 0) {
                return;
            }
            ConfigurationService configurationService = new ConfigurationService();
            try {
                AuthorizationInfo authorizationInfo = configurationService.getAuthorizationInfo(jdbc);
                ArrayList<HashMap> items = new ArrayList<HashMap>();
                for (Widget widget : widgetList) {
                    HashMap<String, Object> item = new HashMap<String, Object>();
                    item.put("objectId", widget.getObjectId());
                    item.put("name", widget.getName());
                    item.put("widgetTag", widget.getWidgetTag());
                    item.put("license", StringUtil.authorize(authorizationInfo.getSystemUniqueCode(), widget.getLicense(), widget.getWidgetTag()) ? "授权" : "");
                    items.add(item);
                }
                jsonObject.put("items", items);
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
