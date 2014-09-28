<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<c:set var="path" value="${pageContext.request.contextPath}"/>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head>
    <title>EA系统授权管理</title>
    <link rel="stylesheet" type="text/css" href="${path}/scripts/extjs/resources/css/ext-all-neptune-debug.css"/>

    <script type="text/javascript" src="${path}/scripts/extjs/ext-all.js"></script>
    <script type="text/javascript" src="${path}/scripts/extjs/locale/ext-lang-zh_CN.js"></script>
    <script type="text/javascript" src="${path}/scripts/withub/common.js"></script>
    <script type="text/javascript" src="${path}/scripts/withub/ext/util/RendererUtil.js"></script>
    <script type="text/javascript">
        PageContext.contextPath = '${path}';
    </script>
    <script type="text/javascript" src="${path}/scripts/withub/ext/ex.js"></script>
    <script type="text/javascript" src="${path}/scripts/withub/ext/setup.js"></script>
    <script type="text/javascript">
        Ext.onReady(function () {
            Ext.create('withub.ext.Main', {
            });
        });

    </script>


</head>
<body oncontextmenu='return false;' style="padding: 0px; margin: 0px">

</body>
</html>