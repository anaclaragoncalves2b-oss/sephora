
import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpExchange;
import java.io.IOException;
import java.net.InetSocketAddress;
import java.nio.file.Files;
import java.nio.file.Path;

public class Main {

    public static void main(String[] args) throws IOException {
        int port = 8080;
        Path root = Path.of(".").toAbsolutePath().normalize();

        HttpServer server = HttpServer.create(
            new InetSocketAddress(port), 0
        );

        server.createContext("/", Main::handleRequest);
        server.setExecutor(null);

        System.out.println(
            "Beauty Store disponível em http://localhost:" + port
        );
        server.start();
    }

    private static void handleRequest(HttpExchange exchange)
            throws IOException {

        String path = exchange.getRequestURI().getPath();

        if (path.equals("/")) {
            path = "/index.html";
        }

        Path root = Path.of(".").toAbsolutePath().normalize();
        Path file = root.resolve(path.substring(1)).normalize();

        if (!file.startsWith(root) || !Files.isRegularFile(file)) {
            send(exchange, 404, "text/plain; charset=UTF-8",
                "Arquivo não encontrado".getBytes());
            return;
        }

        String type = switch (file.getFileName().toString()) {
            case "index.html" -> "text/html; charset=UTF-8";
            case "style.css" -> "text/css; charset=UTF-8";
            case "script.js" -> "text/javascript; charset=UTF-8";
            default -> "application/octet-stream";
        };

        send(exchange, 200, type, Files.readAllBytes(file));
    }

    private static void send(
            HttpExchange exchange,
            int status,
            String type,
            byte[] content
    ) throws IOException {

        exchange.getResponseHeaders().set(
            "Content-Type", type
        );

        exchange.getResponseHeaders().set(
            "X-Content-Type-Options", "nosniff"
        );

        exchange.getResponseHeaders().set(
            "Content-Security-Policy",
            "default-src 'self'; style-src 'self' 'unsafe-inline'; " +
            "script-src 'self'; img-src 'self' data:; " +
            "connect-src 'self'; object-src 'none'; base-uri 'self'"
        );

        exchange.sendResponseHeaders(status, content.length);
        try (var output = exchange.getResponseBody()) {
            output.write(content);
        }
    }
}