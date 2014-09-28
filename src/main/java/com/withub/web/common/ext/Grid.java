package com.withub.web.common.ext;

/**
 * Ext中grid加载的数据
 */
public class Grid {
    private Object items;
    private int totalCount;
    private String id;
    private Object userData;

    public Grid() {
    }

    public Grid(Object items, int totalCount, String id) {
        this.items = items;
        this.totalCount = totalCount;
        this.id = id;
    }

    public Object getItems() {
        return items;
    }

    public void setItems(Object items) {
        this.items = items;
    }

    public int getTotalCount() {
        return totalCount;
    }

    public void setTotalCount(int totalCount) {
        this.totalCount = totalCount;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Object getUserData() {
        return userData;
    }

    public void setUserData(Object userData) {
        this.userData = userData;
    }
}
