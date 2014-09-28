package com.withub.model.system.config;


import java.util.Date;

public final class SystemConfigInfo extends AbstractBaseConfigInfo {

    private static final long serialVersionUID = 1L;

    //================================ 属性声明 ===========================================================

    private Integer beginYear;

    private String jciUrl;

    private String loginPageTheme;

    private String tempDirectory;

    private String pictureDirectory;

    private String reportExportDirectory;

    private String uniqueCode;

    private String authorizationCode;

    private String authorizationTime;

    //================================ 属性方法 ===========================================================

    public Integer getBeginYear() {

        return beginYear;
    }

    public void setBeginYear(Integer beginYear) {

        this.beginYear = beginYear;
    }

    public String getJciUrl() {

        return jciUrl;
    }

    public void setJciUrl(String jciUrl) {

        this.jciUrl = jciUrl;
    }

    public String getLoginPageTheme() {

        return loginPageTheme;
    }

    public void setLoginPageTheme(String loginPageTheme) {

        this.loginPageTheme = loginPageTheme;
    }

    public String getTempDirectory() {

        return tempDirectory;
    }

    public void setTempDirectory(String tempDirectory) {

        this.tempDirectory = tempDirectory;
    }

    public String getPictureDirectory() {

        return pictureDirectory;
    }

    public void setPictureDirectory(String pictureDirectory) {

        this.pictureDirectory = pictureDirectory;
    }

    public static long getSerialVersionUID() {

        return serialVersionUID;
    }

    public String getReportExportDirectory() {

        return reportExportDirectory;
    }

    public void setReportExportDirectory(String reportExportDirectory) {

        this.reportExportDirectory = reportExportDirectory;
    }

    public String getUniqueCode() {

        return uniqueCode;
    }

    public void setUniqueCode(String uniqueCode) {

        this.uniqueCode = uniqueCode;
    }

    public String getAuthorizationCode() {

        return authorizationCode;
    }

    public void setAuthorizationCode(String authorizationCode) {

        this.authorizationCode = authorizationCode;
    }

    public String getAuthorizationTime() {

        return authorizationTime;
    }

    public void setAuthorizationTime(String authorizationTime) {

        this.authorizationTime = authorizationTime;
    }
}
