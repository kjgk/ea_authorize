package com.withub.web.common.ext;

import java.util.HashMap;
import java.util.Map;

public class TreeNode {

    //============================= 属性声明 =============================================================

    private String id;

    private String text;

    private boolean leaf;

    private boolean expanded;

    private String iconCls;

    private String cls;

    private String type;

    private String objectId;

    private Integer orderNo;

    private Map attributes = new HashMap();

    public static final String ROOT = "Root";

    public static final String NODE_SPLITTER = "_";

    //============================= 属性方法 =============================================================

    public String getId() {

        return id;
    }

    public void setId(String id) {

        this.id = id;
    }

    public String getText() {

        return text;
    }

    public void setText(String text) {

        this.text = text;
    }

    public boolean isLeaf() {

        return leaf;
    }

    public void setLeaf(boolean leaf) {

        this.leaf = leaf;
    }

    public boolean isExpanded() {

        return expanded;
    }

    public void setExpanded(boolean expanded) {

        this.expanded = expanded;
    }

    public String getIconCls() {

        return iconCls;
    }

    public void setIconCls(String iconCls) {

        this.iconCls = iconCls;
    }

    public String getType() {

        return type;
    }

    public void setType(String type) {

        this.type = type;
        if (this.objectId != null) {
            this.id = type + NODE_SPLITTER + this.objectId;
        }
    }

    public String getObjectId() {

        return objectId;
    }

    public void setObjectId(String objectId) {

        this.objectId = objectId;
        if (this.type != null) {
            this.id = type + NODE_SPLITTER + this.objectId;
        } else {
            this.id = this.objectId;
        }
    }

    public Integer getOrderNo() {

        return orderNo;
    }

    public void setOrderNo(Integer orderNo) {

        this.orderNo = orderNo;
    }

    public Map getAttributes() {

        return attributes;
    }

    public void setAttributes(Map attributes) {

        this.attributes = attributes;
    }

    public String getCls() {

        return cls;
    }

    public void setCls(String cls) {

        this.cls = cls;
    }

    public static String splitNode(String str, int index) {
        return str.split("[" + NODE_SPLITTER + "]")[index];
    }
}
