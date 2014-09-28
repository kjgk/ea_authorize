package com.withub.model.system.config;

import java.io.*;

public abstract class AbstractBaseConfigInfo implements Serializable {

    private String objectId;

    public String getObjectId() {
        return objectId;
    }

    public void setObjectId(String objectId) {
        this.objectId = objectId;
    }

}
