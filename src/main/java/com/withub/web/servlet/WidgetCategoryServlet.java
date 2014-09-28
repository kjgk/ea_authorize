package com.withub.web.servlet;

import com.withub.model.WidgetCategory;
import com.withub.service.WidgetService;
import com.withub.web.common.ext.TreeNode;
import com.withub.web.common.util.StringUtil;
import net.sf.json.JSONObject;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class WidgetCategoryServlet extends HttpServlet {

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        if (StringUtil.isEmpty(String.valueOf(request.getSession().getAttribute("systemAuthorize")))) {
            return;
        }

        String nodeId = request.getParameter("node");
        JSONObject jsonObject = new JSONObject();

        String[] strings = request.getRequestURI().split("\\/");
        if (strings[strings.length - 1].equals("loadManagerTree")) {
            ArrayList<TreeNode> nodes = loadManagerTree(request, nodeId);
            jsonObject.put("nodes", nodes);
        } else {
            try {
                ArrayList<String> nodes = loadTreePath(request, nodeId);
                jsonObject.put("nodes", nodes);
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

    public ArrayList<TreeNode> loadManagerTree(HttpServletRequest request, String nodeId) {

        Map jdbc = (Map) request.getSession().getAttribute("jdbc");
        ArrayList<TreeNode> nodes = new ArrayList<TreeNode>();
        WidgetService widgetService = new WidgetService();

        if (nodeId.equalsIgnoreCase(TreeNode.ROOT)) {
            WidgetCategory root = null;
            try {
                root = widgetService.getRootEntity(jdbc);
            } catch (Exception e) {
                e.printStackTrace();
            }
            TreeNode node = new TreeNode();
            node.setObjectId(root.getObjectId());
            node.setText(root.getName());
            node.setLeaf(false);
            node.setType(WidgetCategory.class.getSimpleName());
            node.setExpanded(true);
            nodes.add(node);
        } else {
            String id = nodeId.split("_")[1];
            List<WidgetCategory> widgetCategoryList = null;
            try {
                widgetCategoryList = widgetService.listByWidgetCatagoryParentId(jdbc, id);
            } catch (Exception e) {
                e.printStackTrace();
            }
            if (widgetCategoryList == null || widgetCategoryList.size() == 0) {
                return null;
            }
            for (WidgetCategory child : widgetCategoryList) {
                TreeNode node = new TreeNode();
                node.setObjectId(child.getObjectId());
                node.setText(child.getName());
                try {
                    node.setLeaf(widgetService.listByWidgetCatagoryParentId(jdbc, child.getObjectId()).size() == 0);
                } catch (Exception e) {
                    e.printStackTrace();
                }
                node.setType(WidgetCategory.class.getSimpleName());
                node.setOrderNo(child.getOrderNo());
                nodes.add(node);
            }
        }

        return nodes;
    }

    public ArrayList<String> loadTreePath(HttpServletRequest request, String nodeId) throws Exception {

        ArrayList<String> nodes = new ArrayList<String>();

        Map jdbc = (Map) request.getSession().getAttribute("jdbc");
        WidgetService widgetService = new WidgetService();

        if (nodeId.equalsIgnoreCase(TreeNode.ROOT)) {
            return null;
        }
        WidgetCategory widget = widgetService.getParentWidgetCategoryByObjectId(jdbc, nodeId);
        if (widget == null) {
            return null;
        } else {
            nodes.add(widget.getObjectId());
            loadTreePath(request, widget.getObjectId());
        }

        return nodes;

    }
}
