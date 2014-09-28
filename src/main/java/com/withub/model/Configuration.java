package com.withub.model;


public class Configuration {

    private  String objectId;

    private String className;

    private String relatedObjectId;

    private String value;

    public String getObjectId() {

        return objectId;
    }

    public void setObjectId(String objectId) {

        this.objectId = objectId;
    }

    public String getClassName() {

        return className;
    }

    public void setClassName(String className) {

        this.className = className;
    }

    public String getRelatedObjectId() {

        return relatedObjectId;
    }

    public void setRelatedObjectId(String relatedObjectId) {

        this.relatedObjectId = relatedObjectId;
    }

    public String getValue() {

        return value;
    }

    public void setValue(String value) {

        this.value = value;
    }
}
