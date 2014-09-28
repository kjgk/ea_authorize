package com.withub.web.common.ext;

import java.util.ArrayList;
import java.util.List;

public class StaticCheckedTreeNode extends TreeNode {

    private List<TreeNode> children = new ArrayList<TreeNode>();

    private boolean checked;

    public boolean isChecked() {
        return checked;
    }

    public void setChecked(boolean checked) {
        this.checked = checked;
    }

    public List<TreeNode> getChildren() {
        return children;
    }

    public void setChildren(List<TreeNode> children) {
        this.children = children;
    }
}
