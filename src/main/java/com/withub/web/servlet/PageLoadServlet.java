package com.withub.web.servlet;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.IOException;

public class PageLoadServlet extends HttpServlet {

    protected void service(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        String packagePrefix = "withub.ext";
        String rootDirectory = "/WEB-INF/pages";

        String rep = req.getContextPath() + req.getServletPath() + "/";
        String page = req.getRequestURI().replaceAll(rep, "");


        if (page.endsWith(".page")) {
            req.getRequestDispatcher(rootDirectory + "/" + page.replaceAll(".page", ".jsp")).forward(req, resp);
        } else {
            String jspPage = rootDirectory + page.replaceAll(packagePrefix, "").replaceAll("[.]", "/") + ".jsp";
            File file = new File(req.getSession().getServletContext().getRealPath(jspPage));
            if (file.exists()) {
                req.setAttribute("jspPage", jspPage);
            }
            req.setAttribute("page", page);
            req.getRequestDispatcher(rootDirectory + "/page.jsp").forward(req, resp);
        }
    }
}
