package com.withub.dao;

import java.sql.*;
import java.util.Map;

public class BaseDao {

    public Connection getConnection(Map jdbc) throws Exception {

        Connection connection;
        String driverClass = "org.postgresql.Driver";
        String jdbcUrl = "jdbc:postgresql://%s:%d/%s";
        jdbcUrl = String.format(jdbcUrl, jdbc.get("dataBaseIp").toString(), Integer.parseInt(jdbc.get("dataBasePort").toString()), jdbc.get("dataBaseName").toString());
        try {
            Class.forName(driverClass);
            connection = DriverManager.getConnection(jdbcUrl, jdbc.get("userName").toString(), jdbc.get("password").toString());
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
        return connection;
    }

    public void closeConnection(Connection connection) {

        if (connection != null) {
            try {
                connection.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }

    public void closeConnection(Connection connection, Statement statement) {

        if (statement != null) {
            try {
                statement.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }

        if (connection != null) {
            try {
                connection.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }

    public ResultSet executeQuery(Map jdbc, String sql) throws Exception {

        if (jdbc == null || jdbc.size() == 0) {
            return null;
        }
        Connection connection = getConnection(jdbc);
        Statement statement = connection.createStatement();
        ResultSet resultSet = statement.executeQuery(sql);
        return resultSet;

    }

}
