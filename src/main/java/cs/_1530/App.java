package cs._1530;

import io.vertx.core.Handler;
import io.vertx.core.Vertx;
import io.vertx.core.http.HttpMethod;
import io.vertx.core.http.HttpServer;
import io.vertx.core.http.HttpServerRequest;
import io.vertx.core.http.HttpServerResponse;
import io.vertx.ext.web.Route;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.RoutingContext;
import io.vertx.ext.web.handler.BodyHandler;

/**
 * Hello world!
 */
public class App {
    public static void main(String[] args) {
        Vertx vertx = Vertx.vertx();
        HttpServer server = vertx.createHttpServer();

        Router router = Router.router(vertx);
        Route route = router.route();
        route.path("/");
        route.handler(new Handler<>() {
            @Override
            public void handle(RoutingContext routingContext) {
                HttpServerResponse response = routingContext.response();
                response.putHeader("content-type", "text/html");

                response.end("<h1>Hello World from Vert.x-Web!</h1>" +
                        "<p><a href=\"/experiments\">See more</a></p>.");
            }
        });

        Router experiments = Router.router(vertx);
        addGetRoute(experiments);
        addPostRoute(experiments);
        router.mountSubRouter("/experiments", experiments);

        server.requestHandler(router::accept).listen(8080);

        vertx.setPeriodic(1000, new Handler<Long>() {
            @Override
            public void handle(Long aLong) {
                double totalMemory = Runtime.getRuntime().totalMemory() / 1000000.0;
                double freeMemory = Runtime.getRuntime().freeMemory() / 1000000.0;
                System.out.println("used memory in MB: " + (totalMemory - freeMemory));
            }
        });
    }

    public static void addGetRoute(Router router) {
        Route route = router.route();
        route.path("/");
        route.method(HttpMethod.GET);
        route.handler(new Handler<RoutingContext>() {
            @Override
            public void handle(RoutingContext routingContext) {
                HttpServerResponse response = routingContext.response();
                response.putHeader("content-type", "text/html");
                response.end("<form action=\"\" method=\"post\">\n" +
                        "  <label for=\"nameInput\">Name</label>\n" +
                        "  <input type=\"text\" name=\"name\" id=\"nameInput\" />\n" +
                        "  <label for=\"sentimentInput\">Rating</label>\n" +
                        "  <input type=\"text\" name=\"sentiment\" id=\"sentimentInput\" />\n" +
                        "  <input type=\"submit\">\n" +
                        "</form>");
            }
        });
    }

    public static void addPostRoute(Router router) {
        Route route = router.route();
        route.path("/");
        route.method(HttpMethod.POST);
        route.handler(BodyHandler.create());
        route.handler(new Handler<RoutingContext>() {
            @Override
            public void handle(RoutingContext routingContext) {
                System.out.println("handling post");
                HttpServerRequest request = routingContext.request();
                String name = request.getParam("name");
                String sentiment = request.getParam("sentiment");
                HttpServerResponse response = routingContext.response();
                response.setChunked(true);
                response.write("<p>\n" +
                        "  Hi,\n" +
                        "  <span style=\"font-weight: bold;\">\n" +
                        name == null ? "$USER" : name +
                        "  </span>\n! You think Java webapps are\n" +
                        "  <span style=\"text-decoration: underline;\">\n" +
                        sentiment == null ? "boring" : sentiment +
                        "  </span>.\n" +
                        "</p>");
                response.end();

            }
        });
    }

    public int getThree() {
        return 3;
    }
}
