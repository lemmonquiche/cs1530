package cs._1530;

import org.eclipse.jetty.server.Server;

/**
 * see https://stackoverflow.com/questions/14390577/how-to-add-servlet-filter-with-embedded-jetty
 * for more info
 */
public class JettyServer {
    public static void main(String[] args) {
        Server server = new Server(8080);
        server.setHandler(new App());
        try {
            server.start();
            server.join();
        } catch (InterruptedException e) {
            e.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
