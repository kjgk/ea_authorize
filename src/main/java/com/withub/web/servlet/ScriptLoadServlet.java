package com.withub.web.servlet;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class ScriptLoadServlet extends HttpServlet {

    protected void service(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String packagePrefix = "withub.ext";
        String rootDirectory = "/WEB-INF/pages";

        String fileName;
        String requestUri = req.getRequestURI();
        if (requestUri.endsWith(".js")) {
            fileName = requestUri.replaceAll(req.getContextPath() + req.getServletPath(), "");
        } else {
            String className = requestUri.replaceAll(req.getServletPath(), "").replaceAll("/", "");
            fileName = className.replaceAll(packagePrefix, "").replaceAll("[.]", "/") + ".js";
        }
        req.getRequestDispatcher(rootDirectory + fileName).forward(req, resp);
    }
}
